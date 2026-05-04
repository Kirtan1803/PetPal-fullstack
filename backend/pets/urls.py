from django.urls import path
from .views import (
    PetRequestCreateView,
    get_pet_requests,
    approve_pet_request,
    reject_pet_request,
    get_pets,
    get_pet_detail,
    get_colors,
    admin_pet_requests,
    admin_activity,
)

urlpatterns = [
    # User submits pet request
    path("request/", PetRequestCreateView.as_view(), name="pet-request-create"),

    # Admin: view pending pet requests
    path("admin/", admin_pet_requests, name="admin-pet-requests"),

    # Approve / Reject pet request (ADMIN)
    path("approve/<int:pk>/", approve_pet_request, name="approve-pet"),
    path("reject/<int:pk>/", reject_pet_request, name="reject-pet"),

    # Recent Activity (ADMIN)
    path("admin/activity/", admin_activity),

    # Optional: legacy endpoint (keep if used elsewhere)
    path("requests/", get_pet_requests, name="pet-requests"),

    # Filters
    path("colors/", get_colors, name="pet-colors"),

    # Public pet APIs
    path("", get_pets, name="get-pets"),
    path("<int:pk>/", get_pet_detail, name="get-pet-detail"),
]