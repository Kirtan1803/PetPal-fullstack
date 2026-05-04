from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    login_view,
    get_users,
    toggle_admin,
    delete_user,
)

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", login_view, name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Admin Routes
    path("admin/", get_users, name="get_users"),
    path("admin/toggle-admin/<int:pk>/", toggle_admin, name="toggle_admin"),
    path("admin/<int:pk>/", delete_user, name="delete_user"),
]
