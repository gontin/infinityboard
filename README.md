
# Sistema de Produtividade – Infinity School

## 📌 Descrição do Projeto

Este é um sistema web desenvolvido com Django, voltado para organização e produtividade dos funcionários da **Infinity School**. A plataforma oferece um dashboard centralizado com ferramentas essenciais para o dia a dia dos colaboradores, como calendário, tarefas, links úteis, anotações e mais.

## 🛠 Tecnologias Utilizadas

- **Python 3.11+**
- **Django 5.2+**
- **JavaScript**
- **Google Auth** (para integração com Google Calendar)

## ✅ Funcionalidades

### Funcionalidades Básicas

- **Dashboard Principal** com menu central e cards organizados
- **Autenticação de Usuários** com sistema de login
- **Página de Perfil** com dados pessoais e profissionais
- **Design Responsivo** para desktop e dispositivos móveis
- **Modo Claro/Escuro** com persistência local

### Recursos do Dashboard

- **Links Rápidos**: Acesso ao Google Drive, Portal do Aluno e Infinity App
- **Calendário Interativo**: Visualização mensal/semanal/diária com navegação dinâmica
- **Lista de Tarefas**: Checklist de atividades
- **Anotações Rápidas**: Post-its digitais no painel

## 🗂 Estrutura do Projeto

```
infinityboard/
├── apps/
│   ├── anotacoes/
│   ├── planilhas/
│   └── usuarios/
├── static/
│   ├── css/
│   └── js/
├── templates/
├── infinityboard/
├── manage.py
├── requirements.txt
└── README.md
```

## ⚙️ Como Executar o Projeto Localmente

1. **Criar ambiente virtual**:
   ```bash
   python -m venv venv
   ```

2. **Ativar o ambiente virtual**:
   ```bash
   venv/Scripts/activate  # Windows
   source venv/bin/activate  # Linux/macOS
   ```

3. **Instalar as dependências**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Criar as migrações**:
   ```bash
   python manage.py makemigrations anotacoes planilhas usuarios
   ```

5. **Aplicar as migrações**:
   ```bash
   python manage.py migrate
   ```

6. **Criar superusuário (opcional)**:
   ```bash
   python manage.py createsuperuser
   ```

7. **Iniciar o servidor**:
   ```bash
   python manage.py runserver
   ```

8. **Acessar o sistema**:
   - Dashboard: http://localhost:8000/
   - Login: http://localhost:8000/login/
   - Registro: http://localhost:8000/registro/
   - Perfil: http://localhost:8000/perfil/
   - Anotações: http://localhost:8000/notas/
   - Planilhas: http://localhost:8000/planilhas/
   - Admin: http://localhost:8000/admin/

## 🌐 Rotas Configuradas

- `/` — Dashboard principal  
- `/login/` — Página de login  
- `/logout/` — Logout  
- `/registro/` — Registro de novo usuário  
- `/perfil/` — Página do perfil  
- `/admin/` — Painel administrativo  
- `/notas/` — Painel de anotações  
- `/planilhas/` — Painel de planilhas  

## 🎨 Estilo e UI/UX

- O arquivo `static/css/style.css` define as cores principais da marca e o layout geral
- `base.css` contém componentes reutilizáveis e suporte a tema escuro/claro
- `global.css` centraliza variáveis globais de estilo

## 🧩 Configurações Técnicas

- **Banco de Dados**: SQLite (padrão para desenvolvimento)
- **Idioma**: pt-br
- **Timezone**: America/Sao_Paulo

## 📎 Observações

- O sistema utiliza autenticação local padrão do Django.
- O visual segue a identidade visual da Infinity School.
- A integração com serviços do Google (ex: Google Calendar) utiliza a biblioteca `google-auth`.


## 🔐 Configuração do Cloudinary (.env)

Para utilizar o serviço de hospedagem de imagens com **Cloudinary**, é necessário criar um arquivo `.env` na raiz do projeto com os seguintes dados:

```
CLOUD_NAME=seu_cloud_name
API_KEY=sua_api_key
API_SECRET=sua_api_secret
```

Essas variáveis serão usadas para autenticar sua conta Cloudinary e permitir o upload de imagens.  
Certifique-se de **não compartilhar** o conteúdo do `.env` publicamente ou versionar esse arquivo no Git.

> ✅ Dica: Adicione `.env` ao seu `.gitignore` para evitar que ele seja enviado ao GitHub.
