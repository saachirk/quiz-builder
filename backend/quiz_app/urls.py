from django.urls import path
from .views import register_user, login_user, generate_quiz_view, start_quiz, get_time_left, report_switch, submit_quiz

urlpatterns = [
    path("api/register/", register_user),
    path("api/login/", login_user),
    path("api/generate-quiz/", generate_quiz_view),
    path("api/start-quiz/", start_quiz),
    path("api/get-time-left/", get_time_left),
    path("api/report-switch/", report_switch),
    path("api/submit-quiz/", submit_quiz),
]
