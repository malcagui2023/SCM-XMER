/**
 * Paschoalotto AI Companion - Main Application JavaScript
 * Bilingual support (English/Portuguese)
 */

// Global variables
let currentLanguage = 'pt';
let companionMinimized = false;
let currentUser = null;

// Initialize application
function initializeCompanion() {
    console.log('Initializing Paschoalotto AI Companion...');
    
    // Detect current language
    currentLanguage = document.documentElement.lang || 'pt';
    
    // Load user data
    loadUserData();
    
    // Update companion status
    updateCompanionStatus();
    
    // Start periodic updates
    setInterval(updateDashboardData, 30000);
    
    console.log('AI Companion initialized successfully');
}

// User data management
function loadUserData() {
    currentUser = {
        id: 1,
        name: 'Demo Operator',
        experience_level: 'intermediate',
        daily_goal_calls: 30,
        daily_goal_collections: 10,
        daily_goal_amount: 10000
    };
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
        'script_help': () => showScriptHelp()
    };
    
    if (actions[actionType]) {
        actions[actionType]();
    } else {
        const message = currentLanguage === 'pt' ? 
            `Ação ${actionType} não implementada ainda` : 
            `Action ${actionType} not implemented yet`;
        showNotification(message, 'info');
    }
}

// Quick action implementations
function showCustomerLookup() {
    const title = currentLanguage === 'pt' ? 'Buscar Cliente' : 'Customer Lookup';
    const cpfLabel = currentLanguage === 'pt' ? 'CPF do Cliente' : 'Customer CPF';
    const nameLabel = currentLanguage === 'pt' ? 'Nome do Cliente' : 'Customer Name';
    const searchBtn = currentLanguage === 'pt' ? 'Buscar' : 'Search';
    
    const modal = createQuickActionModal(title, `
        <div class="customer-lookup-form">
            <div class="mb-3">
                <label class="form-label">${cpfLabel}</label>
                <input type="text" class="form-control form-control-lg" id="quickSearchCPF" placeholder="000.000.000-00">
            </div>
            <div class="mb-3">
                <label class="form-label">${nameLabel}</label>
                <input type="text" class="form-control form-control-lg" id="quickSearchName" placeholder="${currentLanguage === 'pt' ? 'Nome completo' : 'Full name'}">
            </div>
            <button class="btn btn-primary btn-lg w-100" onclick="performQuickSearch()">
                <i class="fas fa-search me-2"></i>${searchBtn}
            </button>
        </div>
    `);
    modal.show();
}

function showPaymentCalculator() {
    const title = currentLanguage === 'pt' ? 'Calculadora de Pagamento' : 'Payment Calculator';
    const debtLabel = currentLanguage === 'pt' ? 'Valor da Dívida' : 'Debt Amount';
    const installmentsLabel = currentLanguage === 'pt' ? 'Número de Parcelas' : 'Number of Installments';
    const discountLabel = currentLanguage === 'pt' ? 'Desconto (%)' : 'Discount (%)';
    const interestLabel = currentLanguage === 'pt' ? 'Taxa de Juros (% a.m.)' : 'Interest Rate (% p.m.)';
    const calculateBtn = currentLanguage === 'pt' ? 'Calcular' : 'Calculate';
    
    const modal = createQuickActionModal(title, `
        <div class="payment-calculator">
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">${debtLabel}</label>
                    <input type="number" class="form-control form-control-lg" id="debtValue" placeholder="0,00" step="0.01">
                </div>
                <div class="col-md-6">
                    <label class="form-label">${installmentsLabel}</label>
                    <select class="form-select form-select-lg" id="installments">
                        <option value="1">${currentLanguage === 'pt' ? 'À vista' : 'Cash payment'}</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="6">6x</option>
                        <option value="12">12x</option>
                    </select>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6">
                    <label class="form-label">${discountLabel}</label>
                    <input type="number" class="form-control form-control-lg" id="discount" placeholder="0" min="0" max="80">
                </div>
                <div class="col-md-6">
                    <label class="form-label">${interestLabel}</label>
                    <input type="number" class="form-control form-control-lg" id="interestRate" placeholder="2.5" step="0.1">
                </div>
            </div>
            <button class="btn btn-success btn-lg w-100 mt-3" onclick="calculatePayment()">
                <i class="fas fa-calculator me-2"></i>${calculateBtn}
            </button>
            <div id="calculationResult" class="mt-3 d-none">
                <!-- Results will appear here -->
            </div>
        </div>
    `);
    modal.show();
}

function showComplianceCheck() {
    const title = currentLanguage === 'pt' ? 'Verificação de Compliance' : 'Compliance Check';
    const checklistTitle = currentLanguage === 'pt' ? 'Checklist de Compliance:' : 'Compliance Checklist:';
    const legalReminder = currentLanguage === 'pt' ? 'Lembrete Legal:' : 'Legal Reminder:';
    
    const checklistItems = currentLanguage === 'pt' ? [
        'Identifiquei-me corretamente',
        'Confirmei a identidade do devedor',
        'Informei sobre gravação da chamada',
        'Respeitei horário permitido (8h às 20h)',
        'Não usei linguagem ameaçadora'
    ] : [
        'Identified myself correctly',
        'Confirmed debtor identity',
        'Informed about call recording',
        'Respected allowed hours (8am to 8pm)',
        'Did not use threatening language'
    ];
    
    const reminderItems = currentLanguage === 'pt' ? [
        'Seja sempre respeitoso',
        'Não ligue nos finais de semana',
        'Documente todas as interações',
        'Respeite pedidos de não contato'
    ] : [
        'Always be respectful',
        'Do not call on weekends',
        'Document all interactions',
        'Respect no-contact requests'
    ];
    
    let checklistHtml = '';
    checklistItems.forEach((item, index) => {
        checklistHtml += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="check${index + 1}">
                <label class="form-check-label" for="check${index + 1}">
                    ${item}
                </label>
            </div>
        `;
    });
    
    let reminderHtml = '';
    reminderItems.forEach(item => {
        reminderHtml += `<li><i class="fas fa-check text-success me-2"></i>${item}</li>`;
    });
    
    const modal = createQuickActionModal(title, `
        <div class="compliance-check">
            <div class="compliance-checklist">
                <h6>${checklistTitle}</h6>
                ${checklistHtml}
            </div>
            <div class="compliance-tips mt-3">
                <h6>${legalReminder}</h6>
                <ul class="list-unstyled">
                    ${reminderHtml}
                </ul>
            </div>
        </div>
    `);
    modal.show();
}

function showScriptHelp() {
    const title = currentLanguage === 'pt' ? 'Ajuda com Scripts' : 'Script Help';
    const difficultSituations = currentLanguage === 'pt' ? 'Situações Difíceis' : 'Difficult Situations';
    const negotiationTechniques = currentLanguage === 'pt' ? 'Técnicas de Negociação' : 'Negotiation Techniques';
    
    const scripts = currentLanguage === 'pt' ? {
        'angry_customer': 'Cliente Irritado',
        'financial_hardship': 'Dificuldade Financeira',
        'payment_refusal': 'Recusa de Pagamento',
        'empathy_approach': 'Abordagem Empática',
        'solution_focus': 'Foco em Solução',
        'urgency_creation': 'Criação de Urgência'
    } : {
        'angry_customer': 'Angry Customer',
        'financial_hardship': 'Financial Hardship',
        'payment_refusal': 'Payment Refusal',
        'empathy_approach': 'Empathy Approach',
        'solution_focus': 'Solution Focus',
        'urgency_creation': 'Urgency Creation'
    };
    
    const modal = createQuickActionModal(title, `
        <div class="script-help">
            <div class="script-categories">
                <div class="script-category mb-3">
                    <h6>${difficultSituations}</h6>
                    <button class="btn btn-outline-primary w-100 mb-2" onclick="showScript('angry_customer')">
                        ${scripts.angry_customer}
                    </button>
                    <button class="btn btn-outline-primary w-100 mb-2" onclick="showScript('financial_hardship')">
                        ${scripts.financial_hardship}
                    </button>
                    <button class="btn btn-outline-primary w-100" onclick="showScript('payment_refusal')">
                        ${scripts.payment_refusal}
                    </button>
                </div>
                <div class="script-category mb-3">
                    <h6>${negotiationTechniques}</h6>
                    <button class="btn btn-outline-success w-100 mb-2" onclick="showScript('empathy_approach')">
                        ${scripts.empathy_approach}
                    </button>
                    <button class="btn btn-outline-success w-100 mb-2" onclick="showScript('solution_focus')">
                        ${scripts.solution_focus}
                    </button>
                    <button class="btn btn-outline-success w-100" onclick="showScript('urgency_creation')">
                        ${scripts.urgency_creation}
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
        const warningMsg = currentLanguage === 'pt' ? 'Digite uma pergunta' : 'Type a question';
        showNotification(warningMsg, 'warning');
        return;
    }
    
    input.value = '';
    
    // Send to AI API
    fetch('/api/ai-response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const response = data.response;
            let responseText = '';
            
            if (response.compliance) {
                responseText += `🔴 COMPLIANCE: ${response.compliance}\n\n`;
            }
            if (response.urgent) {
                responseText += `🟡 URGENT: ${response.urgent}\n\n`;
            }
            if (response.suggestion) {
                responseText += `💬 SUGGESTION: ${response.suggestion}\n\n`;
            }
            if (response.offer) {
                responseText += `💰 OFFER: ${response.offer}\n\n`;
            }
            if (response.insight) {
                responseText += `📊 INSIGHT: ${response.insight}`;
            }
            
            showNotification(responseText, 'info', 8000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMsg = currentLanguage === 'pt' ? 'Erro ao processar resposta' : 'Error processing response';
        showNotification(errorMsg, 'error');
    });
}

function askAI(question) {
    document.getElementById('aiChatInput').value = question;
    sendAIMessage();
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

// Live assistance
function startLiveAssistance() {
    if (window.location.pathname !== '/live-call' && window.location.pathname !== '/live-call-enhanced') {
        window.location.href = '/live-call-enhanced';
        return;
    }
    
    updateLiveStatus('online');
    const successMsg = currentLanguage === 'pt' ? 'Assistência ao vivo ativada!' : 'Live assistance activated!';
    showNotification(successMsg, 'success');
}

// Dashboard data loading
function updateDashboardData() {
    fetch('/api/dashboard-data')
        .then(response => response.json())
        .then(data => {
            const stats = data.daily_stats;
            
            // Update companion sidebar stats
            const todayCallsElement = document.getElementById('todayCalls');
            const todayCollectionsElement = document.getElementById('todayCollections');
            const todayAmountElement = document.getElementById('todayAmount');
            
            if (todayCallsElement) todayCallsElement.textContent = stats.calls_made;
            if (todayCollectionsElement) todayCollectionsElement.textContent = stats.payments_collected;
            if (todayAmountElement) todayAmountElement.textContent = `R$ ${(stats.collection_amount / 1000).toFixed(1)}K`;
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
        });
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
            <div class="flex-grow-1" style="white-space: pre-line;">${message}</div>
            <button class="btn-close btn-close-sm ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    container.appendChild(notification);
    
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
        const warningMsg = currentLanguage === 'pt' ? 'Digite um valor de dívida válido' : 'Enter a valid debt amount';
        showNotification(warningMsg, 'warning');
        return;
    }
    
    // Send calculation request to API
    fetch('/api/payment-calculation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            debt_value: debtValue,
            installments: installments,
            discount: discount,
            interest_rate: interestRate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const calc = data.calculation;
            const labels = currentLanguage === 'pt' ? {
                result: 'Resultado do Cálculo:',
                original: 'Valor Original:',
                discount: 'Desconto:',
                discounted: 'Valor com Desconto:',
                installments: 'Parcelas:',
                total: 'Total a Pagar:'
            } : {
                result: 'Calculation Result:',
                original: 'Original Amount:',
                discount: 'Discount:',
                discounted: 'Discounted Amount:',
                installments: 'Installments:',
                total: 'Total to Pay:'
            };
            
            const resultElement = document.getElementById('calculationResult');
            resultElement.innerHTML = `
                <div class="calculation-results">
                    <h6>${labels.result}</h6>
                    <div class="result-item">
                        <strong>${labels.original}</strong> R$ ${calc.original_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div class="result-item">
                        <strong>${labels.discount}</strong> R$ ${calc.discount_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div class="result-item">
                        <strong>${labels.discounted}</strong> R$ ${calc.discounted_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div class="result-item">
                        <strong>${labels.installments}</strong> ${calc.installments}x de R$ ${calc.installment_value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div class="result-item total">
                        <strong>${labels.total}</strong> R$ ${calc.total_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                </div>
            `;
            resultElement.classList.remove('d-none');
        }
    })
    .catch(error => {
        console.error('Error calculating payment:', error);
        const errorMsg = currentLanguage === 'pt' ? 'Erro no cálculo' : 'Calculation error';
        showNotification(errorMsg, 'error');
    });
}

// Script display
function showScript(scriptType) {
    const scripts = currentLanguage === 'pt' ? {
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
    } : {
        'angry_customer': {
            title: 'Angry Customer',
            content: 'Stay calm and use: "I understand your frustration and I\'m here to help. Let\'s find a solution together."'
        },
        'financial_hardship': {
            title: 'Financial Hardship',
            content: 'Be empathetic: "I understand you\'re going through difficulties. Let\'s see what options we have to make payment easier."'
        },
        'payment_refusal': {
            title: 'Payment Refusal',
            content: 'Explore alternatives: "I understand your position. How about we talk about a plan that fits your budget?"'
        }
    };
    
    const script = scripts[scriptType];
    if (script) {
        const copyLabel = currentLanguage === 'pt' ? 'Copiar Script' : 'Copy Script';
        const displayElement = document.getElementById('scriptDisplay');
        displayElement.innerHTML = `
            <div class="script-content">
                <h6>${script.title}</h6>
                <p class="script-text">${script.content}</p>
                <button class="btn btn-primary btn-sm" onclick="copyScript('${script.content}')">
                    <i class="fas fa-copy me-2"></i>${copyLabel}
                </button>
            </div>
        `;
        displayElement.classList.remove('d-none');
    }
}

function copyScript(text) {
    navigator.clipboard.writeText(text).then(() => {
        const successMsg = currentLanguage === 'pt' ? 'Script copiado!' : 'Script copied!';
        showNotification(successMsg, 'success');
    });
}

// Customer search
function performQuickSearch() {
    const cpf = document.getElementById('quickSearchCPF').value;
    const name = document.getElementById('quickSearchName').value;
    
    if (!cpf && !name) {
        const warningMsg = currentLanguage === 'pt' ? 'Digite CPF ou nome' : 'Enter CPF or name';
        showNotification(warningMsg, 'warning');
        return;
    }
    
    fetch('/api/customer-lookup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf: cpf, name: name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const customer = data.customer;
            const successMsg = currentLanguage === 'pt' ? 
                `Cliente encontrado: ${customer.name}\nTelefone: ${customer.phone}\nDívida: R$ ${customer.debt_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` :
                `Customer found: ${customer.name}\nPhone: ${customer.phone}\nDebt: R$ ${customer.debt_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            showNotification(successMsg, 'success', 8000);
        }
    })
    .catch(error => {
        console.error('Error searching customer:', error);
        const errorMsg = currentLanguage === 'pt' ? 'Erro na busca' : 'Search error';
        showNotification(errorMsg, 'error');
    });
}

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
window.performQuickSearch = performQuickSearch;

