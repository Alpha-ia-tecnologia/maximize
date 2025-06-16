/**
 * Sistema de alertas com estilo Tailwind CSS Border accent
 * Substitui os alerts padrão do navegador por alertas estilizados
 */

// Injetar o HTML do componente de alerta no corpo do documento quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Criar o container do alerta se ainda não existir
    if (!document.getElementById('alertContainer')) {
        const alertHTML = `
            <div id="alertContainer" class="fixed top-4 right-4 z-50 max-w-md w-full hidden transform transition-all duration-300 ease-in-out">
                <div class="rounded-lg border-l-4 p-4 shadow-md bg-white mb-3" id="alertBox">
                    <div class="flex items-start">
                        <div id="alertIcon" class="flex-shrink-0 mr-3">
                            <!-- Icon will be inserted here -->
                        </div>
                        <div class="flex-1">
                            <h4 class="text-sm font-medium" id="alertTitle">Alerta</h4>
                            <p class="text-sm mt-1 text-gray-500" id="alertMessage"></p>
                        </div>
                        <button id="closeAlert" class="ml-4 text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Inserir no final do body
        document.body.insertAdjacentHTML('beforeend', alertHTML);
    }
});

/**
 * Função para mostrar alerta estilizado com Tailwind CSS Border accent
 * @param {string} type - Tipo de alerta ('success', 'error', 'warning', 'info')
 * @param {string} title - Título do alerta
 * @param {string} message - Mensagem do alerta
 * @param {number} duration - Duração em ms (0 para não fechar automaticamente)
 * @param {Function} callback - Função de callback após fechar o alerta
 */
function showAlert(type, title, message, duration = 5000, callback = null) {
    const alertContainer = document.getElementById('alertContainer');
    const alertBox = document.getElementById('alertBox');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertIcon = document.getElementById('alertIcon');
    const closeAlert = document.getElementById('closeAlert');
    
    // Definir estilos baseados no tipo
    let borderColor, iconClass, bgColor;
    
    switch (type) {
        case 'success':
            borderColor = 'border-green-500';
            bgColor = 'bg-green-50';
            iconClass = '<i class="fas fa-check-circle text-green-500 text-lg"></i>';
            break;
        case 'error':
            borderColor = 'border-red-500';
            bgColor = 'bg-red-50';
            iconClass = '<i class="fas fa-exclamation-circle text-red-500 text-lg"></i>';
            break;
        case 'warning':
            borderColor = 'border-yellow-500';
            bgColor = 'bg-yellow-50';
            iconClass = '<i class="fas fa-exclamation-triangle text-yellow-500 text-lg"></i>';
            break;
        case 'info':
        default:
            borderColor = 'border-blue-500';
            bgColor = 'bg-blue-50';
            iconClass = '<i class="fas fa-info-circle text-blue-500 text-lg"></i>';
            break;
    }
    
    // Remover classes de cor anteriores
    alertBox.className = alertBox.className
        .replace(/border-\w+-500/g, '')
        .replace(/bg-\w+-50/g, '');
    
    // Adicionar novas classes
    alertBox.classList.add(borderColor, bgColor, 'rounded-lg', 'border-l-4', 'p-4', 'shadow-md');
    
    // Definir conteúdo
    alertTitle.textContent = title || 'Alerta';
    alertMessage.textContent = message || '';
    alertIcon.innerHTML = iconClass;
    
    // Mostrar o alerta com animação
    alertContainer.classList.remove('hidden');
    alertContainer.classList.add('translate-x-0');
    alertContainer.classList.remove('translate-x-full');
    
    // Configurar evento para fechar
    const closeAlertFn = function() {
        alertContainer.classList.add('translate-x-full');
        alertContainer.classList.remove('translate-x-0');
        
        // Esconder após a animação
        setTimeout(() => {
            alertContainer.classList.add('hidden');
            if (typeof callback === 'function') {
                callback();
            }
        }, 300);
    };
    
    // Remover listener anterior e adicionar novo
    const newCloseBtn = closeAlert.cloneNode(true);
    closeAlert.parentNode.replaceChild(newCloseBtn, closeAlert);
    newCloseBtn.addEventListener('click', closeAlertFn);
    
    // Fechar automaticamente após a duração especificada (se não for 0)
    if (duration > 0) {
        setTimeout(closeAlertFn, duration);
    }
    
    // Retornar função para fechar o alerta programaticamente
    return closeAlertFn;
}

/**
 * Função para mostrar diálogo de confirmação estilizado com botões personalizados
 * @param {string} title - Título do alerta
 * @param {string} message - Mensagem do alerta
 * @param {Function} onConfirm - Função a ser executada quando confirmar
 * @param {Function} onCancel - Função a ser executada quando cancelar
 * @param {string} confirmText - Texto do botão de confirmação
 * @param {string} cancelText - Texto do botão de cancelamento
 */
function showConfirm(title, message, onConfirm, onCancel = null, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    // Criar elemento para colocar o HTML personalizado
    const alertMessageElement = document.createElement('div');
    alertMessageElement.innerHTML = `<p class="mb-2">${message}</p>`;
    
    // Criar botões
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'mt-3 flex space-x-3';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm';
    cancelBtn.textContent = cancelText;
    
    const confirmBtn = document.createElement('button'); 
    confirmBtn.className = 'px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm';
    confirmBtn.textContent = confirmText;
    
    confirmDiv.appendChild(cancelBtn);
    confirmDiv.appendChild(confirmBtn);
    
    // Mostrar alerta com elementos customizados
    const closeAlertFn = showAlert('info', title, '', 0);
    
    // Substituir o conteúdo padrão do alerta
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerHTML = '';
    alertMessage.appendChild(alertMessageElement);
    alertMessage.appendChild(confirmDiv);
    
    // Configurar eventos dos botões
    cancelBtn.addEventListener('click', function() {
        closeAlertFn();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    });
    
    confirmBtn.addEventListener('click', function() {
        closeAlertFn();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });
    
    return closeAlertFn;
}

/**
 * Função para mostrar diálogo de exclusão (confirmação com estilo de alerta de perigo)
 * @param {string} title - Título do alerta
 * @param {string} message - Mensagem do alerta
 * @param {Function} onConfirm - Função a ser executada quando confirmar
 * @param {Function} onCancel - Função a ser executada quando cancelar
 */
function showDeleteConfirm(title, message, onConfirm, onCancel = null) {
    // Criar elemento para colocar o HTML personalizado
    const alertMessageElement = document.createElement('div');
    alertMessageElement.innerHTML = `
        <p class="mb-2">${message}</p>
        <p class="text-xs text-red-600">Esta operação não pode ser desfeita.</p>
    `;
    
    // Criar botões
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'mt-3 flex space-x-3';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm';
    cancelBtn.textContent = 'Cancelar';
    
    const confirmBtn = document.createElement('button'); 
    confirmBtn.className = 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm';
    confirmBtn.textContent = 'Excluir';
    
    confirmDiv.appendChild(cancelBtn);
    confirmDiv.appendChild(confirmBtn);
    
    // Mostrar alerta com elementos customizados
    const closeAlertFn = showAlert('warning', title, '', 0);
    
    // Substituir o conteúdo padrão do alerta
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerHTML = '';
    alertMessage.appendChild(alertMessageElement);
    alertMessage.appendChild(confirmDiv);
    
    // Configurar eventos dos botões
    cancelBtn.addEventListener('click', function() {
        closeAlertFn();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    });
    
    confirmBtn.addEventListener('click', function() {
        closeAlertFn();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });
    
    return closeAlertFn;
}

// Sobrescrever a função de alerta nativa para usar nossa versão personalizada
window.alert = function(message) {
    showAlert('info', 'Alerta', message);
};

// Sobrescrever a função de confirmação nativa para usar nossa versão personalizada
window.confirm = function(message) {
    // Como não podemos fazer uma chamada síncrona (como o confirm original),
    // esta substituição tem limitações e só funciona em contextos assíncronos
    let result = false;
    showConfirm('Confirmação', message, 
        function() { result = true; }, 
        function() { result = false; }
    );
    return result;
}; 