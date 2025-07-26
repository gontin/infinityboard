// Planilhas JavaScript
class PlanilhasManager {
    constructor() {
        this.turmas = [];
        this.alunos = [];
        this.currentTurmaId = null;
        this.currentAlunoId = null;
        this.confirmCallback = null;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
                this.fetchAndRenderTurmas();
            });
        } else {
            this.bindEvents();
            this.fetchAndRenderTurmas();
        }
    }
    
    bindEvents() {
        const novaTurmaBtn = document.getElementById('nova-turma-btn');
        
        if (novaTurmaBtn) {
            novaTurmaBtn.addEventListener('click', () => {
                this.openModal('modal-nova-turma');
            });
        }
        
        const formNovaTurma = document.getElementById('form-nova-turma');
        const formEditarTurma = document.getElementById('form-editar-turma');
        const formAluno = document.getElementById('form-aluno');
        
        if (formNovaTurma) {
            formNovaTurma.addEventListener('submit', (e) => {
                e.preventDefault();
                this.criarTurma();
            });
        }
        
        if (formEditarTurma) {
            formEditarTurma.addEventListener('submit', (e) => {
                e.preventDefault();
                this.editarTurma();
            });
        }
        
        if (formAluno) {
            formAluno.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarAluno();
            });
        }
        
        document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal') || 
                               e.target.closest('[data-modal]')?.getAttribute('data-modal');
                if (modalId) {
                    this.closeModal(modalId);
                }
            });
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        const adicionarAlunoBtn = document.getElementById('adicionar-aluno-btn');
        const exportarPlanilhaBtn = document.getElementById('exportar-planilha-btn');
        const importarPlanilhaBtn = document.getElementById('importar-planilha-btn');
        
        if (adicionarAlunoBtn) {
            adicionarAlunoBtn.addEventListener('click', () => {
                this.abrirModalAluno();
            });
        }
        
        if (exportarPlanilhaBtn) {
            exportarPlanilhaBtn.addEventListener('click', () => {
                this.exportarPlanilha();
            });
        }
        
        if (importarPlanilhaBtn) {
            importarPlanilhaBtn.addEventListener('click', () => {
                this.importarPlanilha();
            });
        }
        
        const confirmarAcaoBtn = document.getElementById('confirmar-acao-btn');
        if (confirmarAcaoBtn) {
            confirmarAcaoBtn.addEventListener('click', () => {
                if (this.confirmCallback) {
                    this.confirmCallback();
                    this.closeModal('modal-confirmacao');
                }
            });
        }
    }
    
    // Helper para requisições AJAX
    async request(url, method = 'GET', data = null, isFormData = false) {
        const options = {
            method,
            headers: {
                'X-CSRFToken': this.getCookie('csrftoken'),
            },
        };

        if (data) {
            if (isFormData) {
                options.body = data;
            } else {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(data);
            }
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro na requisição');
            }
            return response.json();
        } catch (error) {
            this.showNotification(`Erro: ${error.message}`, 'error');
            throw error;
        }
    }

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Gerenciamento de modais
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => form.reset());
        }
    }
    
    // Gerenciamento de turmas
    async fetchAndRenderTurmas() {
        try {
            const data = await this.request('/planilhas/api/turmas/');
            this.turmas = data.turmas;
            this.renderTurmas();
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
            this.showNotification('Erro ao carregar turmas.', 'error');
        }
    }

    async criarTurma() {
        const formData = new FormData(document.getElementById('form-nova-turma'));
        const turmaData = {
            numero: formData.get('numero'),
            curso_modulo: formData.get('curso_modulo'),
            periodo: formData.get('periodo'),
            dias_semana: formData.get('dias_semana'),
        };
        
        try {
            const response = await this.request('/planilhas/api/turmas/', 'POST', turmaData);
            if (response.success) {
                this.showNotification('Turma criada com sucesso!', 'success');
                this.closeModal('modal-nova-turma');
                this.fetchAndRenderTurmas();
            }
        } catch (error) {
            console.error('Erro ao criar turma:', error);
        }
    }
    
    async editarTurma() {
        const formData = new FormData(document.getElementById('form-editar-turma'));
        const turmaId = parseInt(formData.get('id'));
        const turmaData = {
            numero: formData.get('numero'),
            curso_modulo: formData.get('curso_modulo'),
            periodo: formData.get('periodo'),
            dias_semana: formData.get('dias_semana'),
        };
        
        try {
            const response = await this.request(`/planilhas/api/turmas/${turmaId}/`, 'PUT', turmaData);
            if (response.success) {
                this.showNotification('Turma atualizada com sucesso!', 'success');
                this.closeModal('modal-editar-turma');
                this.fetchAndRenderTurmas();
            }
        } catch (error) {
            console.error('Erro ao editar turma:', error);
        }
    }
    
    excluirTurma(turmaId) {
        this.showConfirmation(
            'Tem certeza que deseja excluir esta turma? Todos os alunos associados também serão removidos.',
            async () => {
                try {
                    const response = await this.request(`/planilhas/api/turmas/${turmaId}/`, 'DELETE');
                    if (response.success) {
                        this.showNotification('Turma excluída com sucesso!', 'success');
                        this.fetchAndRenderTurmas();
                    }
                } catch (error) {
                    console.error('Erro ao excluir turma:', error);
                }
            }
        );
    }
    
    abrirEdicaoTurma(turmaId) {
        const turma = this.turmas.find(t => t.id === turmaId);
        if (turma) {
            document.getElementById('edit-turma-id').value = turma.id;
            document.getElementById('edit-numero-turma').value = turma.numero;
            document.getElementById('edit-curso-modulo-turma').value = turma.cursoModulo;
            document.getElementById('edit-periodo-turma').value = turma.periodo;
            document.getElementById('edit-dias-semana-turma').value = turma.diasSemana;
            this.openModal('modal-editar-turma');
        }
    }
    
    // Gerenciamento de alunos
    async gerenciarAlunos(turmaId) {
        this.currentTurmaId = turmaId;
        const turma = this.turmas.find(t => t.id === turmaId);
        if (turma) {
            document.getElementById('turma-nome-header').textContent = `${turma.numero} - ${turma.cursoModulo}`;
            await this.fetchAndRenderAlunos(turmaId);
            this.openModal('modal-gerenciar-alunos');
        }
    }

    async fetchAndRenderAlunos(turmaId) {
        try {
            const data = await this.request(`/planilhas/api/alunos/?turma_id=${turmaId}`);
            this.alunos = data.alunos;
            this.renderAlunos();
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            this.showNotification('Erro ao carregar alunos.', 'error');
        }
    }
    
    abrirModalAluno(alunoId = null) {
        this.currentAlunoId = alunoId;
        const modal = document.getElementById('modal-aluno');
        const title = document.getElementById('modal-aluno-title');
        const saveBtn = document.getElementById('salvar-aluno-btn');
        
        if (alunoId) {
            const aluno = this.alunos.find(a => a.id === alunoId);
            if (aluno) {
                title.textContent = 'Editar Aluno';
                saveBtn.textContent = 'Salvar Alterações';
                document.getElementById('aluno-id').value = aluno.id;
                document.getElementById('aluno-turma-id').value = aluno.turmaId;
                document.getElementById('aluno-nome').value = aluno.nome;
                document.getElementById('aluno-email').value = aluno.email;
                document.getElementById('aluno-telefone').value = aluno.telefone || '';
                document.getElementById('aluno-nascimento').value = aluno.dataNascimento ? aluno.dataNascimento.split('T')[0] : '';
                document.getElementById('aluno-endereco').value = aluno.endereco || '';
            }
        } else {
            title.textContent = 'Adicionar Aluno';
            saveBtn.textContent = 'Adicionar';
            document.getElementById('aluno-id').value = '';
            document.getElementById('aluno-turma-id').value = this.currentTurmaId;
        }
        
        this.openModal('modal-aluno');
    }
    
    async salvarAluno() {
        const formData = new FormData(document.getElementById('form-aluno'));
        const alunoId = formData.get('id');
        
        const alunoData = {
            turma_id: parseInt(formData.get('turma_id')),
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            data_nascimento: formData.get('data_nascimento'),
            endereco: formData.get('endereco'),
        };
        
        try {
            let response;
            if (alunoId) {
                response = await this.request(`/planilhas/api/alunos/${alunoId}/`, 'PUT', alunoData);
            } else {
                response = await this.request('/planilhas/api/alunos/', 'POST', alunoData);
            }
            
            if (response.success) {
                this.showNotification(
                    alunoId ? 'Aluno atualizado com sucesso!' : 'Aluno adicionado com sucesso!',
                    'success'
                );
                this.closeModal('modal-aluno');
                this.fetchAndRenderAlunos(this.currentTurmaId);
                this.fetchAndRenderTurmas();
            }
        } catch (error) {
            console.error('Erro ao salvar aluno:', error);
        }
    }
    
    excluirAluno(alunoId) {
        this.showConfirmation(
            'Tem certeza que deseja excluir este aluno?',
            async () => {
                try {
                    const response = await this.request(`/planilhas/api/alunos/${alunoId}/`, 'DELETE');
                    if (response.success) {
                        this.showNotification('Aluno excluído com sucesso!', 'success');
                        this.fetchAndRenderAlunos(this.currentTurmaId);
                        this.fetchAndRenderTurmas();
                    }
                } catch (error) {
                    console.error('Erro ao excluir aluno:', error);
                }
            }
        );
    }
    
    // Renderização
    renderTurmas() {
        const container = document.getElementById('turmas-grid');
        if (!container) return;
        
        if (this.turmas.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📚</div>
                    <h3>Nenhuma turma encontrada</h3>
                    <p>Crie sua primeira turma para começar a gerenciar alunos</p>
                    <button class="btn btn-primary" onclick="planilhasManager.openModal('modal-nova-turma')">
                        <i class="icon-plus"></i>
                        Criar Primeira Turma
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.turmas.map(turma => {
            const totalAlunos = turma.totalAlunos !== undefined ? turma.totalAlunos : '...';
            
            return `
                <div class="turma-card card">
                    <div class="turma-header">
                        <h3 class="turma-nome">${turma.numero}</h3>
                        <span class="turma-periodo">${turma.periodo}</span>
                    </div>
                    
                    <p class="turma-curso">${turma.cursoModulo}</p>
                    
                    <div class="turma-stats">
                        <div class="stat-item">
                            <span class="stat-number">${totalAlunos}</span>
                            <span class="stat-label">Alunos</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${turma.diasSemana}</span>
                            <span class="stat-label">Dias da Semana</span>
                        </div>
                    </div>
                    
                    <div class="turma-actions">
                        <button class="btn btn-primary btn-small" onclick="planilhasManager.gerenciarAlunos(${turma.id})">
                            <i class="icon-users"></i>
                            Gerenciar
                        </button>
                        <button class="btn btn-warning btn-small" onclick="planilhasManager.abrirEdicaoTurma(${turma.id})">
                            <i class="icon-edit"></i>
                            Editar
                        </button>
                        <button class="btn btn-danger btn-small" onclick="planilhasManager.excluirTurma(${turma.id})">
                            <i class="icon-delete"></i>
                            Excluir
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderAlunos() {
        const tbody = document.getElementById('alunos-tbody');
        if (!tbody) return;
        
        if (this.alunos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <h4>Nenhum aluno cadastrado</h4>
                            <p>Adicione o primeiro aluno desta turma</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.alunos.map(aluno => `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.telefone || '-'}</td>
                <td>${aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR') : '-'}</td>
                <td>
                    <div class="aluno-actions">
                        <button class="btn-icon edit" onclick="planilhasManager.abrirModalAluno(${aluno.id})" title="Editar">
                            <i class="icon-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="planilhasManager.excluirAluno(${aluno.id})" title="Excluir">
                            <i class="icon-delete"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    // Exportação de planilha
    exportarPlanilha() {
        if (!this.currentTurmaId) {
            this.showNotification('Selecione uma turma para exportar.', 'warning');
            return;
        }
        window.location.href = `/planilhas/api/turmas/${this.currentTurmaId}/exportar/`;
        this.showNotification('Download da planilha iniciado!', 'success');
    }
    
    // Importação de planilha
    importarPlanilha() {
        if (!this.currentTurmaId) {
            this.showNotification('Selecione uma turma para importar alunos.', 'warning');
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('arquivo', file);
                try {
                    const response = await this.request(`/planilhas/api/turmas/${this.currentTurmaId}/importar/`, 'POST', formData, true);
                    if (response.success) {
                        let message = `Importação concluída: ${response.alunos_criados} alunos adicionados.`;
                        if (response.erros && response.erros.length > 0) {
                            message += ` Erros: ${response.erros.join('; ')}`;
                            this.showNotification(message, 'warning');
                        } else {
                            this.showNotification(message, 'success');
                        }
                        this.fetchAndRenderAlunos(this.currentTurmaId);
                        this.fetchAndRenderTurmas();
                    }
                } catch (error) {
                    console.error('Erro na importação:', error);
                    this.showNotification('Erro ao importar planilha.', 'error');
                }
            }
        };
        input.click();
    }
    
    // Utilitários
    showConfirmation(message, callback) {
        document.getElementById('confirmacao-texto').textContent = message;
        this.confirmCallback = callback;
        this.openModal('modal-confirmacao');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            maxWidth: '400px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

let planilhasManager;

function initPlanilhasManager() {
    if (!planilhasManager) {
        planilhasManager = new PlanilhasManager();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlanilhasManager);
} else {
    initPlanilhasManager();
}

