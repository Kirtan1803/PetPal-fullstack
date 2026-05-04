from rest_framework import serializers
from .models import AdoptionRequest


class AdoptionRequestSerializer(serializers.ModelSerializer):
    message = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = AdoptionRequest
        fields = ["id", "pet", "message", "status", "created_at"]
        read_only_fields = ["status", "created_at"]