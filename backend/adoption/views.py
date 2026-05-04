from rest_framework import generics, permissions, status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import AdoptionRequest
from .serializers import AdoptionRequestSerializer
from notifications.models import Notification


# -------------------------------
# USER: CREATE ADOPTION REQUEST
# -------------------------------
class AdoptionRequestCreateView(generics.CreateAPIView):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        pet = serializer.validated_data.get("pet")

        if pet and pet.status != "available":
            Notification.objects.create(
                user=self.request.user,
                message=f"'{pet.name}' is no longer available",
                type="unavailable",
            )
            raise serializers.ValidationError("Pet is no longer available.")

        if pet and pet.owner_id == self.request.user.id:
            raise serializers.ValidationError("You cannot adopt your own pet.")

        if AdoptionRequest.objects.filter(user=self.request.user, pet=pet).exists():
            Notification.objects.create(
                user=self.request.user,
                message=f"You already requested to adopt '{pet.name}'",
                type="duplicate_request",
            )
            raise serializers.ValidationError("You already requested this pet.")

        adoption = serializer.save(user=self.request.user)

        if adoption.pet and adoption.pet.owner:
            Notification.objects.create(
                user=adoption.pet.owner,
                message=f"{self.request.user.username} requested to adopt '{adoption.pet.name}'.",
                type="adoption_request",
            )


# -------------------------------
# USER: MY ADOPTIONS
# -------------------------------
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def my_adoptions(request):
    adoptions = AdoptionRequest.objects.filter(user=request.user).order_by(
        "-created_at"
    )

    data = [
        {
            "id": a.id,
            "pet_name": a.pet.name if a.pet else None,
            "status": a.status,
            "created_at": a.created_at,
        }
        for a in adoptions
    ]

    return Response(data)


# -------------------------------
# ADMIN: ALL ADOPTIONS
# -------------------------------
@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def all_adoptions(request):
    adoptions = AdoptionRequest.objects.select_related("pet", "user").order_by("-created_at")

    data = [
        {
            "id": a.id,
            "pet_name": a.pet.name if a.pet else None,
            "status": a.status,
            "user": a.user.email if a.user else None,
        }
        for a in adoptions
    ]

    return Response(data)


# -------------------------------
# ADMIN: APPROVE ADOPTION
# -------------------------------
@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def approve_adoption(request, pk):
    try:
        adoption = AdoptionRequest.objects.select_related("pet", "user").get(id=pk)
    except AdoptionRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if adoption.status != "pending":
        return Response(
            {"detail": "Only pending adoption requests can be approved."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if adoption.pet.status != "available":
        return Response(
            {"detail": "This pet is no longer available."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        adoption.status = "approved"
        adoption.save(update_fields=["status"])

        adoption.pet.status = "adopted"
        adoption.pet.save(update_fields=["status"])

        AdoptionRequest.objects.filter(
            pet=adoption.pet,
            status="pending",
        ).exclude(id=adoption.id).update(status="rejected")

    Notification.objects.create(
        user=adoption.user,
        message=f"Your adoption request for '{adoption.pet.name}' was approved.",
        type="adoption_approved",
    )

    if adoption.pet.owner:
        Notification.objects.create(
            user=adoption.pet.owner,
            message=f"Your pet '{adoption.pet.name}' has been successfully adopted.",
            type="pet_adopted",
        )

    return Response({"message": "Adoption approved"})


# -------------------------------
# ADMIN: REJECT ADOPTION
# -------------------------------
@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def reject_adoption(request, pk):
    try:
        adoption = AdoptionRequest.objects.get(id=pk)
    except AdoptionRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if adoption.status != "pending":
        return Response(
            {"detail": "Only pending adoption requests can be rejected."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    adoption.status = "rejected"
    adoption.save(update_fields=["status"])

    Notification.objects.create(
        user=adoption.user,
        message=f"Your adoption request for '{adoption.pet.name}' was rejected.",
        type="adoption_rejected",
    )

    return Response({"message": "Adoption rejected"})
