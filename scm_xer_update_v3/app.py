from flask import Flask, render_template, request, jsonify, session
from datetime import datetime
import json
import os

app = Flask(__name__)
# Use a generic secret key not tied to any client.  In production this
# should be set via an environment variable to avoid committing
# sensitive data to source control.
app.secret_key = 'scm_analytics_ai_companion_secret_key'

# Language configuration
# Languages supported by the application.  Each entry defines a
# human‑readable name and an emoji flag for quick visual cues in the
# navigation bar.  English and Portuguese were originally provided;
# Spanish and Italian have been added to support a broader audience.
LANGUAGES = {
    'en': {
        'name': 'English',
        'flag': '🇺🇸'
    },
    'pt': {
        'name': 'Português',
        'flag': '🇧🇷'
    },
    'es': {
        'name': 'Español',
        'flag': '🇪🇸'
    },
    'it': {
        'name': 'Italiano',
        'flag': '🇮🇹'
    }
}

# Translations
# Translation strings for each supported language.  Wherever possible
# these strings match the tone and intent of the original Portuguese and
# English copy but have been updated to remove any reference to
# Paschoalotto.  New entries for Spanish (es) and Italian (it) have
# been added.
TRANSLATIONS = {
    'en': {
        'app_title': 'SCM Analytics AI Companion',
        'app_subtitle': 'Intelligent Debt Collection Assistant',
        'dashboard': 'Dashboard',
        'live_call': 'Live Call',
        'performance': 'Performance',
        'training': 'Training',
        'settings': 'Settings',
        'welcome_message': 'Welcome to your AI Companion',
        'daily_goals': 'Daily Goals',
        'calls_made': 'Calls Made',
        'contacts_reached': 'Contacts Reached',
        'payments_collected': 'Payments Collected',
        'collection_amount': 'Collection Amount',
        'ai_suggestions': 'AI Suggestions',
        'customer_insights': 'Customer Insights',
        'compliance_alerts': 'Compliance Alerts',
        'start_call': 'Start Call',
        'end_call': 'End Call',
        'customer_said': 'What did the customer say?',
        'quick_responses': 'Quick Responses',
        'cant_pay': "Can't pay",
        'wants_discount': 'Wants discount',
        'angry': 'Angry',
        'interested': 'Interested',
        'needs_time': 'Needs time',
        'disputes_debt': 'Disputes debt',
        'ai_recommendations': 'AI Recommendations',
        'compliance': 'COMPLIANCE',
        'urgent': 'URGENT',
        'suggestion': 'SUGGESTION',
        'offer': 'OFFER',
        'insight': 'INSIGHT',
        'success_probability': 'Success Probability',
        'audio_controls': 'Audio Controls',
        'audio_alerts': 'Audio Alerts',
        'text_to_speech': 'Text to Speech',
        'volume': 'Volume',
        'use': 'Use',
        'modify': 'Modify',
        'copy': 'Copy',
        'analyze': 'Analyze',
        'click_and_speak': 'Click and Speak',
        'listening': 'Listening...',
        'speak_now': 'Speak now...',
        'voice_not_supported': 'Voice recognition not supported in this browser',
        'type_customer_message': 'Type or use buttons below...',
        'conversation_history': 'Conversation History',
        'demo_instructions': 'Demo Instructions',
        'how_to_test': 'How to Test the Enhanced Interface',
        'input_methods': 'Input Methods',
        'output_methods': 'Output Methods',
        'start_demo': 'Start Demo',
        'demo_started': 'Demo started! Test the input methods.',
        'demo_ended': 'Demo ended.',
        'voice_error': 'Voice recognition error',
        'text_copied': 'Text copied!',
        'recommendation_used': 'Recommendation used!',
        'enter_valid_message': 'Enter a valid customer message'
        , 'enhanced_demo': 'Enhanced Demo'
        , 'enhanced_live_title': 'Enhanced Live Assistance'
        , 'enhanced_live_subtitle': 'Demonstration of AI input and output methods'
        , 'recommended_badge': 'RECOMMENDED'
        , 'hybrid_badge': 'HYBRID'
        , 'future_badge': 'FUTURE'
        , 'method1_title': 'Method 1: Quick Text Input'
        , 'quick_responses_title': 'Quick Responses (One Click)'
        , 'method2_title': 'Method 2: Voice to Text'
        , 'voice_prompt_message': 'Click the button and speak what the customer said'
        , 'method3_title': 'Method 3: Automatic Audio Monitoring'
        , 'future_feature_title': 'Future Functionality:'
        , 'future_feature_description': 'The AI will “listen” to the conversation automatically and provide real‑time suggestions without manual input.'
        , 'monitoring_auto_development': 'Automatic Monitoring (In Development)'
        , 'demo_placeholder': 'Use the input methods above to see the AI recommendations in action!'
        , 'demo_step1': 'Type a customer message in the text field'
        , 'demo_step2': 'Click on the quick response buttons'
        , 'demo_step3': 'Use voice by clicking on "Click and Speak"'
        , 'demo_step4': 'Press Enter or click "Analyze"'
        , 'demo_output1': 'Visual recommendations appear on the right panel'
        , 'demo_output2': 'Colors indicate priority (red = urgent)'
        , 'demo_output3': 'Action buttons to use suggestions'
        , 'demo_output4': 'Audio alerts for important notices'
    },
    'pt': {
        'app_title': 'SCM Analytics AI Companion',
        'app_subtitle': 'Assistente Inteligente para Cobrança',
        'dashboard': 'Painel',
        'live_call': 'Chamada ao Vivo',
        'performance': 'Performance',
        'training': 'Treinamento',
        'settings': 'Configurações',
        'welcome_message': 'Bem-vindo ao seu AI Companion',
        'daily_goals': 'Metas Diárias',
        'calls_made': 'Chamadas Feitas',
        'contacts_reached': 'Contatos Alcançados',
        'payments_collected': 'Pagamentos Coletados',
        'collection_amount': 'Valor Coletado',
        'ai_suggestions': 'Sugestões do AI',
        'customer_insights': 'Insights do Cliente',
        'compliance_alerts': 'Alertas de Compliance',
        'start_call': 'Iniciar Chamada',
        'end_call': 'Encerrar Chamada',
        'customer_said': 'O que o cliente disse?',
        'quick_responses': 'Respostas Rápidas',
        'cant_pay': 'Não pode pagar',
        'wants_discount': 'Quer desconto',
        'angry': 'Está irritado',
        'interested': 'Interessado',
        'needs_time': 'Precisa de tempo',
        'disputes_debt': 'Contesta dívida',
        'ai_recommendations': 'Recomendações do AI',
        'compliance': 'COMPLIANCE',
        'urgent': 'URGENTE',
        'suggestion': 'SUGESTÃO',
        'offer': 'OFERTA',
        'insight': 'INSIGHT',
        'success_probability': 'Probabilidade de Sucesso',
        'audio_controls': 'Controles de Áudio',
        'audio_alerts': 'Alertas Sonoros',
        'text_to_speech': 'Texto para Fala',
        'volume': 'Volume',
        'use': 'Usar',
        'modify': 'Modificar',
        'copy': 'Copiar',
        'analyze': 'Analisar',
        'click_and_speak': 'Clique e Fale',
        'listening': 'Ouvindo...',
        'speak_now': 'Fale agora...',
        'voice_not_supported': 'Reconhecimento de voz não suportado neste navegador',
        'type_customer_message': 'Digite ou use os botões abaixo...',
        'conversation_history': 'Histórico da Conversa',
        'demo_instructions': 'Instruções da Demo',
        'how_to_test': 'Como Testar a Interface Aprimorada',
        'input_methods': 'Métodos de Entrada',
        'output_methods': 'Métodos de Saída',
        'start_demo': 'Iniciar Demo',
        'demo_started': 'Demo iniciada! Teste os métodos de entrada.',
        'demo_ended': 'Demo encerrada.',
        'voice_error': 'Erro no reconhecimento de voz',
        'text_copied': 'Texto copiado!',
        'recommendation_used': 'Recomendação utilizada!',
        'enter_valid_message': 'Digite uma mensagem válida do cliente'
        , 'enhanced_demo': 'Demo Aprimorada'
        , 'enhanced_live_title': 'Assistência ao Vivo - Versão Aprimorada'
        , 'enhanced_live_subtitle': 'Demonstração dos métodos de entrada e saída do AI'
        , 'recommended_badge': 'RECOMENDADO'
        , 'hybrid_badge': 'HÍBRIDO'
        , 'future_badge': 'FUTURO'
        , 'method1_title': 'Método 1: Entrada Rápida de Texto'
        , 'quick_responses_title': 'Respostas Rápidas (Um Clique)'
        , 'method2_title': 'Método 2: Voz para Texto'
        , 'voice_prompt_message': 'Clique no botão e fale o que o cliente disse'
        , 'method3_title': 'Método 3: Monitoramento de Áudio Automático'
        , 'future_feature_title': 'Funcionalidade Futura:'
        , 'future_feature_description': 'O AI irá "escutar" a conversa automaticamente e fornecer sugestões em tempo real sem necessidade de entrada manual.'
        , 'monitoring_auto_development': 'Monitoramento Automático (Em Desenvolvimento)'
        , 'demo_placeholder': 'Use os métodos de entrada acima para ver as recomendações do AI em ação!'
        , 'demo_step1': 'Digite uma mensagem do cliente no campo de texto'
        , 'demo_step2': 'Clique nos botões de resposta rápida'
        , 'demo_step3': 'Use voz clicando em "Clique e Fale"'
        , 'demo_step4': 'Pressione Enter ou clique em "Analisar"'
        , 'demo_output1': 'Recomendações visuais aparecem no painel direito'
        , 'demo_output2': 'Cores indicam prioridade (vermelho = urgente)'
        , 'demo_output3': 'Botões de ação para usar sugestões'
        , 'demo_output4': 'Alertas sonoros para avisos importantes'
    },
    'es': {
        'app_title': 'SCM Analytics Compañero de IA',
        'app_subtitle': 'Asistente inteligente para cobranzas',
        'dashboard': 'Panel',
        'live_call': 'Llamada en Vivo',
        'performance': 'Rendimiento',
        'training': 'Entrenamiento',
        'settings': 'Configuraciones',
        'welcome_message': 'Bienvenido a tu Compañero de IA',
        'daily_goals': 'Metas Diarias',
        'calls_made': 'Llamadas Realizadas',
        'contacts_reached': 'Contactos Alcanzados',
        'payments_collected': 'Pagos Recibidos',
        'collection_amount': 'Monto Cobrado',
        'ai_suggestions': 'Sugerencias del IA',
        'customer_insights': 'Información del Cliente',
        'compliance_alerts': 'Alertas de Cumplimiento',
        'start_call': 'Iniciar Llamada',
        'end_call': 'Finalizar Llamada',
        'customer_said': '¿Qué dijo el cliente?',
        'quick_responses': 'Respuestas Rápidas',
        'cant_pay': 'No puede pagar',
        'wants_discount': 'Quiere descuento',
        'angry': 'Está enojado',
        'interested': 'Interesado',
        'needs_time': 'Necesita tiempo',
        'disputes_debt': 'Disputa la deuda',
        'ai_recommendations': 'Recomendaciones del IA',
        'compliance': 'CUMPLIMIENTO',
        'urgent': 'URGENTE',
        'suggestion': 'SUGERENCIA',
        'offer': 'OFERTA',
        'insight': 'INSIGHT',
        'success_probability': 'Probabilidad de Éxito',
        'audio_controls': 'Controles de Audio',
        'audio_alerts': 'Alertas de Audio',
        'text_to_speech': 'Texto a Voz',
        'volume': 'Volumen',
        'use': 'Usar',
        'modify': 'Modificar',
        'copy': 'Copiar',
        'analyze': 'Analizar',
        'click_and_speak': 'Haz clic y Habla',
        'listening': 'Escuchando...',
        'speak_now': 'Habla ahora...',
        'voice_not_supported': 'Reconocimiento de voz no soportado en este navegador',
        'type_customer_message': 'Escribe o usa los botones abajo...',
        'conversation_history': 'Historial de Conversación',
        'demo_instructions': 'Instrucciones de la Demo',
        'how_to_test': 'Cómo Probar la Interfaz Mejorada',
        'input_methods': 'Métodos de Entrada',
        'output_methods': 'Métodos de Salida',
        'start_demo': 'Iniciar Demo',
        'demo_started': '¡Demo iniciada! Prueba los métodos de entrada.',
        'demo_ended': 'Demo finalizada.',
        'voice_error': 'Error de reconocimiento de voz',
        'text_copied': '¡Texto copiado!',
        'recommendation_used': '¡Recomendación usada!',
        'enter_valid_message': 'Ingrese un mensaje válido del cliente'
        , 'enhanced_demo': 'Demo Mejorada'
        , 'enhanced_live_title': 'Asistencia en Vivo - Versión Mejorada'
        , 'enhanced_live_subtitle': 'Demostración de los métodos de entrada y salida de la IA'
        , 'recommended_badge': 'RECOMENDADO'
        , 'hybrid_badge': 'HÍBRIDO'
        , 'future_badge': 'FUTURO'
        , 'method1_title': 'Método 1: Entrada Rápida de Texto'
        , 'quick_responses_title': 'Respuestas Rápidas (Un Clic)'
        , 'method2_title': 'Método 2: Voz a Texto'
        , 'voice_prompt_message': 'Haz clic en el botón y di lo que dijo el cliente'
        , 'method3_title': 'Método 3: Monitoreo Automático de Audio'
        , 'future_feature_title': 'Funcionalidad Futura:'
        , 'future_feature_description': 'La IA “escuchará” la conversación automáticamente y proporcionará sugerencias en tiempo real sin entrada manual.'
        , 'monitoring_auto_development': 'Monitoreo Automático (En Desarrollo)'
        , 'demo_placeholder': '¡Utiliza los métodos de entrada anteriores para ver las recomendaciones de la IA en acción!'
        , 'demo_step1': 'Escribe un mensaje del cliente en el campo de texto'
        , 'demo_step2': 'Haz clic en los botones de respuesta rápida'
        , 'demo_step3': 'Usa la voz haciendo clic en "Haz clic y Habla"'
        , 'demo_step4': 'Presiona Enter o haz clic en "Analizar"'
        , 'demo_output1': 'Las recomendaciones visuales aparecen en el panel derecho'
        , 'demo_output2': 'Los colores indican prioridad (rojo = urgente)'
        , 'demo_output3': 'Botones de acción para usar las sugerencias'
        , 'demo_output4': 'Alertas de audio para avisos importantes'
    },
    'it': {
        'app_title': 'SCM Analytics Compagno IA',
        'app_subtitle': 'Assistente intelligente per le riscossioni',
        'dashboard': 'Cruscotto',
        'live_call': 'Chiamata dal vivo',
        'performance': 'Prestazioni',
        'training': 'Formazione',
        'settings': 'Impostazioni',
        'welcome_message': 'Benvenuto nel tuo Compagno IA',
        'daily_goals': 'Obiettivi Giornalieri',
        'calls_made': 'Chiamate Effettuate',
        'contacts_reached': 'Contatti Raggiunti',
        'payments_collected': 'Pagamenti Riscossi',
        'collection_amount': 'Importo Riscosso',
        'ai_suggestions': 'Suggerimenti AI',
        'customer_insights': 'Approfondimenti del Cliente',
        'compliance_alerts': 'Avvisi di Conformità',
        'start_call': 'Avvia Chiamata',
        'end_call': 'Termina Chiamata',
        'customer_said': 'Cosa ha detto il cliente?',
        'quick_responses': 'Risposte Veloci',
        'cant_pay': 'Non può pagare',
        'wants_discount': 'Vuole sconto',
        'angry': 'Arrabbiato',
        'interested': 'Interessato',
        'needs_time': 'Ha bisogno di tempo',
        'disputes_debt': 'Contesta il debito',
        'ai_recommendations': 'Raccomandazioni AI',
        'compliance': 'CONFORMITÀ',
        'urgent': 'URGENTE',
        'suggestion': 'SUGGERIMENTO',
        'offer': 'OFFERTA',
        'insight': 'INSIGHT',
        'success_probability': 'Probabilità di Successo',
        'audio_controls': 'Controlli Audio',
        'audio_alerts': 'Avvisi Audio',
        'text_to_speech': 'Sintesi Vocale',
        'volume': 'Volume',
        'use': 'Usa',
        'modify': 'Modifica',
        'copy': 'Copia',
        'analyze': 'Analizza',
        'click_and_speak': 'Fai clic e parla',
        'listening': 'Ascoltando...',
        'speak_now': 'Parla ora...',
        'voice_not_supported': 'Riconoscimento vocale non supportato in questo browser',
        'type_customer_message': 'Scrivi o usa i pulsanti sotto...',
        'conversation_history': 'Cronologia della Conversazione',
        'demo_instructions': 'Istruzioni della Demo',
        'how_to_test': 'Come Testare l’Interfaccia Migliorata',
        'input_methods': 'Metodi di Input',
        'output_methods': 'Metodi di Output',
        'start_demo': 'Avvia Demo',
        'demo_started': 'Demo avviata! Prova i metodi di input.',
        'demo_ended': 'Demo terminata.',
        'voice_error': 'Errore di riconoscimento vocale',
        'text_copied': 'Testo copiato!',
        'recommendation_used': 'Raccomandazione utilizzata!',
        'enter_valid_message': 'Inserisci un messaggio valido del cliente'
        , 'enhanced_demo': 'Demo Migliorata'
        , 'enhanced_live_title': 'Assistenza dal vivo - Versione Migliorata'
        , 'enhanced_live_subtitle': 'Dimostrazione dei metodi di input e output dell’IA'
        , 'recommended_badge': 'RACCOMANDATO'
        , 'hybrid_badge': 'IBRIDO'
        , 'future_badge': 'FUTURO'
        , 'method1_title': 'Metodo 1: Inserimento Rapido di Testo'
        , 'quick_responses_title': 'Risposte Veloci (Un Clic)'
        , 'method2_title': 'Metodo 2: Voce a Testo'
        , 'voice_prompt_message': 'Fai clic sul pulsante e dì cosa ha detto il cliente'
        , 'method3_title': 'Metodo 3: Monitoraggio Audio Automatico'
        , 'future_feature_title': 'Funzionalità Futura:'
        , 'future_feature_description': 'L’IA “ascolterà” automaticamente la conversazione e fornirà suggerimenti in tempo reale senza input manuale.'
        , 'monitoring_auto_development': 'Monitoraggio Automatico (In Sviluppo)'
        , 'demo_placeholder': 'Utilizza i metodi di input sopra per vedere le raccomandazioni dell’IA in azione!'
        , 'demo_step1': 'Digita un messaggio del cliente nel campo di testo'
        , 'demo_step2': 'Fai clic sui pulsanti di risposta rapida'
        , 'demo_step3': 'Usa la voce facendo clic su "Fai clic e parla"'
        , 'demo_step4': 'Premi Invio o fai clic su "Analizza"'
        , 'demo_output1': 'Le raccomandazioni visive appaiono nel pannello di destra'
        , 'demo_output2': 'I colori indicano la priorità (rosso = urgente)'
        , 'demo_output3': 'Pulsanti di azione per utilizzare i suggerimenti'
        , 'demo_output4': 'Avvisi audio per avvisi importanti'
    }
}

# AI Response Templates
AI_RESPONSES = {
    'en': {
        'cant_pay': {
            'compliance': "Don't mention legal action. Focus on payment solutions.",
            'suggestion': "I understand your situation. Let's find a solution that works for you. What amount could you pay monthly?",
            'offer': "Offer 6-month installments or 30% discount for immediate payment",
            'insight': "Customer in financial hardship. High probability of accepting installments (75%)",
            'probability': 75
        },
        'wants_discount': {
            'suggestion': "I can check what options we have available. For immediate payment, we can offer special conditions.",
            'offer': "Authorized discount up to 40% for immediate payment or 25% for payment in up to 3 installments",
            'insight': "Customer interested in negotiating. High probability of closing (85%)",
            'probability': 85
        },
        'angry': {
            'compliance': "Customer is angry. Maintain calm and empathetic tone. Don't argue.",
            'urgent': "Use mirroring technique: 'I understand you're frustrated...'",
            'suggestion': "I apologize for the inconvenience. I'm here to help resolve this situation in the best possible way.",
            'insight': "Customer in altered emotional state. Prioritize calming before negotiating (60%)",
            'probability': 60
        },
        'interested': {
            'suggestion': "Great! Let's work together to resolve this. What would be the best payment method for you?",
            'offer': "Receptive customer - can offer standard or better conditions",
            'insight': "Collaborative customer. Excellent probability of closing (90%)",
            'probability': 90
        },
        'needs_time': {
            'suggestion': "I understand. How much time would you need? We can schedule a callback or see installment options.",
            'offer': "Offer callback in 7-15 days or installments with smaller down payment",
            'insight': "Customer needs to organize finances. Medium probability with follow-up (70%)",
            'probability': 70
        },
        'disputes_debt': {
            'compliance': "ATTENTION: Customer disputes debt. Verify documentation before proceeding.",
            'urgent': "Request data for verification: CPF, address, recent purchases",
            'suggestion': "I'll verify this information. Can you confirm your CPF and address so I can check here?",
            'insight': "Debt dispute. Verification needed before negotiating (40%)",
            'probability': 40
        }
    },
    'pt': {
        'cant_pay': {
            'compliance': "Não mencione ação legal. Foque em soluções de pagamento.",
            'suggestion': "Entendo sua situação. Vamos encontrar uma solução que funcione para você. Que valor você conseguiria pagar mensalmente?",
            'offer': "Ofereça parcelamento em 6x ou desconto de 30% para pagamento à vista",
            'insight': "Cliente em dificuldade financeira. Alta probabilidade de aceitar parcelamento (75%)",
            'probability': 75
        },
        'wants_discount': {
            'suggestion': "Posso verificar que opções temos disponíveis. Para pagamento à vista, conseguimos oferecer condições especiais.",
            'offer': "Autorizado desconto até 40% para pagamento à vista ou 25% para pagamento em até 3x",
            'insight': "Cliente interessado em negociar. Probabilidade alta de fechamento (85%)",
            'probability': 85
        },
        'angry': {
            'compliance': "Cliente irritado. Mantenha tom calmo e empático. Não discuta.",
            'urgent': "Use técnica de espelhamento: 'Entendo que você está frustrado...'",
            'suggestion': "Peço desculpas pelo transtorno. Estou aqui para ajudar a resolver essa situação da melhor forma possível.",
            'insight': "Cliente em estado emocional alterado. Priorize acalmar antes de negociar (60%)",
            'probability': 60
        },
        'interested': {
            'suggestion': "Que bom! Vamos trabalhar juntos para resolver isso. Qual seria a melhor forma de pagamento para você?",
            'offer': "Cliente receptivo - pode oferecer condições padrão ou melhores",
            'insight': "Cliente colaborativo. Excelente probabilidade de fechamento (90%)",
            'probability': 90
        },
        'needs_time': {
            'suggestion': "Compreendo. Quanto tempo você precisaria? Podemos agendar um retorno ou ver opções de parcelamento.",
            'offer': "Ofereça callback em 7-15 dias ou parcelamento com entrada menor",
            'insight': "Cliente precisa organizar finanças. Probabilidade média com follow-up (70%)",
            'probability': 70
        },
        'disputes_debt': {
            'compliance': "ATENÇÃO: Cliente contesta dívida. Verifique documentação antes de prosseguir.",
            'urgent': "Solicite dados para verificação: CPF, endereço, últimas compras",
            'suggestion': "Vou verificar essas informações. Pode me confirmar seu CPF e endereço para eu consultar aqui?",
            'insight': "Contestação de dívida. Necessária verificação antes de negociar (40%)",
            'probability': 40
        }
    },
    'es': {
        'cant_pay': {
            'compliance': "No mencione acciones legales. Concéntrese en soluciones de pago.",
            'suggestion': "Entiendo su situación. Vamos a encontrar una solución que funcione para usted. ¿Qué cantidad podría pagar mensualmente?",
            'offer': "Ofrecer 6 cuotas o un descuento del 30% por pago inmediato",
            'insight': "Cliente en dificultades financieras. Alta probabilidad de aceptar el pago a plazos (75%)",
            'probability': 75
        },
        'wants_discount': {
            'suggestion': "Puedo verificar qué opciones tenemos disponibles. Para pago inmediato, podemos ofrecer condiciones especiales.",
            'offer': "Descuento autorizado de hasta un 40% por pago inmediato o 25% para pago en hasta 3 cuotas",
            'insight': "Cliente interesado en negociar. Alta probabilidad de cerrar (85%)",
            'probability': 85
        },
        'angry': {
            'compliance': "Cliente enojado. Mantenga un tono calmado y empático. No discuta.",
            'urgent': "Use la técnica de reflejo: 'Entiendo que está frustrado...'",
            'suggestion': "Lamento las molestias. Estoy aquí para ayudar a resolver esta situación de la mejor manera posible.",
            'insight': "Cliente en un estado emocional alterado. Priorice calmar antes de negociar (60%)",
            'probability': 60
        },
        'interested': {
            'suggestion': "¡Genial! Trabajemos juntos para resolver esto. ¿Cuál sería la mejor forma de pago para usted?",
            'offer': "Cliente receptivo; se pueden ofrecer condiciones estándar o mejores",
            'insight': "Cliente colaborativo. Excelente probabilidad de cerrar (90%)",
            'probability': 90
        },
        'needs_time': {
            'suggestion': "Lo entiendo. ¿Cuánto tiempo necesitaría? Podemos programar una devolución de llamada o ver opciones de cuotas.",
            'offer': "Ofrecer devolución de llamada en 7-15 días o cuotas con un pago inicial menor",
            'insight': "Cliente necesita organizar sus finanzas. Probabilidad media con seguimiento (70%)",
            'probability': 70
        },
        'disputes_debt': {
            'compliance': "ATENCIÓN: El cliente disputa la deuda. Verifique la documentación antes de continuar.",
            'urgent': "Solicite datos para verificación: identificación, dirección, compras recientes",
            'suggestion': "Voy a verificar esta información. ¿Puede confirmar su identificación y dirección para que lo revise aquí?",
            'insight': "Disputa de la deuda. Se necesita verificación antes de negociar (40%)",
            'probability': 40
        }
    },
    'it': {
        'cant_pay': {
            'compliance': "Non menzionare azioni legali. Concentrati sulle soluzioni di pagamento.",
            'suggestion': "Capisco la sua situazione. Troviamo una soluzione che funzioni per lei. Quale importo potrebbe pagare ogni mese?",
            'offer': "Offrire 6 rate o uno sconto del 30% per il pagamento immediato",
            'insight': "Cliente in difficoltà finanziarie. Alta probabilità di accettare rate (75%)",
            'probability': 75
        },
        'wants_discount': {
            'suggestion': "Posso verificare quali opzioni abbiamo disponibili. Per il pagamento immediato, possiamo offrire condizioni speciali.",
            'offer': "Sconto autorizzato fino al 40% per il pagamento immediato o 25% per pagamento in massimo 3 rate",
            'insight': "Cliente interessato a negoziare. Alta probabilità di concludere (85%)",
            'probability': 85
        },
        'angry': {
            'compliance': "Cliente arrabbiato. Mantieni un tono calmo ed empatico. Non discutere.",
            'urgent': "Usa la tecnica del rispecchiamento: 'Capisco che sei frustrato...'",
            'suggestion': "Mi scuso per l'inconveniente. Sono qui per aiutare a risolvere questa situazione nel miglior modo possibile.",
            'insight': "Cliente in stato emotivo alterato. Priorità calmare prima di negoziare (60%)",
            'probability': 60
        },
        'interested': {
            'suggestion': "Ottimo! Lavoriamo insieme per risolvere. Qual è il metodo di pagamento migliore per lei?",
            'offer': "Cliente ricettivo: si possono offrire condizioni standard o migliori",
            'insight': "Cliente collaborativo. Eccellente probabilità di concludere (90%)",
            'probability': 90
        },
        'needs_time': {
            'suggestion': "Capisco. Di quanto tempo avrebbe bisogno? Possiamo programmare una richiamata o vedere opzioni rateali.",
            'offer': "Offrire richiamata tra 7-15 giorni o rate con anticipo minore",
            'insight': "Cliente deve organizzare le proprie finanze. Probabilità media con follow-up (70%)",
            'probability': 70
        },
        'disputes_debt': {
            'compliance': "ATTENZIONE: Il cliente contesta il debito. Verificare la documentazione prima di procedere.",
            'urgent': "Richiedi dati per la verifica: codice fiscale, indirizzo, acquisti recenti",
            'suggestion': "Verificherò queste informazioni. Può confermare il suo codice fiscale e indirizzo in modo che possa controllare?",
            'insight': "Contestazione del debito. È necessaria la verifica prima di negoziare (40%)",
            'probability': 40
        }
    }
}

def get_language():
    """
    Determine the currently selected language.

    The language code is stored in the session under the ``language`` key.
    If no language has been selected yet the application defaults to
    English (``en``).  This avoids surprising users with Portuguese
    content on first load now that multiple languages are supported.
    """
    return session.get('language', 'en')

def get_translation(key):
    """Get translation for current language"""
    lang = get_language()
    return TRANSLATIONS.get(lang, {}).get(key, key)

@app.route('/')
def index():
    return render_template('dashboard.html', 
                         lang=get_language(),
                         translations=TRANSLATIONS[get_language()],
                         languages=LANGUAGES)

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', 
                         lang=get_language(),
                         translations=TRANSLATIONS[get_language()],
                         languages=LANGUAGES)

@app.route('/live-call')
def live_call():
    return render_template('live_call.html', 
                         lang=get_language(),
                         translations=TRANSLATIONS[get_language()],
                         languages=LANGUAGES)

@app.route('/live-call-enhanced')
def live_call_enhanced():
    return render_template('live_call_enhanced.html', 
                         lang=get_language(),
                         translations=TRANSLATIONS[get_language()],
                         languages=LANGUAGES)

@app.route('/performance')
def performance():
    return render_template('performance.html', 
                         lang=get_language(),
                         translations=TRANSLATIONS[get_language()],
                         languages=LANGUAGES)

@app.route('/training')
def training():
    return render_template('training.html', 
                         lang=get_language(),
                         translations=TRANSLATIONS[get_language()],
                         languages=LANGUAGES)

@app.route('/settings')
def settings():
    return render_template('settings.html', 
                         lang=get_language(),
                         translations=TRANSLATIONS[get_language()],
                         languages=LANGUAGES)

@app.route('/set-language/<language>')
def set_language(language):
    if language in LANGUAGES:
        session['language'] = language
    return jsonify({'status': 'success', 'language': language})

@app.route('/api/ai-response', methods=['POST'])
def ai_response():
    data = request.get_json()
    message = data.get('message', '').lower()
    lang = get_language()
    
    # Determine response type based on message content
    response_type = 'default'
    
    if any(phrase in message for phrase in ['não tenho dinheiro', 'cant pay', 'no money']):
        response_type = 'cant_pay'
    elif any(phrase in message for phrase in ['desconto', 'discount']):
        response_type = 'wants_discount'
    elif any(phrase in message for phrase in ['irritado', 'angry', 'mad']):
        response_type = 'angry'
    elif any(phrase in message for phrase in ['interessado', 'interested']):
        response_type = 'interested'
    elif any(phrase in message for phrase in ['tempo', 'time']):
        response_type = 'needs_time'
    elif any(phrase in message for phrase in ['não devo', 'dispute', 'contest']):
        response_type = 'disputes_debt'
    
    # Get response template
    if response_type in AI_RESPONSES[lang]:
        response = AI_RESPONSES[lang][response_type]
    else:
        # Default response
        if lang == 'pt':
            response = {
                'suggestion': 'Entendo. Pode me explicar melhor sua situação para que eu possa ajudar da melhor forma?',
                'insight': 'Situação indefinida. Colete mais informações antes de fazer ofertas (50%)',
                'probability': 50
            }
        else:
            response = {
                'suggestion': 'I understand. Can you explain your situation better so I can help in the best way?',
                'insight': 'Undefined situation. Collect more information before making offers (50%)',
                'probability': 50
            }
    
    return jsonify({
        'status': 'success',
        'response': response,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/dashboard-data')
def dashboard_data():
    # Mock data for demonstration
    return jsonify({
        'daily_stats': {
            'calls_made': 19,
            'contacts_reached': 12,
            'payments_collected': 4,
            'collection_amount': 7500,
            'daily_goal_calls': 30,
            'daily_goal_collections': 10,
            'daily_goal_amount': 10000
        },
        'compliance_score': 95,
        'success_rate': 21.1,
        'avg_call_duration': 8.5,
        'recent_activities': [
            {
                'time': '14:30',
                'type': 'payment',
                'description': 'Payment collected - $ 1,200',
                'status': 'success'
            },
            {
                'time': '14:15',
                'type': 'call',
                'description': 'Call completed - Customer interested',
                'status': 'success'
            },
            {
                'time': '14:00',
                'type': 'call',
                'description': 'Call completed - No contact',
                'status': 'warning'
            }
        ]
    })

@app.route('/api/customer-lookup', methods=['POST'])
def customer_lookup():
    data = request.get_json()
    cpf = data.get('cpf', '')
    name = data.get('name', '')
    
    # Mock customer data
    return jsonify({
        'status': 'success',
        'customer': {
            'name': 'João Silva Santos',
            'cpf': '123.456.789-00',
            'phone': '(11) 99999-9999',
            'email': 'joao.silva@email.com',
            'debt_amount': 2500.00,
            'days_overdue': 45,
            'payment_history': 'Good',
            'risk_score': 'Medium',
            'last_contact': '2024-01-10',
            'preferred_contact': 'Phone',
            'notes': 'Customer mentioned financial difficulties in last call'
        }
    })

@app.route('/api/payment-calculation', methods=['POST'])
def payment_calculation():
    data = request.get_json()
    debt_value = float(data.get('debt_value', 0))
    installments = int(data.get('installments', 1))
    discount = float(data.get('discount', 0))
    interest_rate = float(data.get('interest_rate', 0))
    
    # Calculate payment
    discounted_amount = debt_value * (1 - discount / 100)
    
    if installments == 1:
        installment_value = discounted_amount
    else:
        monthly_rate = interest_rate / 100
        if monthly_rate > 0:
            installment_value = discounted_amount * (monthly_rate * (1 + monthly_rate) ** installments) / ((1 + monthly_rate) ** installments - 1)
        else:
            installment_value = discounted_amount / installments
    
    total_amount = installment_value * installments
    
    return jsonify({
        'status': 'success',
        'calculation': {
            'original_amount': debt_value,
            'discount_amount': debt_value - discounted_amount,
            'discounted_amount': discounted_amount,
            'installment_value': installment_value,
            'total_amount': total_amount,
            'installments': installments
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

