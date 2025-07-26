// App principal - Funcionalidades gerais
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const addNoteBtn = document.getElementById('addNoteBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    // Abrir modal de adicionar nota
    // if (addNoteBtn) {
    //     addNoteBtn.addEventListener('click', function() {
    //         openAddNoteModal();
    //     });
    // }
    
    // Fechar modal clicando no overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.style.display = 'none';
    }
}

function getCookie(name) {
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


// // Função para abrir modal de adicionar nota
// function openAddNoteModal() {
//     const modalOverlay = document.getElementById('modalOverlay');
//     const modalContent = document.getElementById('modalContent');

//     // Carregar conteúdo do modal
//     modalContent.innerHTML = `
//         <div class="add-note-modal">
//             <div class="modal-header">
//                 <h3 class="modal-title">Nova Nota</h3>
//                 <button type="button" class="modal-close" onclick="closeModal()">
//                     <span class="close-icon">×</span>
//                 </button>
//             </div>
            
//             <form class="quick-note-form" id="quickNoteForm">
//                 <input type="hidden" name="csrfmiddlewaretoken" value="${getCSRFToken()}">
                
//                 <div class="quick-form-group">
//                     <input type="text" 
//                            name="title" 
//                            id="quickTitle" 
//                            class="quick-input title-quick" 
//                            placeholder="Título da nota..."
//                            maxlength="200">
//                 </div>
                
//                 <div class="quick-form-group">
//                     <textarea name="content" 
//                               id="quickContent" 
//                               class="quick-textarea" 
//                               placeholder="Digite sua nota aqui..."
//                               rows="8"
//                               required></textarea>
//                 </div>
                
//                 <div class="quick-attachments">
//                     <label class="attachment-btn" for="quickImage">
//                         <span class="attachment-icon">📷</span>
//                         <span class="attachment-text">Imagem</span>
//                         <input type="file" id="quickImage" name="image" accept="image/*" style="display: none;">
//                     </label>
                    
//                     <label class="attachment-btn" for="quickPdf">
//                         <span class="attachment-icon">📄</span>
//                         <span class="attachment-text">PDF</span>
//                         <input type="file" id="quickPdf" name="pdf" accept=".pdf" style="display: none;">
//                     </label>
//                 </div>
                
//                 <div class="attachment-preview-quick" id="attachmentPreviewQuick">
//                     <!-- Preview dos anexos -->
//                 </div>
                
//                 <div class="quick-actions">
//                     <button type="button" class="btn-quick btn-cancel" onclick="closeModal()">
//                         Cancelar
//                     </button>
//                     <button type="submit" class="btn-quick btn-save" id="saveQuick">
//                         <span class="save-icon">💾</span>
//                         Salvar
//                     </button>
//                 </div>
//             </form>
//         </div>
//     `;
    
//     // Mostrar modal
//     modalOverlay.style.display = 'absolute';
    
//     // Focar no campo de título
//     setTimeout(() => {
//         document.getElementById('quickTitle').focus();
//     }, 100);
    
//     // Configurar eventos do formulário
//     setupQuickNoteForm();
// }

// Função para fechar modal


// Obter CSRF token


// Mostrar erro
function showError(message) {
    // Criar toast de erro
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <span class="error-icon">⚠️</span>
        <span class="error-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Adicionar estilos inline
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error);
        color: white;
        padding: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 4000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .attachment-preview-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        margin-top: 8px;
        position: relative;
    }
    
    .preview-image, .preview-pdf {
        position: relative;
        display: inline-block;
    }
    
    .remove-attachment {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--error);
        color: white;
        border: none;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .preview-name {
        font-size: 0.875rem;
        color: var(--text-secondary);
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .pdf-icon {
        font-size: 2rem;
        display: block;
        padding: 8px;
    }
`;
document.head.appendChild(style);

