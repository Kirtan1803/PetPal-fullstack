from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from django.contrib.auth import authenticate, get_user_model

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer
from notifications.models import Notification

User = get_user_model()


# -------------------------------
# REGISTER
# -------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        Notification.objects.create(
            user=user,
            message="Welcome to PetPal! Start exploring pets now.",
            type="welcome",
        )


# -------------------------------
# LOGIN (email OR username)
# -------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):

    identifier = request.data.get("username")
    password = request.data.get("password")

    if not identifier or not password:
        return Response({"error": "Missing fields"}, status=400)

    user = None

    if "@" in identifier:
        try:
            user_obj = User.objects.get(email=identifier.lower())
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=401)
    else:
        user = authenticate(username=identifier, password=password)

    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)
    refresh["username"] = user.username
    refresh["email"] = user.email
    refresh["is_staff"] = user.is_staff

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
        },
    })

# -------------------------------
# GET ALL USERS (ADMIN)
# -------------------------------
@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_users(request):
    users = User.objects.only("id", "username", "email", "is_staff").order_by("-id")

    data = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_staff": u.is_staff,
        }
        for u in users
    ]

    return Response(data, status=status.HTTP_200_OK)


# -------------------------------
# TOGGLE ADMIN ROLE
# -------------------------------
@api_view(["POST"])
@permission_classes([IsAdminUser])
def toggle_admin(request, pk):
    user = User.objects.filter(id=pk).first()

    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if user == request.user:
        return Response(
            {"detail": "You cannot change your own role"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.is_staff = not user.is_staff
    user.save(update_fields=["is_staff"])

    return Response(
        {"detail": "User role updated"},
        status=status.HTTP_200_OK,
    )


# -------------------------------
# DELETE USER
# -------------------------------
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    user = User.objects.filter(id=pk).first()

    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if user == request.user:
        return Response(
            {"detail": "You cannot delete your own account"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.delete()

    return Response(
        {"detail": "User deleted"},
        status=status.HTTP_200_OK,
    )
