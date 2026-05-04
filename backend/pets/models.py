from django.db import models
from django.conf import settings
from categories.models import Category

User = settings.AUTH_USER_MODEL


class PetRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    color = models.CharField(max_length=50)

    address = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    justification = models.TextField()

    owner_name = models.CharField(max_length=100)
    owner_email = models.EmailField()
    owner_phone = models.CharField(max_length=15)

    image = models.ImageField(upload_to="pet_requests/", blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Pet(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    color = models.CharField(max_length=50)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField(blank=True)

    image = models.ImageField(upload_to="pets/", blank=True, null=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    status = models.CharField(
        max_length=20,
        choices=[
            ("available", "Available"),
            ("adopted", "Adopted"),
            ("pending", "Pending"),
        ],
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name