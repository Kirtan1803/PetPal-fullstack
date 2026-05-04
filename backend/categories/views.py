from rest_framework import generics, permissions
from .models import Category
from .serializers import CategorySerializer


# -------------------------------
# ADMIN: Create Category
# -------------------------------
class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]


# -------------------------------
# PUBLIC: List Categories
# -------------------------------
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


# -------------------------------
# ADMIN: Edit Categories
# -------------------------------
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]