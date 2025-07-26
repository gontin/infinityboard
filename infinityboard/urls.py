from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("apps.usuarios.urls")),
    path("notas", include("apps.anotacoes.urls")),
    path("planilhas/", include("apps.planilhas.urls")),
]

