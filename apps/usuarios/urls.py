from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name="inicio"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("registro", views.registro_view, name="registro"),
    path("perfil", views.perfil, name="perfil"),
    path('eventos-google/', views.eventos_google_calendar, name='eventos_google_calendar'),
    path('tarefas-json/', views.listar_tarefas_json, name='tarefas_json'),
    path('deletar_tarefa/', views.deletar_tarefa, name='deletar_tarefa'),
    path("criar_tarefa", views.criar_tarefa, name="criar_tarefa"),
    path('testar-evento/', views.testar_evento_google),
    path('deletar-evento/', views.deletar_evento_teste),
]

