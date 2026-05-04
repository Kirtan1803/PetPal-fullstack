import random
import requests
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from pets.models import Pet
from categories.models import Category
from django.core.files.base import ContentFile

User = get_user_model()


class Command(BaseCommand):
    help = "Seed database with pets and categories"

    def handle(self, *args, **kwargs):

        # Create categories
        category_names = ["Dog", "Cat", "Bird", "Rabbit"]
        categories = []

        for name in category_names:
            cat, _ = Category.objects.get_or_create(name=name)
            categories.append(cat)

        self.stdout.write(self.style.SUCCESS("Categories created"))

        # Get or create user
        user, created = User.objects.get_or_create(
            username="testuser", defaults={"email": "test@example.com"}
        )
        user.set_password("test123")
        user.save()

        # Sample pet data
        pet_names = [
            "Max",
            "Bella",
            "Charlie",
            "Lucy",
            "Rocky",
            "Milo",
            "Luna",
            "Simba",
            "Coco",
            "Buddy",
            "Daisy",
            "Oscar",
            "Ruby",
            "Leo",
            "Zoe",
        ]

        colors = ["Brown", "Black", "White", "Golden", "Gray"]

        # Add pets
        for i in range(15):
            name = random.choice(pet_names)
            category = random.choice(categories)
            color = random.choice(colors)
            age = random.randint(1, 10)

            # Fetch random image
            image_url = f"https://picsum.photos/300/200?random={i}"
            response = requests.get(image_url)

            pet = Pet(
                name=name,
                age=age,
                color=color,
                category=category,
                description=f"{name} is a lovely pet.",
                owner=user,
                status="available",
            )

            if response.status_code == 200:
                pet.image.save(f"{name}.jpg", ContentFile(response.content), save=True)

            pet.save()

        self.stdout.write(self.style.SUCCESS("15 pets added successfully"))
