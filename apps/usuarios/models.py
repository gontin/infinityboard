from django.db import models
from django.contrib.auth.models import User

class Usuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil")
    nome = models.CharField(max_length=255, blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    funcao = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    foto = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.nome or self.usuario.username
    
class Tarefa(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=100)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    concluida = models.BooleanField(default=False)
    google_event_id = models.CharField(max_length=255, blank=True)
    color_id = models.CharField(max_length=2, default='8')  # Novo campo

    def __str__(self):
        return f"{self.titulo} ({self.tipo})"