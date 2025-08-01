# Generated by Django 5.2.4 on 2025-07-21 06:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='email',
        ),
        migrations.AddField(
            model_name='usuario',
            name='bio',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='usuario',
            name='foto',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='usuario',
            name='funcao',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='cpf',
            field=models.CharField(blank=True, max_length=14, null=True),
        ),
        migrations.DeleteModel(
            name='Funcionario',
        ),
    ]
