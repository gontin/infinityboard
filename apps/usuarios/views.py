from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages

def dashboard(request):
    """Página principal do dashboard"""
    
    
    return render(request, 'inicio.html')

def perfil(request):
    """Página de perfil do usuário"""
    
    
    return render(request, 'perfil.html')

def login_view(request):
    """Página de login (simulação)"""
    
    
    if request.method == 'POST':
        # Simulação de login - aceita qualquer usuário/senha
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if username and password:
            # Simular login bem-sucedido
            messages.success(request, f'Bem-vindo, {username}!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Por favor, preencha todos os campos.')
    
    return render(request, 'login.html')

def logout_view(request):
    """Logout do usuário"""
    logout(request)
    messages.info(request, 'Você foi desconectado com sucesso.')
    return redirect('login')