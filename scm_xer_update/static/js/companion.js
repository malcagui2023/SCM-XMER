/**
 * Paschoalotto AI Companion - Core JavaScript Functionality
 * Ultra-simple, age-inclusive design for debt collection operators
 */

// Global variables
let companionMinimized = false;
let currentUser = null;
let dailyStats = {
    calls_made: 0,
    contacts_reached: 0,
    payments_collected: 0,
    collection_amount: 0
};

// Initialize companion
function initializeCompanion() {
    console.log('Initializing Paschoalotto AI Companion...');
    
    // Load user data
    loadUserData();
    
    // Update companion status
    updateCompanionStatus();
    
    // Start periodic updates
    setInterval(updateDashboardData, 30000); // Update every 30 seconds
    
    // Initialize voice commands if supported
    initializeVoiceCommands();
    
    console.log('AI Companion initialized successfully');
}

// User data management
function loadUserData() {
    // Simulate loading user data
    currentUser = {
        id: 1,
        name: 'Operador Demo',
        experience_level: 'intermediate',
        daily_goal_calls: 30,
        daily_goal_collections: 10,
        daily_goal_amount: 10000
    };
    
    // Update UI with user data
    updateUserInterface();
}

function updateUserInterface() {
    // Update any user-specific UI elements
    if (currentUser) {
        console.log(`Welcome ${currentUser.name}`);
    }
}

// Companion status management
function updateCompanionStatus() {
    const statusElement = document.getElementById('liveStatus');
    if (statusElement) {
        statusElement.className = 'status-indicator offline';
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Offline</span>';
    }
}

function updateLiveStatus(status) {
    const statusElement = document.getElementById('liveStatus');
    if (statusElement) {
        statusElement.className = `status-indicator ${status}`;
        const icon = status === 'online' ? 'fas fa-circle text-success' : 'fas fa-circle';
        const text = status === 'online' ? 'Online' : 'Offline';
        statusElement.innerHTML = `<i class="${icon}"></i><span>${text}</span>`;
    }
}

// Companion visibility toggle
function toggleCompanion() {
    const sidebar = document.getElementById('aiCompanionSidebar');
    const minimizeBtn = sidebar.querySelector('.btn-minimize i');
    
    companionMinimized = !companionMinimized;
    
    if (companionMinimized) {
        sidebar.classList.add('minimized');
        minimizeBtn.className = 'fas fa-plus';
    } else {
        sidebar.classList.remove('minimized');
        minimizeBtn.className = 'fas fa-minus';
    }
}

// Quick actions
function quickAction(actionType) {
    console.log(`Quick action: ${actionType}`);
    
    const actions = {
        'customer_lookup': () => showCustomerLookup(),
        'payment_calculator': () => showPaymentCalculator(),
        'compliance_check': () => showComplianceCheck(),
        'script_help': () => showScriptHelp(),
        'payment_plan': () => showPaymentPlan(),
        'discount_offer': () => showDiscountOffer(),
        'callback_schedule': () => showCallbackSchedule(),
        'escalate_supervisor': () => escalateToSupervisor(),
        'daily_tips': () => showDailyTips()
    };
    
    if (actions[actionType]) {
        actions[actionType]();
    } else {
        showNotification(`Ação ${actionType} não implementada ainda`, 'info');
    }
}

// Quick action implementations
function showCustomerLookup() {
    const modal = createQuickActionModal('Buscar Cliente', `
        <div class="customer-lookup-form">
            <div class="mb-3">
                <label class="form-label">CPF do Cliente</label>
                <input type="text" class="form-control form-control-lg" id="quickSearchCPF" placeholder="000.000.000-00">
            </div>
            <div class="mb-3">
                <label class="form-label">Nome do Cliente</label>
                <input type="text" class="form-control form-control-lg" id="quickSearchName" placeholder="Nome completo">
            </div>
            <button class="btn btn-primary btn-lg w-100" onclick="performQuickSearch()">
                <i class="fas fa-search me-2"></i>Buscar
            </button>
        </div>
    `);
    modal.show();
}

function showPaymentCalculator() {
    const modal = createQuickActionModal('Payment Calculator', `
        <div class="payment-calculator">
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Debt Amount</label>
                    <input type="number" class="form-control form-control-lg" id="debtValue" placeholder="0.00" step="0.01">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Number of Installments</label>
                    <select class="form-select form-select-lg" id="installments">
                        <option value="1">Cash payment</option>
                        <option value="2">2 installments</option>
                        <option value="3">3 installments</option>
                        <option value="6">6 installments</option>
                        <option value="12">12 installments</option>
                    </select>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6">
                    <label class="form-label">Discount (%)</label>
                    <input type="number" class="form-control form-control-lg" id="discount" placeholder="0" min="0" max="80">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Interest Rate (% p.m.)</label>
                    <input type="number" class="form-control form-control-lg" id="interestRate" placeholder="2.5" step="0.1">
                </div>
            </div>
            <button class="btn btn-success btn-lg w-100 mt-3" onclick="calculatePayment()">
                <i class="fas fa-calculator me-2"></i>Calculate
            </button>
            <div id="calculationResult" class="mt-3 d-none">
                <!-- Results will appear here -->
            </div>
        </div>
    `);
    modal.show();
}

function showComplianceCheck() {
    const modal = createQuickActionModal('Verificação de Compliance', `
        <div class="compliance-check">
            <div class="compliance-checklist">
                <h6>Checklist de Compliance:</h6>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="check1">
                    <label class="form-check-label" for="check1">
                        Identifiquei-me corretamente
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="check2">
                    <label class="form-check-label" for="check2">
                        Confirmei a identidade do devedor
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="check3">
                    <label class="form-check-label" for="check3">
                        Informei sobre gravação da chamada
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="check4">
                    <label class="form-check-label" for="check4">
                        Respeitei horário permitido (8h às 20h)
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="check5">
                    <label class="form-check-label" for="check5">
                        Não usei linguagem ameaçadora
                    </label>
                </div>
            </div>
            <div class="compliance-tips mt-3">
                <h6>Lembrete Legal:</h6>
                <ul class="list-unstyled">
                    <li><i class="fas fa-check text-success me-2"></i>Seja sempre respeitoso</li>
                    <li><i class="fas fa-check text-success me-2"></i>Não ligue nos finais de semana</li>
                    <li><i class="fas fa-check text-success me-2"></i>Documente todas as interações</li>
                    <li><i class="fas fa-check text-success me-2"></i>Respeite pedidos de não contato</li>
                </ul>
            </div>
        </div>
    `);
    modal.show();
}

function showScriptHelp() {
    const modal = createQuickActionModal('Ajuda com Scripts', `
        <div class="script-help">
            <div class="script-categories">
                <div class="script-category mb-3">
                    <h6>Situações Difíceis</h6>
                    <button class="btn btn-outline-primary w-100 mb-2" onclick="showScript('angry_customer')">
                        Cliente Irritado
                    </button>
                    <button class="btn btn-outline-primary w-100 mb-2" onclick="showScript('financial_hardship')">
                        Dificuldade Financeira
                    </button>
                    <button class="btn btn-outline-primary w-100" onclick="showScript('payment_refusal')">
                        Recusa de Pagamento
                    </button>
                </div>
                <div class="script-category mb-3">
                    <h6>Técnicas de Negociação</h6>
                    <button class="btn btn-outline-success w-100 mb-2" onclick="showScript('empathy_approach')">
                        Abordagem Empática
                    </button>
                    <button class="btn btn-outline-success w-100 mb-2" onclick="showScript('solution_focus')">
                        Foco em Solução
                    </button>
                    <button class="btn btn-outline-success w-100" onclick="showScript('urgency_creation')">
                        Criação de Urgência
                    </button>
                </div>
            </div>
            <div id="scriptDisplay" class="script-display mt-3 d-none">
                <!-- Selected script will appear here -->
            </div>
        </div>
    `);
    modal.show();
}

// AI Chat functionality
function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    
    if (!message) {
        showNotification('Digite uma pergunta', 'warning');
        return;
    }
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        showAIResponse(response);
    }, 1500);
}

function askAI(question) {
    document.getElementById('aiChatInput').value = question;
    sendAIMessage();
}

function generateAIResponse(message) {
    const responses = {
        'cliente irritado': 'Para clientes irritados, mantenha a calma e use a técnica do espelhamento: "Entendo que você está frustrado..." Ofereça soluções práticas e evite discussões.',
        'plano de pagamento': 'Ofereça opções flexíveis: à vista com desconto, parcelado em 3x, 6x ou 12x. Sempre calcule o valor total e confirme a capacidade de pagamento.',
        'melhorar performance': 'Foque nos horários de maior sucesso (14h-16h), use abordagem empática, e sempre ofereça soluções. Documente tudo para aprender com cada chamada.',
        'default': 'Posso ajudar com scripts, cálculos de pagamento, compliance e técnicas de negociação. Seja mais específico na sua pergunta.'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

function showAIResponse(response) {
    showNotification(response, 'info', 8000);
}

function showTypingIndicator() {
    // Implementation for typing indicator
}

function hideTypingIndicator() {
    // Implementation to hide typing indicator
}

// Chat input handling
function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

// Live assistance
function startLiveAssistance() {
    if (window.location.pathname !== '/live-call') {
        window.location.href = '/live-call';
        return;
    }
    
    updateLiveStatus('online');
    showNotification('Assistência ao vivo ativada!', 'success');
}

// Dashboard data loading
function loadDashboardData() {
    // Simulate loading dashboard data
    fetch('/api/dashboard-data')
        .then(response => response.json())
        .then(data => {
            updateDashboardStats(data);
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
            // Use mock data for demo
            updateDashboardStats({
                daily_stats: {
                    calls_made: 19,
                    contacts_reached: 12,
                    payments_collected: 4,
                    collection_amount: 7500
                },
                compliance_score: 95
            });
        });
}

function updateDashboardData() {
    loadDashboardData();
}

function updateDashboardStats(data) {
    dailyStats = data.daily_stats;
    
    // Update companion sidebar stats
    const todayCallsElement = document.getElementById('todayCalls');
    const todayCollectionsElement = document.getElementById('todayCollections');
    const todayAmountElement = document.getElementById('todayAmount');
    
    if (todayCallsElement) todayCallsElement.textContent = dailyStats.calls_made;
    if (todayCollectionsElement) todayCollectionsElement.textContent = dailyStats.payments_collected;
    if (todayAmountElement) todayAmountElement.textContent = `R$ ${(dailyStats.collection_amount / 1000).toFixed(1)}K`;
}

// Mobile menu toggle
function toggleMobileMenu() {
    const fabMenu = document.getElementById('fabMenu');
    fabMenu.classList.toggle('active');
}

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="flex-grow-1">${message}</div>
            <button class="btn-close btn-close-sm ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

// Modal helper
function createQuickActionModal(title, content) {
    const modal = document.getElementById('quickActionModal');
    const titleElement = document.getElementById('quickActionTitle');
    const contentElement = document.getElementById('quickActionContent');
    
    titleElement.textContent = title;
    contentElement.innerHTML = content;
    
    return new bootstrap.Modal(modal);
}

// Payment calculation
function calculatePayment() {
    const debtValue = parseFloat(document.getElementById('debtValue').value) || 0;
    const installments = parseInt(document.getElementById('installments').value) || 1;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    
    if (debtValue <= 0) {
        showNotification('Please enter a valid debt amount', 'warning');
        return;
    }
    
    // Calculate discounted amount
    const discountedAmount = debtValue * (1 - discount / 100);
    
    // Calculate installment value with interest
    let installmentValue;
    if (installments === 1) {
        installmentValue = discountedAmount;
    } else {
        const monthlyRate = interestRate / 100;
        if (monthlyRate > 0) {
            installmentValue = discountedAmount * (monthlyRate * Math.pow(1 + monthlyRate, installments)) / 
                              (Math.pow(1 + monthlyRate, installments) - 1);
        } else {
            installmentValue = discountedAmount / installments;
        }
    }
    
    const totalAmount = installmentValue * installments;
    
    // Display results
    const resultElement = document.getElementById('calculationResult');
    resultElement.innerHTML = `
        <div class="calculation-results">
            <h6>Calculation Result:</h6>
            <div class="result-item">
                <strong>Original Amount:</strong> $ ${debtValue.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </div>
            <div class="result-item">
                <strong>Discount:</strong> ${discount}% ($ ${(debtValue - discountedAmount).toLocaleString('en-US', {minimumFractionDigits: 2})})
            </div>
            <div class="result-item">
                <strong>Discounted Amount:</strong> $ ${discountedAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </div>
            <div class="result-item">
                <strong>Installments:</strong> ${installments}x of $ ${installmentValue.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </div>
            <div class="result-item total">
                <strong>Total to Pay:</strong> $ ${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </div>
        </div>
    `;
    resultElement.classList.remove('d-none');
}

// Voice commands (if supported)
function initializeVoiceCommands() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        console.log('Voice commands available');
        // Implementation for voice commands would go here
    }
}

// Script display
function showScript(scriptType) {
    const scripts = {
        'angry_customer': {
            title: 'Cliente Irritado',
            content: 'Mantenha a calma e use: "Entendo sua frustração e estou aqui para ajudar. Vamos encontrar uma solução juntos."'
        },
        'financial_hardship': {
            title: 'Dificuldade Financeira',
            content: 'Seja empático: "Compreendo que está passando por dificuldades. Vamos ver que opções temos para facilitar o pagamento."'
        },
        'payment_refusal': {
            title: 'Recusa de Pagamento',
            content: 'Explore alternativas: "Entendo sua posição. Que tal conversarmos sobre um plano que caiba no seu orçamento?"'
        }
    };
    
    const script = scripts[scriptType];
    if (script) {
        const displayElement = document.getElementById('scriptDisplay');
        displayElement.innerHTML = `
            <div class="script-content">
                <h6>${script.title}</h6>
                <p class="script-text">${script.content}</p>
                <button class="btn btn-primary btn-sm" onclick="copyScript('${script.content}')">
                    <i class="fas fa-copy me-2"></i>Copiar Script
                </button>
            </div>
        `;
        displayElement.classList.remove('d-none');
    }
}

function copyScript(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Script copiado!', 'success');
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCompanion();
});

// Export functions for global access
window.toggleCompanion = toggleCompanion;
window.quickAction = quickAction;
window.sendAIMessage = sendAIMessage;
window.askAI = askAI;
window.handleChatKeypress = handleChatKeypress;
window.startLiveAssistance = startLiveAssistance;
window.toggleMobileMenu = toggleMobileMenu;
window.showNotification = showNotification;
window.calculatePayment = calculatePayment;
window.showScript = showScript;
window.copyScript = copyScript;

