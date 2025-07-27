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
- **Anotações Rápidas**: Post-it digital

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
│   └── anotacoes/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── forms.py
│       ├── models.py
│       ├── views.py
│       └── urls.py
│   └── planilhas/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── views.py
│       └── urls.py
│   └── usuarios/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── views.py
│       └── urls.py
├── templates/
│   └── anotacoes/
│       └── base_notas.html
│       └── note_create.html
│       └── note_list.html
│   ├── base.html
│   ├── calendario.html
│   ├── inicio.html
│   ├── login.html
│   ├── perfil.html
│   └── registro.html
└── static/
    └── css/
        └── style.css
        └── base.css
        └── forms.css
        └── global.css
        └── modal.css
        └── note_list.css
        └── planilhas.css
        └── reset.css
```

## Como Executar

1. **Instalar dependências**:
   ```bash
   pip install -r requirements.txt
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
   - Notas: http://localhost:8000/notas/
   - Notas: http://localhost:8000/planilhas/
   - Admin: http://localhost:8000/admin/

## URLs Configuradas

- `/` - Dashboard principal
- `/login/` - Página de login
- `/logout/` - Logout do usuário
- `/registro/` - Tela registro
- `/perfil/` - Perfil do usuário
- `/admin/` - Painel administrativo do Django
- `/notas/` - Painel anotações
- `/planilhas/` - Painel planilhas

## Próximos Passos para Desenvolvimento

### 🔄 Funcionalidades a Implementar

1. **Autenticação Real**:
   - Integrar com sistema de usuários do Django
   - Implementar controle de acesso por perfil
   - Adicionar recuperação de senha
   - Funcionários com permissões para registrar

2. **Integração com Google**:
   - Google Drive API
   - Google Sheets API

3. **Funcionalidades Avançadas**:
   - Sistema de notificações em tempo real
   - Upload de arquivos e fotos
   - Relatórios e estatísticas
   - Chat interno entre funcionários

4. **Melhorias de UX/UI**:
   - Componentes interativos avançados
   - Notificações push

### 🎨 Customização Visual

O arquivo `static/css/global.css` contém:
- Variáveis CSS para cores da marca Infinity School
- Suporte a modo escuro/claro
  
O arquivo `static/css/global.css` contém:
- Componentes reutilizáveis
- Variáveis de estilização

### 🔧 Configurações Técnicas

- **Django 5.2+**
- **Python 3.11+**
- **SQLite** (desenvolvimento) - pode ser migrado
- **Timezone**: America/Sao_Paulo
- **Idioma**: Português Brasil

## Observações Importantes

- O sistema atual usa autenticação local
- O design segue as cores e identidade da Infinity School

## Suporte

Para dúvidas ou problemas, consulte a documentação do Django ou entre em contato com a equipe de desenvolvimento.

