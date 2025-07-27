from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils.timezone import make_aware
from cloudinary.uploader import upload
from cloudinary.exceptions import Error as CloudinaryError
from google_auth_oauthlib.flow import Flow
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from .utils.evento_cldr import criar_evento_google_calendar, deletar_evento_google_calendar
from .models import Usuario, Tarefa
import os
import datetime
import traceback
import json

CAMINHO_CREDENCIAIS = os.path.join(settings.BASE_DIR, 'infinityboard-calendario.json')
CALENDARIO_ID = 'yuumizinham@gmail.com'
GOOGLE_COLOR_MAP = {
    '1': '#a4bdfc',   # Azul
    '2': '#7ae7bf',   # Verde
    '3': '#dbadff',   # Roxo
    '4': '#ff887c',   # Vermelho
    '5': '#fbd75b',   # Laranja
    '6': '#ffb878',   # Amarelo
    '7': '#46d6db',   # Turquesa
    '8': '#e1e1e1',   # Cinza
    '9': '#5484ed',   # Azul Claro
    '10': '#51b749',  # Magenta
    '11': '#dc2127',  # Verde Limão
}

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
                print('catapimbas')
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

@login_required
def listar_tarefas_json(request):
    usuario = request.user
    tarefas = Tarefa.objects.filter(usuario=usuario).order_by('data_inicio')
    dados = []
    for t in tarefas:
        dados.append({
            'id': t.id,
            'titulo': t.titulo,
            'tipo': t.tipo,
            'data_inicio': t.data_inicio.isoformat(),
            'data_fim': t.data_fim.isoformat(),
            'colorId': t.color_id,  # se tiver
            'concluida': t.concluida,
        })
    return JsonResponse(dados, safe=False)

def testar_evento_google(request):
    titulo = "Evento de Teste"
    inicio = datetime.now() + datetime.timedelta(minutes=5)
    fim = inicio + datetime.timedelta(hours=1)

    try:
        evento_id = criar_evento_google_calendar(titulo, inicio, fim)
        return HttpResponse(f"Evento criado com sucesso! ID: {evento_id}")
    except Exception as e:
        return HttpResponse(f"Erro ao criar evento: {e}")
def deletar_evento_teste(request):
    evento_id = 'u50bu5rr5jc5d63aa5pfrrrfjs'  # ID retornado no teste anterior
    try:
        deletar_evento_google_calendar(evento_id)
        return HttpResponse("Evento deletado com sucesso!")
    except Exception as e:
        return HttpResponse(f"Erro ao deletar evento: {e}")
    

    
def eventos_google_calendar(request):
    credenciais = Credentials.from_service_account_file(
        settings.CAMINHO_CREDENCIAIS,
        scopes=['https://www.googleapis.com/auth/calendar.readonly']
    )
    service = build('calendar', 'v3', credentials=credenciais)

    now = datetime.datetime.utcnow().isoformat() + 'Z'
    events_result = service.events().list(
        calendarId=settings.CALENDAR_ID,
        timeMin=now,
        maxResults=100,
        singleEvents=True,
        orderBy='startTime'
    ).execute()

    events = events_result.get('items', [])

    eventos = []
    for event in events:
        color_id = event.get('colorId', '8')  # padrão cinza
        color = GOOGLE_COLOR_MAP.get(color_id, '#e1e1e1')

        eventos.append({
            'id': event['id'],
            'title': event.get('summary', 'Sem título'),
            'start': event['start'].get('dateTime', event['start'].get('date')),
            'end': event['end'].get('dateTime', event['end'].get('date')),
            'color': color,
        })
    tarefas = Tarefa.objects.filter(usuario=request.user).order_by('data_inicio')
    for t in tarefas:
        eventos.append({
            'id': f'bd-{t.id}',  # prefixo pra diferenciar dos eventos do Google
            'title': t.titulo,
            'start': t.data_inicio.isoformat(),
            'end': t.data_fim.isoformat(),
            'color': GOOGLE_COLOR_MAP.get(t.color_id, '#e1e1e1'),
            'extendedProps': {
                'tipo': t.tipo,
                'concluida': t.concluida,
            }
        })
    return JsonResponse(eventos, safe=False)
@csrf_exempt
@login_required
def atualizar_status_tarefa(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tarefa_id = data.get('id')
            concluida = data.get('concluida')

            tarefa = Tarefa.objects.get(id=tarefa_id, usuario=request.user)
            tarefa.concluida = concluida
            tarefa.save()

            return JsonResponse({'success': True})
        except Tarefa.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Tarefa não encontrada'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método inválido'}, status=400)
@csrf_exempt
@login_required
def criar_tarefa(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            titulo = data.get('titulo')
            tipo = data.get('tipo')
            color_id = data.get('colorId', '8')  # Note o 'colorId' (case-sensitive)
            data_inicio = make_aware(datetime.datetime.fromisoformat(data.get('data_inicio')))
            data_fim = make_aware(datetime.datetime.fromisoformat(data.get('data_fim')))
            usuario = request.user

            if usuario.is_superuser:
                event_id = criar_evento_google_calendar(titulo, data_inicio, data_fim, color_id)
            else:
                event_id = None 

            tarefa = Tarefa.objects.create(
                usuario=usuario,
                titulo=titulo,
                tipo=tipo,
                data_inicio=data_inicio,
                data_fim=data_fim,
                google_event_id=event_id,
                color_id=color_id,
                concluida=False
            )

            return JsonResponse({
                'success': True,
                'mensagem': 'Tarefa criada com sucesso!'
            })
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)  # Vai mostrar o erro no console do Django
            return JsonResponse({'success': False, 'erro': str(e), 'traceback': tb})

    return JsonResponse({'success': False, 'erro': 'Método inválido'}, status=400)
@login_required
@csrf_exempt  # Se não usar CSRF token no frontend, mas ideal usar token
def deletar_tarefa(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tarefa_id = data.get('id')

            tarefa = Tarefa.objects.get(id=tarefa_id, usuario=request.user)

            # Deleta evento do Google Calendar
            if tarefa.google_event_id:
                deletar_evento_google_calendar(tarefa.google_event_id)

            # Deleta a tarefa do banco
            tarefa.delete()

            return JsonResponse({'success': True})
        except Tarefa.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Tarefa não encontrada.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método inválido.'}, status=400)
def logout_view(request):
    """Logout do usuário"""
    logout(request)
    messages.info(request, 'Você foi desconectado com sucesso.')
    return redirect('login')