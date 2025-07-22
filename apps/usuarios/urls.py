from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.dashboard, name='inicio'),
    path('perfil/', views.perfil, name='perfil'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('registro/', views.registro_view, name='registro'),
    path('calendario/', views.calendario, name='calendario'),
    path('eventos-google-calendar/', views.eventos_google_calendar, name='eventos_google_calendar'),
    path('criar-tarefa/', views.criar_tarefa, name='criar_tarefa')
]