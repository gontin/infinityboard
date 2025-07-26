from django.db import models

class Turma(models.Model):
    numero = models.CharField(max_length=50)  # Número da turma (ex: "T001", "Turma 1", etc.)
    curso_modulo = models.CharField(max_length=255)  # Curso/Módulo (ex: "Python Básico", "React Avançado")
    periodo = models.CharField(max_length=50, choices=[
        ('matutino', 'Matutino'),
        ('vespertino', 'Vespertino'),
        ('noturno', 'Noturno'),
    ])
    dias_semana = models.CharField(max_length=255)  # Dias da semana (ex: "Segunda, Quarta, Sexta")

    def __str__(self):
        return f"{self.numero} - {self.curso_modulo}"

class Aluno(models.Model):
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='alunos')
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    data_nascimento = models.DateField(blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

