from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from cloudinary.uploader import upload
from cloudinary.exceptions import Error as CloudinaryError
from .models import Usuario, Tarefa
import os
import datetime
import json
from django.http import JsonResponse
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from .utils.evento_cldr import criar_evento_google_calendar, deletar_evento_google_calendar, criar_evento_google
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

@login_required
def dashboard(request):
    """Página principal do dashboard"""
    
    
    return render(request, 'inicio.html')

@login_required
def perfil(request):
    user = request.user
    perfil = user.perfil

    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        telefone = request.POST.get('telefone')
        funcao = request.POST.get('funcao')
        bio = request.POST.get('bio')

        # Atualiza os campos
        user.email = email
        user.save()

        perfil.nome = nome
        perfil.telefone = telefone
        perfil.funcao = funcao
        perfil.bio = bio

        # Verifica se o usuário enviou uma nova foto
        foto = request.FILES.get('foto')
        if foto:
            try:
                result = upload(foto)
                perfil.foto = result.get('secure_url')
            except CloudinaryError:
                # Você pode adicionar uma mensagem de erro aqui se quiser
                pass
        
        perfil.save()

        return redirect('perfil')

    return render(request, 'perfil.html', {'user': user})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            auth_login(request, user)
            messages.success(request, f'Bem-vindo, {username}')
            return redirect('inicio')
        else:
            messages.error(request, 'Credenciais inválidas.')
            return redirect('login')
        
    return render(request, 'login.html')

def registro_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        senha = request.POST.get("senha")
        nome = request.POST.get("nome")
        funcao = request.POST.get("funcao")
        cpf = request.POST.get("cpf")
        imagem = request.FILES.get("foto")

        if User.objects.filter(username=username).exists():
            return render(request, "registro.html", {"erro": "Esse nome de usuário já existe."})

        # Cria usuário
        user = User.objects.create_user(username=username, email=email, password=senha)

        # Envia imagem para o Cloudinary
        foto_url = None
        if imagem:
            try:
                result = upload(imagem)
                foto_url = result.get("secure_url")
            except CloudinaryError as e:
                return render(request, "registro.html", {"erro": "Erro ao fazer upload da imagem."})

        Usuario.objects.create(
            usuario=user,
            nome=nome,
            funcao=funcao,
            cpf=cpf,
            foto=foto_url
        )

        login(request, user)
        return redirect('inicio')

    return render(request, "registro.html")

def calendario(request):
    return render(request, 'calendario.html')

def eventos_google_calendar(request):
    creds = Credentials.from_authorized_user_file(
        os.path.join('apps', 'usuarios', 'utils', 'token.json'), SCOPES)

    service = build('calendar', 'v3', credentials=creds)

    now = datetime.datetime.utcnow().isoformat() + 'Z'

    events_result = service.events().list(
        calendarId='primary',
        timeMin=now,
        maxResults=50,
        singleEvents=True,
        orderBy='startTime'
    ).execute()

    events = events_result.get('items', [])

    dados = []
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        dados.append({
            'title': event.get('summary', '(Sem título)'),
            'start': start,
        })

    return JsonResponse(dados, safe=False)

@csrf_exempt
@login_required
def criar_tarefa(request):
    if request.method == 'POST':
        dados = json.loads(request.body)
        titulo = dados.get('titulo')
        tipo = dados.get('tipo')
        inicio = dados.get('inicio')
        fim = dados.get('fim')

        try:
            evento_google = criar_evento_google(titulo, tipo, inicio, fim, request.user)
        except Exception as e:
            print("Erro ao criar evento no Google:", e)
            return JsonResponse({'success': False})

        Tarefa.objects.create(
            usuario=request.user,
            titulo=titulo,
            tipo=tipo,
            data_inicio=inicio,
            data_fim=fim,
            google_event_id=evento_google['id']
        )

        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False})
@csrf_exempt
def excluir_tarefa(request, id):
    if request.method == 'DELETE':
        try:
            tarefa = Tarefa.objects.get(id=id, usuario=request.user)
            deletar_evento_google_calendar(tarefa.google_event_id)
            tarefa.delete()
            return JsonResponse({'status': 'excluido'})
        except Tarefa.DoesNotExist:
            return JsonResponse({'erro': 'Tarefa não encontrada'}, status=404)
def logout_view(request):
    """Logout do usuário"""
    logout(request)
    messages.info(request, 'Você foi desconectado com sucesso.')
    return redirect('login')