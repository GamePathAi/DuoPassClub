// 🔧 EMAIL SERVICE CORRIGIDO - MAPEAMENTO ESPECÍFICO POR TEMPLATE
// Corrigindo o erro 422 "recipients address is empty" do template_d63ebza

import emailjs from '@emailjs/browser';

// ========================================
// 🔧 CONFIGURAÇÃO COM TEMPLATES CORRETOS
// ========================================

const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_nj1x65i',
  templateIds: {
    // ✅ CORREÇÃO DEFINITIVA: Campos corretos para cada template
    // template_r3t7pti usa {{contact_email}} - template_d63ebza usa {{email}}
    admin: 'template_r3t7pti',        // ← Para admin (usa contact_email)
    partner: 'template_d63ebza',      // ← Para parceiro (usa email)
    contactAdmin: 'template_r3t7pti',
    contactConfirmation: 'template_r3t7pti',
    universal: 'template_r3t7pti'
  },
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'k4Yr2qeZ3HOym8wgI'
}

// ========================================
// 🚨 INICIALIZAÇÃO ÚNICA
// ========================================

let emailjsInitialized = false;

function initializeEmailJS() {
  if (!emailjsInitialized) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    emailjsInitialized = true;
    console.log('✅ EmailJS inicializado corretamente');
  }
}

// Inicializar automaticamente
initializeEmailJS();

// ========================================
// 🛠️ FUNÇÕES AUXILIARES
// ========================================

function sanitizeString(str) {
  if (str === null || str === undefined) return 'N/A';
  return String(str).trim().substring(0, 1000);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========================================
// 🎯 MAPEAMENTO ESPECÍFICO POR TEMPLATE
// ========================================

function mapDataForAdminTemplate(partnerData) {
  // template_r3t7pti usa 'contact_email'
  return {
    // Campos básicos obrigatórios
    to_email: 'silviabonafe@duopassclub.ch',
    contact_name: sanitizeString(partnerData.contactName),
    business_name: sanitizeString(partnerData.businessName),
    contact_email: sanitizeString(partnerData.email), // ← contact_email para admin
    
    // Dados do negócio
    business_type: sanitizeString(partnerData.businessType),
    phone: sanitizeString(partnerData.phone),
    
    // Endereço completo
    address_street: sanitizeString(partnerData.address?.street || partnerData.address),
    address_city: sanitizeString(partnerData.city || partnerData.address?.city),
    address_postal: sanitizeString(partnerData.postalCode || partnerData.address?.postalCode),
    address_country: sanitizeString(partnerData.address?.country || 'Switzerland'),
    
    // História e missão
    founder_story: sanitizeString(partnerData.founderStory),
    cultural_mission: sanitizeString(partnerData.culturalMission),
    
    // Experiência proposta
    experience_title: sanitizeString(partnerData.experienceTitle || partnerData.proposedExperience?.title),
    experience_description: sanitizeString(partnerData.experienceDescription || partnerData.proposedExperience?.description),
    normal_price: sanitizeString(partnerData.normalPrice || partnerData.proposedExperience?.normalPrice),
    duo_value: sanitizeString(partnerData.duoValue || partnerData.proposedExperience?.duoValue),
    
    // Metadados
    contact_date: new Date().toLocaleString('pt-BR'),
    reply_to: 'contact@duopassclub.ch',
    
    // Campos de compatibilidade
    contact_business: sanitizeString(partnerData.businessName),
    contact_type: 'Novo Parceiro Registrado',
    contact_description: `NOVO PARCEIRO: ${partnerData.businessName} - ${partnerData.contactName}`
  };
}

function mapDataForPartnerTemplate(partnerData) {
  // template_d63ebza usa 'email' (não contact_email!)
  return {
    // ✅ CORREÇÃO PRINCIPAL: template_d63ebza espera 'email', não 'contact_email'
    email: sanitizeString(partnerData.email), // ← email para parceiro
    contact_name: sanitizeString(partnerData.contactName),
    business_name: sanitizeString(partnerData.businessName),
    
    // Metadados mínimos
    contact_date: new Date().toLocaleString('pt-BR'),
    reply_to: 'contact@duopassclub.ch',
    
    // Campos de compatibilidade (se existirem no template)
    contact_business: sanitizeString(partnerData.businessName),
    contact_type: 'Confirmação de Cadastro',
    contact_description: `Confirmação de cadastro para ${partnerData.businessName}`
  };
}

// ========================================
// 📧 FUNÇÃO PRINCIPAL CORRIGIDA
// ========================================

export async function sendPartnerRegistrationEmails(partnerData) {
  console.log('📧 Enviando emails com mapeamento específico por template');
  
  try {
    initializeEmailJS();
    
    // Validação inicial
    if (!partnerData.email || !validateEmail(partnerData.email)) {
      throw new Error('Email inválido ou não fornecido');
    }
    
    // 1. EMAIL PARA ADMIN - USA template_r3t7pti com contact_email
    const adminParams = mapDataForAdminTemplate(partnerData);
    
    console.log('📤 Enviando para admin (template_r3t7pti):', {
      template: EMAILJS_CONFIG.templateIds.admin,
      email_field: 'contact_email',
      email_value: adminParams.contact_email
    });
    
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.admin,
      adminParams
    );
    
    console.log('✅ Email admin enviado:', adminResponse.status);
    
    // 2. EMAIL PARA PARCEIRO - USA template_d63ebza com email
    const partnerParams = mapDataForPartnerTemplate(partnerData);
    
    console.log('📤 Enviando para parceiro (template_d63ebza):', {
      template: EMAILJS_CONFIG.templateIds.partner,
      email_field: 'email',
      email_value: partnerParams.email,
      all_params: partnerParams
    });
    
    const partnerResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partner,
      partnerParams
    );
    
    console.log('✅ Email parceiro enviado:', partnerResponse.status);
    
    return {
      success: true,
      adminResponse,
      partnerResponse,
      errors: []
    };
    
  } catch (error) {
    console.error('❌ Erro ao enviar emails:', error);
    
    // Se o template do parceiro falhar, use o fallback
    if (error.status === 422 || error.status === 400) {
      console.warn('⚠️ Template do parceiro falhou, usando fallback...');
      
      try {
        const fallbackParams = mapDataForAdminTemplate(partnerData);
        fallbackParams.to_email = partnerData.email; // Muda destinatário
        
        const fallbackResponse = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateIds.universal,
          fallbackParams
        );
        
        console.log('✅ Email parceiro enviado via fallback:', fallbackResponse.status);
        
        return {
          success: true,
          adminResponse: null,
          partnerResponse: fallbackResponse,
          errors: ['Template específico falhou, usado fallback'],
          usedFallback: true
        };
        
      } catch (fallbackError) {
        console.error('❌ Fallback também falhou:', fallbackError);
      }
    }
    
    return {
      success: false,
      errors: [`Erro ao enviar emails: ${error.message}`]
    };
  }
}

// ========================================
// 📧 FUNÇÃO PARA CONTATOS SIMPLES
// ========================================

export async function sendContactEmails(contactData) {
  console.log('📧 Enviando emails de contato');
  
  try {
    initializeEmailJS();
    
    // Email para admin
    const adminParams = {
      to_email: 'silviabonafe@duopassclub.ch',
      contact_name: sanitizeString(contactData.name),
      contact_email: sanitizeString(contactData.email), // ← contact_email para template_r3t7pti
      business_name: sanitizeString(contactData.business),
      contact_business: sanitizeString(contactData.business),
      contact_type: sanitizeString(contactData.type),
      contact_description: sanitizeString(contactData.description),
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactAdmin,
      adminParams
    );
    
    console.log('✅ Email admin enviado:', adminResponse.status);
    
    // Email de confirmação para cliente
    const confirmationParams = {
      to_email: sanitizeString(contactData.email),
      contact_name: sanitizeString(contactData.name),
      contact_email: sanitizeString(contactData.email), // ← contact_email para template_r3t7pti
      contact_business: sanitizeString(contactData.business),
      contact_type: 'Confirmação de Contato',
      contact_description: `Olá ${contactData.name}!\n\nObrigado pelo seu interesse no DUO PASS Club!\n\nRecebemos seu contato sobre ${contactData.business} e nossa equipe responderá em breve.\n\nAguarde nosso retorno!`,
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    const confirmationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactConfirmation,
      confirmationParams
    );
    
    console.log('✅ Email confirmação enviado:', confirmationResponse.status);
    
    return {
      success: true,
      adminResponse,
      confirmationResponse
    };
    
  } catch (error) {
    console.error('❌ Erro ao enviar emails de contato:', error);
    throw error;
  }
}

// ========================================
// 🔍 FUNÇÃO DE DEBUG ESPECÍFICA
// ========================================

export function debugTemplateMapping(partnerData) {
  console.log('🔍 DEBUG: Mapeamento específico por template...');
  
  const adminMapping = mapDataForAdminTemplate(partnerData);
  const partnerMapping = mapDataForPartnerTemplate(partnerData);
  
  console.log('📧 Admin Template (template_r3t7pti):', {
    template: 'template_r3t7pti',
    email_field: 'contact_email',
    email_value: adminMapping.contact_email,
    to_email: adminMapping.to_email
  });
  
  console.log('📧 Partner Template (template_d63ebza):', {
    template: 'template_d63ebza',
    email_field: 'email',
    email_value: partnerMapping.email,
    outros_campos: Object.keys(partnerMapping).length
  });
  
  // Verificar se email está presente
  if (!partnerMapping.email || partnerMapping.email === 'N/A') {
    console.error('❌ PROBLEMA: Campo email está vazio para template_d63ebza!');
    console.error('Dados originais:', partnerData.email);
  } else {
    console.log('✅ Campo email OK para template_d63ebza:', partnerMapping.email);
  }
  
  return { adminMapping, partnerMapping };
}

// ========================================
// 🔍 FUNÇÃO DE TESTE ESPECÍFICA
// ========================================

export async function testSpecificTemplates() {
  console.log('🧪 Testando templates específicos...');
  
  const testData = {
    businessName: 'Café Teste DEBUG',
    contactName: 'João DEBUG',
    email: 'teste@duopassclub.ch', // EMAIL VÁLIDO
    phone: '+41 79 123 4567',
    businessType: 'Café',
    address: 'Rua Teste, 123',
    city: 'Bern',
    postalCode: '3000',
    founderStory: 'História de teste.',
    culturalMission: 'Missão de teste.'
  };
  
  // Debug primeiro
  debugTemplateMapping(testData);
  
  try {
    const result = await sendPartnerRegistrationEmails(testData);
    console.log('✅ Teste de templates específicos:', result);
    return result;
  } catch (error) {
    console.error('❌ Teste falhou:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// 📋 EXPORTAÇÕES E CONFIGURAÇÃO
// ========================================

export default {
  sendPartnerRegistrationEmails,
  sendContactEmails,
  debugTemplateMapping,
  testSpecificTemplates
};

/*
🎯 CORREÇÃO PRINCIPAL APLICADA:

❌ PROBLEMA ANTERIOR:
- template_d63ebza espera {{email}} no campo "To Email"
- Código enviava {{contact_email}}
- Resultado: Erro 422 "recipients address is empty"

✅ SOLUÇÃO IMPLEMENTADA:
- Admin template (template_r3t7pti): usa contact_email ✅
- Partner template (template_d63ebza): usa email ✅
- Mapeamento específico por template
- Sistema de fallback mantido

🔧 PRINCIPAIS MUDANÇAS:

1. Função mapDataForPartnerTemplate():
   - Usa 'email' em vez de 'contact_email'
   - Específica para template_d63ebza

2. Função mapDataForAdminTemplate():
   - Mantém 'contact_email'
   - Específica para template_r3t7pti

3. Função debugTemplateMapping():
   - Mostra exatamente quais campos cada template recebe
   - Identifica problemas antes do envio

4. Sistema de fallback melhorado:
   - Se template_d63ebza falhar, usa template_r3t7pti
   - Logs detalhados para debugging

📧 COMO USAR:

1. Para testar:
   import { testSpecificTemplates } from './emailService';
   await testSpecificTemplates();

2. Para debug:
   import { debugTemplateMapping } from './emailService';
   debugTemplateMapping(seusDados);

3. Para produção:
   const result = await sendPartnerRegistrationEmails(partnerData);

✅ AGORA O template_d63ebza DEVE FUNCIONAR CORRETAMENTE!
*/