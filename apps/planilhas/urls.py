from django.urls import path
from . import views

urlpatterns = [
    path("", views.planilhas_view, name="planilhas"),
    
    # APIs para turmas
    path("api/turmas/", views.turmas_api, name="turmas_api"),
    path("api/turmas/<int:turma_id>/", views.turma_detail_api, name="turma_detail_api"),
    
    # APIs para alunos
    path("api/alunos/", views.alunos_api, name="alunos_api"),
    path("api/alunos/<int:aluno_id>/", views.aluno_detail_api, name="aluno_detail_api"),
    
    # Importação e exportação
    path("api/turmas/<int:turma_id>/exportar/", views.exportar_planilha, name="exportar_planilha"),
    path("api/turmas/<int:turma_id>/importar/", views.importar_planilha, name="importar_planilha"),
]

