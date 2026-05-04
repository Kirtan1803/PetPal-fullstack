from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),

    # Users (auth + admin handled inside)
    path("api/users/", include("users.urls")),

    path("api/categories/", include("categories.urls")),
    path("api/pets/", include("pets.urls")),
    path("api/adoption/", include("adoption.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/dashboard/", include("dashboard.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)