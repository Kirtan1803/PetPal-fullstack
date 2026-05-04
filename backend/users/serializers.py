from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


# -------------------------------
# REGISTER SERIALIZER
# -------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ["username", "email", "phone", "password"]

    def validate_email(self, value):
        email = value.lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")
        return email

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"].lower(),
            password=validated_data["password"],
            phone=validated_data.get("phone"),
        )


# -------------------------------
# CUSTOM TOKEN SERIALIZER (Reusable)
# -------------------------------
class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            "user": {
                "username": self.user.username,
                "email": self.user.email,
                "is_staff": self.user.is_staff,
            }
        })
        return data