from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    pet_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "pet_count"]

    def get_pet_count(self, obj):
        return obj.pet_set.count()

    def validate_name(self, value):
        name = value.strip()
        if not name:
            raise serializers.ValidationError("Category name cannot be empty.")

        queryset = Category.objects.filter(name__iexact=name)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("Category already exists.")

        return name
