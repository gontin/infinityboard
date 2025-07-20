# Sistema de Produtividade Infinity School

## Descrição do Projeto

Este é um sistema web desenvolvido em Django para organização e produtividade dos funcionários da Infinity School. O sistema oferece um dashboard centralizado com ferramentas essenciais para o dia a dia dos colaboradores.

## Funcionalidades Implementadas

### ✅ Funcionalidades Básicas
- **Dashboard Principal**: Tela inicial com menu central e cards organizados
- **Sistema de Login**: Autenticação básica (simulação para desenvolvimento)
- **Perfil do Usuário**: Página completa de perfil com informações pessoais e profissionais
- **Design Responsivo**: Layout adaptável para desktop e mobile
- **Modo Escuro/Claro**: Toggle entre temas com persistência local

### ✅ Recursos do Dashboard
- **Links para Planilhas**: Acesso rápido ao Google Drive e documentos
- **Sistemas Acadêmicos**: Links para Portal do Aluno e Infinity App
- **Calendário Interativo**: Visualização mensal com navegação
- **Lista de Tarefas**: Checklist organizado por categorias (Reunião, Entrega, Evento)
- **Notificações**: Sistema de lembretes e avisos importantes
- **Anotações Rápidas**: Post-it digital com cores personalizáveis

## Estrutura do Projeto

```
projeto/
├── manage.py
├── projeto/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   └── usuarios/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── views.py
│       └── urls.py
├── templates/
│   ├── base.html
│   ├── inicio.html
│   ├── perfil.html
│   └── login.html
└── static/
    └── css/
        └── style.css
```

## Como Executar

1. **Instalar dependências**:
   ```bash
   pip install django
   ```

2. **Executar migrações**:
   ```bash
   python manage.py migrate
   ```

3. **Criar superusuário** (opcional):
   ```bash
   python manage.py createsuperuser
   ```

4. **Executar servidor**:
   ```bash
   python manage.py runserver
   ```

5. **Acessar o sistema**:
   - Dashboard: http://localhost:8000/
   - Login: http://localhost:8000/login/
   - Perfil: http://localhost:8000/perfil/
   - Admin: http://localhost:8000/admin/

## URLs Configuradas

- `/` - Dashboard principal
- `/login/` - Página de login
- `/logout/` - Logout do usuário
- `/perfil/` - Perfil do usuário
- `/admin/` - Painel administrativo do Django

## Próximos Passos para Desenvolvimento

### 🔄 Funcionalidades a Implementar

1. **Autenticação Real**:
   - Integrar com sistema de usuários do Django
   - Implementar controle de acesso por perfil
   - Adicionar recuperação de senha

2. **Banco de Dados**:
   - Criar models para Tarefas, Anotações, Notificações
   - Implementar CRUD completo
   - Adicionar relacionamentos entre usuários e dados

3. **Integração com Google**:
   - Google Calendar API
   - Google Drive API
   - Google Sheets API

4. **Funcionalidades Avançadas**:
   - Sistema de notificações em tempo real
   - Upload de arquivos e fotos
   - Relatórios e estatísticas
   - Chat interno entre funcionários

5. **Melhorias de UX/UI**:
   - Animações e transições
   - Componentes interativos avançados
   - PWA (Progressive Web App)
   - Notificações push

### 🎨 Customização Visual

O arquivo `static/css/style.css` contém:
- Variáveis CSS para cores da marca Infinity School
- Sistema de grid responsivo
- Componentes reutilizáveis
- Suporte a modo escuro/claro

### 🔧 Configurações Técnicas

- **Django 5.2+**
- **Python 3.11+**
- **SQLite** (desenvolvimento) - pode ser migrado para PostgreSQL
- **Timezone**: America/Sao_Paulo
- **Idioma**: Português Brasil

## Observações Importantes

- O sistema atual usa autenticação simulada para desenvolvimento
- Todas as funcionalidades JavaScript são client-side (localStorage)
- Os dados não são persistidos no banco ainda
- O design segue as cores e identidade da Infinity School

## Suporte

Para dúvidas ou problemas, consulte a documentação do Django ou entre em contato com a equipe de desenvolvimento.

