from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db import transaction

from .models import PetRequest, Pet
from .serializers import PetRequestSerializer, PetSerializer
from notifications.models import Notification


# -------------------------------
# USER: Submit Pet Request
# -------------------------------
class PetRequestCreateView(generics.CreateAPIView):
    queryset = PetRequest.objects.all()
    serializer_class = PetRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        pet_request = serializer.save(user=self.request.user)

        Notification.objects.create(
            user=self.request.user,
            message=f"Your request for '{pet_request.name}' has been submitted.",
            type="request_created",
        )


# -------------------------------
# ADMIN: Get All Pet Requests
# -------------------------------
@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def get_pet_requests(request):
    requests = PetRequest.objects.filter(status="pending").order_by("-created_at")
    serializer = PetRequestSerializer(
        requests,
        many=True,
        context={"request": request},
    )
    return Response(serializer.data)


# -------------------------------
# ADMIN: Approve Pet Request and Create Pet
# -------------------------------
@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def approve_pet_request(request, pk):
    try:
        pet_request = PetRequest.objects.get(id=pk)
    except PetRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if pet_request.status != "pending":
        return Response(
            {"detail": "Only pending requests can be approved."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        Pet.objects.create(
            name=pet_request.name,
            age=pet_request.age,
            color=pet_request.color,
            category=pet_request.category,
            description=pet_request.justification,
            image=pet_request.image,
            owner=pet_request.user,
            status="available",
        )

        pet_request.status = "approved"
        pet_request.save(update_fields=["status"])

    Notification.objects.create(
        user=pet_request.user,
        message=f"Your pet '{pet_request.name}' has been approved.",
        type="approved",
    )

    return Response({"message": "Pet approved and created"})


# -------------------------------
# ADMIN: Reject Pet Request
# -------------------------------
@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def reject_pet_request(request, pk):
    try:
        pet_request = PetRequest.objects.get(id=pk)
    except PetRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if pet_request.status != "pending":
        return Response(
            {"detail": "Only pending requests can be rejected."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    pet_request.status = "rejected"
    pet_request.save(update_fields=["status"])

    Notification.objects.create(
        user=pet_request.user,
        message=f"Your pet '{pet_request.name}' has been rejected.",
        type="rejected",
    )

    return Response({"message": "Pet request rejected"})


# -------------------------------
# PUBLIC: Get Pets (with filters)
# -------------------------------
@api_view(["GET"])
def get_pets(request):
    pets = Pet.objects.all()

    search = request.GET.get("search")
    if search:
        pets = pets.filter(name__icontains=search)

    category = request.GET.get("category")
    if category:
        pets = pets.filter(category_id=category)

    color = request.GET.get("color")
    if color:
        pets = pets.filter(color__icontains=color)

    min_age = request.GET.get("min_age")
    max_age = request.GET.get("max_age")

    if min_age:
        pets = pets.filter(age__gte=min_age)
    if max_age:
        pets = pets.filter(age__lte=max_age)

    status_filter = request.GET.get("status")
    if status_filter:
        pets = pets.filter(status=status_filter)

    serializer = PetSerializer(pets, many=True, context={"request": request})
    return Response(serializer.data)


# -------------------------------
# PUBLIC: Pet Detail
# -------------------------------
@api_view(["GET"])
def get_pet_detail(request, pk):
    try:
        pet = Pet.objects.get(id=pk)
    except Pet.DoesNotExist:
        return Response({"error": "Pet not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PetSerializer(pet, context={"request": request})
    return Response(serializer.data)


# -------------------------------
# PUBLIC: Get Unique Colors
# -------------------------------
@api_view(["GET"])
def get_colors(request):
    colors = (
        Pet.objects.exclude(color__isnull=True)
        .exclude(color__exact="")
        .values_list("color", flat=True)
        .distinct()
    )

    return Response(list(colors))


# -------------------------------
# ADMIN: Pending Pets (for approval UI)
# -------------------------------
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_pet_requests(request):
    pets = Pet.objects.filter(status="pending")

    data = [
        {
            "id": p.id,
            "name": p.name,
            "category_name": p.category.name if p.category else None,
            "owner_email": p.owner.email if p.owner else None,
            "status": p.status,
        }
        for p in pets
    ]

    return Response(data)


# -------------------------------
# ADMIN: Approve Pet (set available)
# -------------------------------
@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_pet(request, pk):
    try:
        pet = Pet.objects.get(id=pk)
    except Pet.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    pet.status = "available"
    pet.save()

    return Response({"message": "Pet approved"})


# -------------------------------
# ADMIN: Reject Pet (delete)
# -------------------------------
@api_view(["POST"])
@permission_classes([IsAdminUser])
def reject_pet(request, pk):
    try:
        pet = Pet.objects.get(id=pk)
    except Pet.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    pet.delete()

    return Response({"message": "Pet rejected"})


# -------------------------------
# ADMIN: Recent Activity (Approvals / Rejections)
# -------------------------------
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_activity(request):
    activities = Notification.objects.filter(
        type__in=["approved", "rejected"]
    ).order_by("-created_at")[:10]

    data = [
        {
            "id": n.id,
            "message": n.message,
            "type": n.type,
            "created_at": n.created_at,
        }
        for n in activities
    ]

    return Response(data)
