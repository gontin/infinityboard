from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from cloudinary.uploader import upload
from cloudinary.exceptions import Error as CloudinaryError
from .models import Usuario

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

def logout_view(request):
    """Logout do usuário"""
    logout(request)
    messages.info(request, 'Você foi desconectado com sucesso.')
    return redirect('login')