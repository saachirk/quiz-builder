from django.urls import path
from .views import register_user, login_user, generate_quiz_view

urlpatterns = [
    path("api/register/", register_user),
    path("api/login/", login_user),
    path("api/generate-quiz/", generate_quiz_view),
]