from rest_framework import serializers
from .models import PetRequest, Pet


# -------------------------------
# PET SERIALIZER (Frontend)
# -------------------------------
class PetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = [
            "id",
            "name",
            "age",
            "color",
            "description",
            "image",
            "status",
            "created_at",
            "category",
            "category_name",
            "owner",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


# -------------------------------
# PET REQUEST SERIALIZER
# -------------------------------
class PetRequestSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = PetRequest
        fields = [
            "id",
            "name",
            "age",
            "color",
            "address",
            "justification",
            "owner_name",
            "owner_email",
            "owner_phone",
            "image",
            "status",
            "created_at",
            "category",
            "category_name",
            "user",
            "user_name",
        ]
        read_only_fields = ["status", "user"]

    def validate_age(self, value):
        if value <= 0:
            raise serializers.ValidationError("Age must be greater than zero.")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["image"] = self.get_image(instance)
        return data

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
