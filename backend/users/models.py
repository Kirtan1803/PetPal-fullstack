from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)  # enforce uniqueness
    phone = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["username"]),
        ]

    def __str__(self):
        return self.username