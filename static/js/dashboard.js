document.addEventListener('DOMContentLoaded', function () {
    // Mapeamento das cores do Google Calendar
    const GOOGLE_COLOR_MAP = {
        '1': '#a4bdfc',   // Azul
        '2': '#7ae7bf',   // Verde
        '3': '#dbadff',   // Roxo
        '4': '#ff887c',   // Vermelho
        '5': '#fbd75b',   // Laranja
        '6': '#ffb878',   // Amarelo
        '7': '#46d6db',   // Turquesa
        '8': '#e1e1e1',   // Cinza
        '9': '#5484ed',   // Azul Claro
        '10': '#FF00FF', // Magenta
        '11': '#89ff65ff', // Verde Limão
    };

    var calendarEl = document.getElementById('calendar');

    // Inicializar o calendário
    window.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        allDaySlot: false,
        selectable: true,
        headerToolbar: {
            center: '',
            right: 'prev,next today',
            left: 'title'
        },
        footerToolbar: {
            left: '',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today:    'Hoje',
            month:    'Mês',
            week:     'Semana',
            day:      'Dia',
            list:     'Lista'
        },

        events: window.eventosUrl || "/eventos_google_calendar/", // URL configurável

        dateClick: function(info) {
            mostrarFormulario();
            // Preenche os inputs do formulário com a data clicada
            const dataFormatada = info.dateStr + "T09:00"; // Exemplo hora 09:00
            document.getElementById('data-inicio').value = dataFormatada;
            document.getElementById('data-fim').value = dataFormatada;
        },
        eventClick: function(info) {
            info.jsEvent.preventDefault();

            const evento = info.event;

            // Mostra título, descrição e data formatada
            document.getElementById('modal-evento-titulo').textContent = evento.title || "Sem título";
            document.getElementById('modal-evento-descricao').textContent = evento.extendedProps.tipo || "Sem tipo";

            const corEvento = evento.backgroundColor || evento.extendedProps.color || evento.color;
            const corDiv = document.getElementById('modal-evento-cor');
            if (corDiv) corDiv.style.backgroundColor = corEvento;

            const inicio = new Date(evento.start);
            const fim = evento.end ? new Date(evento.end) : null;

            let dataTexto = inicio.toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
            });

            if (fim) {
                dataTexto += " até " + fim.toLocaleString('pt-BR', {
                    timeStyle: 'short'
                });
            }

            document.getElementById('modal-evento-data').textContent = dataTexto;

            // Abre o modal
            document.getElementById('evento-modal-bg').style.display = 'flex';
        }
    });
    
    console.log('renderizando calendario');
    calendar.render();
    carregarListaTarefas();

    // Event listener para o formulário de tarefa
    const form = document.getElementById('form-tarefa');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const titulo = document.getElementById('titulo').value;
            const tipo = document.getElementById('tipo').value;
            const data_inicio = document.getElementById('data-inicio').value;
            const data_fim = document.getElementById('data-fim').value;
            const colorId = document.getElementById('colorId').value;
            
            if (new Date(data_inicio) < new Date()) {
                alert("Você não pode criar tarefas no passado!");
                return;
            }
            
            fetch(window.criarTarefaUrl || "/criar_tarefa/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    titulo,
                    tipo,
                    data_inicio,
                    data_fim,
                    colorId
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    calendar.refetchEvents();
                    carregarListaTarefas();
                    cancelarFormulario();
                } else {
                    alert('Erro ao salvar tarefa');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao salvar tarefa');
            })
            .finally(() => {
            setTimeout(() => {
                if (btn) btn.disabled = false;
            }, 2000); // espera 2 segundos antes de reabilitar
        });
    });
    
    }

    // Event listener para o botão cancelar
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cancelarFormulario);
    }

    // Função para marcar tarefa como concluída
    function marcarTarefaConcluida(tarefaId, concluida) {
        fetch(window.atualizarStatusTarefaUrl || "/atualizar_status_tarefa/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                id: tarefaId,
                concluida: concluida
            })
        })
        .then(response => response.json())
        .then(data => {
            if(!data.success) {
                alert('Erro ao atualizar status da tarefa');
            } else {
                carregarListaTarefas();
                calendar.refetchEvents();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar status da tarefa');
        });
    }

    // Função para carregar lista de tarefas
    function carregarListaTarefas() {
        fetch(window.tarefasJsonUrl || "/tarefas_json/")
        .then(response => response.json())
        .then(tarefas => {
            const listaTarefasDiv = document.getElementById('lista-tarefas');
            if (!listaTarefasDiv) return;
            
            listaTarefasDiv.innerHTML = '';  // limpa a lista

            tarefas.forEach(tarefa => {
                const tarefaElem = document.createElement('div');
                tarefaElem.className = 'tarefa-item';

                // Obtém a cor baseada no colorId da tarefa
                const cor = GOOGLE_COLOR_MAP[tarefa.colorId] || '#e1e1e1';

                // Cria o indicador de cor
                const indicadorCor = document.createElement('div');
                indicadorCor.className = 'color-indicator';
                indicadorCor.style.backgroundColor = cor;

                const checkbox = document.createElement('input');
                checkbox.className = 'checkmark-simples';
                checkbox.type = 'checkbox';
                checkbox.checked = tarefa.concluida;
                checkbox.onchange = () => {
                    marcarTarefaConcluida(tarefa.id, checkbox.checked);
                };

                const texto = document.createElement('span');
                texto.className = 'tarefa-texto';
                texto.textContent = `${tarefa.titulo} (${tarefa.tipo}) - ${new Date(tarefa.data_inicio).toLocaleString()}`;

                const btnExcluir = document.createElement('button');
                btnExcluir.className = 'btn-excluir';
                btnExcluir.textContent = '🗑️ Excluir';
                btnExcluir.onclick = () => {
                    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                        fetch(window.deletarTarefaUrl || "/deletar_tarefa/", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCookie('csrftoken')
                            },
                            body: JSON.stringify({ id: tarefa.id })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                carregarListaTarefas();
                                calendar.refetchEvents();
                            } else {
                                alert('Erro ao excluir tarefa: ' + (data.error || 'Erro desconhecido'));
                            }
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            alert('Erro ao excluir tarefa');
                        });
                    }
                };

                tarefaElem.appendChild(indicadorCor);
                tarefaElem.appendChild(checkbox);
                tarefaElem.appendChild(texto);
                tarefaElem.appendChild(btnExcluir);
                listaTarefasDiv.appendChild(tarefaElem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar tarefas:', error);
        });
    }
    
    // Função para mostrar formulário
    function mostrarFormulario() {
        const modal = document.getElementById('modal-tarefa');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    // Função para cancelar formulário
    function cancelarFormulario() {
        const modal = document.getElementById('modal-tarefa');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Limpar formulário
        const form = document.getElementById('form-tarefa');
        if (form) {
            form.reset();
        }
    }

    // Função para obter cookie CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Expor funções globalmente se necessário
    window.dashboardFunctions = {
        mostrarFormulario,
        cancelarFormulario,
        carregarListaTarefas,
        marcarTarefaConcluida
    };
});

