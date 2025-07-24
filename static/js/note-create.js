// JavaScript para página de criar/editar nota
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do formulário
    const noteForm = document.getElementById('noteForm');
    const titleInput = document.getElementById('id_title');
    const contentTextarea = document.getElementById('id_content');
    const imageInput = document.getElementById('id_image');
    const pdfInput = document.getElementById('id_pdf');
    const previewArea = document.getElementById('attachmentPreview');
    const saveBtn = document.getElementById('saveBtn');
    
    // Configurar eventos
    setupFormEvents();
    setupToolbar();
    setupAttachments();
    setupAutoSave();
    
    // Focar no título se estiver vazio
    if (titleInput && !titleInput.value.trim()) {
        titleInput.focus();
    }
});

// Configurar eventos do formulário
function setupFormEvents() {
    const noteForm = document.getElementById('noteForm');
    const saveBtn = document.getElementById('saveBtn');
    
    if (noteForm) {
        noteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNote();
        });
    }
    
    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl+S para salvar
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveNote();
        }
        
        // Ctrl+B para negrito
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            formatText('bold');
        }
        
        // Ctrl+I para itálico
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            formatText('italic');
        }
    });
}

// Configurar toolbar de formatação
function setupToolbar() {
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.dataset.action;
            formatText(action);
        });
    });
}

// Formatação de texto
function formatText(action) {
    const textarea = document.getElementById('id_content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    
    switch (action) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
        case 'list':
            const lines = selectedText.split('\\n');
            formattedText = lines.map(line => line.trim() ? `- ${line.trim()}` : line).join('\\n');
            break;
        case 'link':
            const url = prompt('Digite a URL:');
            if (url) {
                formattedText = `[${selectedText || 'Link'}](${url})`;
            } else {
                return;
            }
            break;
        default:
            return;
    }
    
    // Substituir texto selecionado
    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.value = newValue;
    
    // Reposicionar cursor
    const newCursorPos = start + formattedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
}

// Configurar anexos
function setupAttachments() {
    const imageInput = document.getElementById('id_image');
    const pdfInput = document.getElementById('id_pdf');
    const previewArea = document.getElementById('attachmentPreview');
    
    // Preview de imagem
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                previewImage(file, previewArea);
            }
        });
    }
    
    // Preview de PDF
    if (pdfInput) {
        pdfInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                previewPDF(file, previewArea);
            }
        });
    }
    
    // Drag and drop
    setupDragAndDrop();
}

// Preview de imagem
function previewImage(file, previewArea) {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione apenas arquivos de imagem.', 'error');
        return;
    }
    
    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('A imagem deve ter no máximo 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'attachment-preview-item image-preview';
        previewDiv.innerHTML = `
            <div class="preview-header">
                <span class="preview-title">📷 Imagem anexada</span>
                <button type="button" class="remove-preview" onclick="removeImagePreview()">×</button>
            </div>
            <div class="preview-content">
                <img src="${e.target.result}" alt="Preview" class="preview-image">
                <div class="preview-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
            </div>
        `;
        
        // Limpar preview anterior
        previewArea.innerHTML = '';
        previewArea.appendChild(previewDiv);
    };
    reader.readAsDataURL(file);
}

// Preview de PDF
function previewPDF(file, previewArea) {
    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
        showNotification('Por favor, selecione apenas arquivos PDF.', 'error');
        return;
    }
    
    // Validar tamanho (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('O PDF deve ter no máximo 10MB.', 'error');
        return;
    }
    
    const previewDiv = document.createElement('div');
    previewDiv.className = 'attachment-preview-item pdf-preview';
    previewDiv.innerHTML = `
        <div class="preview-header">
            <span class="preview-title">📄 PDF anexado</span>
            <button type="button" class="remove-preview" onclick="removePDFPreview()">×</button>
        </div>
        <div class="preview-content">
            <div class="pdf-icon-large">📄</div>
            <div class="preview-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            </div>
        </div>
    `;
    
    // Limpar preview anterior
    previewArea.innerHTML = '';
    previewArea.appendChild(previewDiv);
}

// Remover preview de imagem
function removeImagePreview() {
    document.getElementById('id_image').value = '';
    document.getElementById('attachmentPreview').innerHTML = '';
}

// Remover preview de PDF
function removePDFPreview() {
    document.getElementById('id_pdf').value = '';
    document.getElementById('attachmentPreview').innerHTML = '';
}

// Configurar drag and drop
function setupDragAndDrop() {
    const dropZone = document.querySelector('.note-create-content');
    
    if (!dropZone) return;
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            
            if (file.type.startsWith('image/')) {
                document.getElementById('id_image').files = files;
                previewImage(file, document.getElementById('attachmentPreview'));
            } else if (file.type === 'application/pdf') {
                document.getElementById('id_pdf').files = files;
                previewPDF(file, document.getElementById('attachmentPreview'));
            } else {
                showNotification('Tipo de arquivo não suportado. Use imagens ou PDFs.', 'error');
            }
        }
    });
}

// Auto-save (salvar rascunho)
function setupAutoSave() {
    const titleInput = document.getElementById('id_title');
    const contentTextarea = document.getElementById('id_content');
    
    let autoSaveTimeout;
    
    function triggerAutoSave() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveDraft();
        }, 2000); // 2 segundos após parar de digitar
    }
    
    if (titleInput) {
        titleInput.addEventListener('input', triggerAutoSave);
    }
    
    if (contentTextarea) {
        contentTextarea.addEventListener('input', triggerAutoSave);
    }
}

// Salvar rascunho
function saveDraft() {
    const title = document.getElementById('id_title').value;
    const content = document.getElementById('id_content').value;
    
    if (!title.trim() && !content.trim()) return;
    
    const draft = {
        title: title,
        content: content,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('note_draft', JSON.stringify(draft));
    showNotification('Rascunho salvo automaticamente', 'info', 2000);
}

// Carregar rascunho
function loadDraft() {
    const draft = localStorage.getItem('note_draft');
    if (draft) {
        const draftData = JSON.parse(draft);
        
        if (confirm('Foi encontrado um rascunho salvo. Deseja carregá-lo?')) {
            document.getElementById('id_title').value = draftData.title || '';
            document.getElementById('id_content').value = draftData.content || '';
        }
        
        localStorage.removeItem('note_draft');
    }
}

// Salvar nota
async function saveNote() {
    const form = document.getElementById('noteForm');
    const saveBtn = document.getElementById('saveBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Validação
    const title = document.getElementById('id_title').value.trim();
    const content = document.getElementById('id_content').value.trim();
    
    if (!content) {
        showNotification('O conteúdo da nota é obrigatório.', 'error');
        document.getElementById('id_content').focus();
        return;
    }
    
    // Mostrar loading
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner" style="width: 16px; height: 16px; margin-right: 8px;"></span>Salvando...';
    
    try {
        const formData = new FormData(form);
        
        const response = await fetch(form.action || window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        });
        
        if (response.ok) {
            // Limpar rascunho
            localStorage.removeItem('note_draft');
            
            // Redirecionar ou mostrar sucesso
            const responseData = await response.json().catch(() => null);
            
            if (responseData && responseData.redirect) {
                window.location.href = responseData.redirect;
            } else {
                window.location.href = '/anotacoes/';
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            showNotification('Erro ao salvar nota: ' + (errorData.message || 'Erro desconhecido'), 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
        console.error('Erro ao salvar:', error);
    } finally {
        // Ocultar loading
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        // Restaurar botão
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span class="btn-icon">💾</span>Salvar Nota';
    }
}

// Utilitários
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return cookieValue || '';
}

function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Estilos inline
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 4000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover automaticamente
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// Carregar rascunho ao carregar a página
window.addEventListener('load', function() {
    // Só carregar rascunho se for uma nova nota (não edição)
    if (!window.location.href.includes('/editar/')) {
        loadDraft();
    }
});

