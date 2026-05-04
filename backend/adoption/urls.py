from django.urls import path
from .views import (
    AdoptionRequestCreateView,
    approve_adoption,
    reject_adoption,
    my_adoptions,
    all_adoptions,
)

urlpatterns = [
    path("request/", AdoptionRequestCreateView.as_view(), name="adoption-request"),

    path("approve/<int:pk>/", approve_adoption, name="approve-adoption"),
    path("reject/<int:pk>/", reject_adoption, name="reject-adoption"),

    path("my/", my_adoptions, name="my-adoptions"),
    path("requests/", all_adoptions, name="all-adoptions"),
]