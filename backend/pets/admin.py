from django.contrib import admin
from .models import PetRequest, Pet

admin.site.register(PetRequest)
admin.site.register(Pet)