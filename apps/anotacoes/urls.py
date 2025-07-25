from django.urls import path
from . import views

urlpatterns = [
    path('', views.note_list, name='note_list'),
    path('nova/', views.note_create, name='note_create'),
    path('<int:pk>/editar/', views.note_edit, name='note_edit'),
    path('<int:pk>/deletar/', views.note_delete, name='note_delete'),
]
