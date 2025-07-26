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
    google_event_id = models.CharField(max_length=255, null=True, blank=True)
    color_id = models.CharField(max_length=2, default='8')  # Novo campo

    def __str__(self):
        return f"{self.titulo} ({self.tipo})"
class Turma(models.Model):
    TURNO_CHOICES = [
        ('M', 'Manhã'),
        ('T', 'Tarde'),
        ('N', 'Noite'),
    ]

    TIPO_AULA_CHOICES = [
        ('curso', 'Curso'),
        ('compartilhada', 'Compartilhada'),
        ('sm', 'Super Módulo')
    ]

    numero = models.CharField(max_length=10)
    turno = models.CharField(max_length=1, choices=TURNO_CHOICES)
    aula = models.CharField(max_length=100)
    modulo = models.CharField(max_length=50)
    curso = models.CharField(max_length=100)
    horario_inicio = models.TimeField()
    horario_fim = models.TimeField()
    tipo_aula = models.CharField(max_length=20, choices=TIPO_AULA_CHOICES)
    dia_semana = models.CharField(
        max_length=10, 
        blank=True, 
        null=True, 
        help_text='Preencher se for aula recorrente'
    )
    data_unica = models.DateField(
        blank=True, 
        null=True, 
        help_text='Preencher se for aula única'
    )

    def __str__(self):
        return f"{self.numero} - {self.aula} ({self.get_turno_display()})"