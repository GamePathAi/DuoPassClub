// 🔧 EMAIL SERVICE CORRIGIDO - TEMPLATES ESPECÍFICOS
// Corrigindo mapeamento de campos para resolver {{business_name}} e {{contact_name}}

import emailjs from '@emailjs/browser';

// ========================================
// 🔧 CONFIGURAÇÃO COM TEMPLATES ESPECÍFICOS
// ========================================

const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_nj1x65i',
  templateIds: {
    // Template para admin com todos os dados
    admin: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN || 'template_admin_complete',
    // Template para parceiro com dados básicos
    partner: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PARTNER || 'template_partner_basic',
    // Template para contato admin
    contactAdmin: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN || 'template_r3t7pti',
    // Template para confirmação de contato
    contactConfirmation: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION || 'template_r3t7pti',
    // Fallback universal
    universal: 'template_r3t7pti'
  },
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'jwnAl9bi3b1X98hdq'
};

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
// 📧 FUNÇÃO PRINCIPAL CORRIGIDA
// ========================================

export async function sendPartnerRegistrationEmails(partnerData) {
  console.log('📧 Enviando emails de parceiro - TEMPLATES ESPECÍFICOS');
  
  try {
    initializeEmailJS();
    
    // 1. EMAIL PARA ADMIN - TODOS OS DADOS MAPEADOS
    const adminParams = {
      // Campos básicos obrigatórios
      to_email: 'silviabonafe@duopassclub.ch',
      contact_name: sanitizeString(partnerData.contactName),
      business_name: sanitizeString(partnerData.businessName),
      contact_email: sanitizeString(partnerData.email),
      
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
    
    console.log('📤 Enviando para admin com todos os dados:', adminParams);
    
    const adminResponse = await sendEmailWithFallback(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.admin,
      adminParams,
      EMAILJS_CONFIG.templateIds.universal
    );
    
    console.log('✅ Email admin enviado:', adminResponse.status);
    
    // 2. EMAIL DE CONFIRMAÇÃO PARA PARCEIRO - APENAS DADOS BÁSICOS
    const partnerParams = {
      // Campos básicos obrigatórios para template do parceiro
      to_email: sanitizeString(partnerData.email),
      contact_name: sanitizeString(partnerData.contactName),
      business_name: sanitizeString(partnerData.businessName),
      
      // Metadados mínimos
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch',
      
      // Campos de compatibilidade
      contact_business: sanitizeString(partnerData.businessName),
      contact_type: 'Confirmação de Cadastro',
      contact_description: `Confirmação de cadastro para ${partnerData.businessName}`
    };
    
    console.log('📤 Enviando confirmação para parceiro (dados básicos):', partnerParams);
    
    const partnerResponse = await sendEmailWithFallback(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partner,
      partnerParams,
      EMAILJS_CONFIG.templateIds.universal
    );
    
    console.log('✅ Email parceiro enviado:', partnerResponse.status);
    
    return {
      success: true,
      adminResponse,
      partnerResponse,
      errors: []
    };
    
  } catch (error) {
    console.error('❌ Erro ao enviar emails de parceiro:', error);
    
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
  console.log('📧 Enviando emails de contato - VERSÃO UNIFICADA');
  
  try {
    initializeEmailJS();
    
    // Email para admin
    const adminParams = {
      to_email: 'silviabonafe@duopassclub.ch',
      contact_name: sanitizeString(contactData.name),
      contact_email: sanitizeString(contactData.email),
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
// 🔧 FUNÇÃO DE ENVIO COM FALLBACK
// ========================================

async function sendEmailWithFallback(serviceId, templateId, params, fallbackTemplateId = null) {
  try {
    // Tentar com template específico primeiro
    return await emailjs.send(serviceId, templateId, params);
  } catch (error) {
    console.warn(`⚠️ Falha no template ${templateId}, tentando fallback...`, error.message);
    
    if (fallbackTemplateId) {
      try {
        return await emailjs.send(serviceId, fallbackTemplateId, params);
      } catch (fallbackError) {
        console.error(`❌ Falha também no fallback ${fallbackTemplateId}:`, fallbackError.message);
        throw fallbackError;
      }
    } else {
      throw error;
    }
  }
}

// ========================================
// 🔍 FUNÇÃO DE DEBUG DOS CAMPOS
// ========================================

export function debugEmailFields(partnerData) {
  console.log('🔍 DEBUG: Verificando mapeamento de campos...');
  
  const mappedFields = {
    // Campos básicos
    contact_name: partnerData.contactName,
    business_name: partnerData.businessName,
    contact_email: partnerData.email,
    
    // Dados do negócio
    business_type: partnerData.businessType,
    phone: partnerData.phone,
    
    // Endereço
    address_street: partnerData.address?.street || partnerData.address,
    address_city: partnerData.city || partnerData.address?.city,
    address_postal: partnerData.postalCode || partnerData.address?.postalCode,
    
    // História e missão
    founder_story: partnerData.founderStory,
    cultural_mission: partnerData.culturalMission,
    
    // Experiência
    experience_title: partnerData.experienceTitle || partnerData.proposedExperience?.title,
    experience_description: partnerData.experienceDescription || partnerData.proposedExperience?.description,
    normal_price: partnerData.normalPrice || partnerData.proposedExperience?.normalPrice,
    duo_value: partnerData.duoValue || partnerData.proposedExperience?.duoValue
  };
  
  console.table(mappedFields);
  
  // Verificar campos vazios
  const emptyFields = Object.entries(mappedFields)
    .filter(([key, value]) => !value || value === 'N/A')
    .map(([key]) => key);
  
  if (emptyFields.length > 0) {
    console.warn('⚠️ Campos vazios detectados:', emptyFields);
  }
  
  return mappedFields;
}

// ========================================
// 🔍 FUNÇÃO DE TESTE COMPLETA
// ========================================

export async function testEmailConfiguration() {
  console.log('🔍 Testando configuração com dados de exemplo...');
  
  const testPartnerData = {
    businessName: 'Café Teste',
    contactName: 'João Silva',
    email: 'joao@cafeteste.com',
    phone: '+41 79 123 4567',
    businessType: 'Café',
    address: {
      street: 'Rua Teste, 123',
      city: 'Bern',
      postalCode: '3000',
      country: 'Switzerland'
    },
    founderStory: 'História de teste do fundador.',
    culturalMission: 'Missão cultural de teste.',
    proposedExperience: {
      title: 'Experiência Teste',
      description: 'Descrição da experiência de teste.',
      normalPrice: 50,
      duoValue: '2 cafés especiais'
    }
  };
  
  // Debug dos campos primeiro
  debugEmailFields(testPartnerData);
  
  try {
    const result = await sendPartnerRegistrationEmails(testPartnerData);
    console.log('✅ Teste concluído:', result);
    return result;
  } catch (error) {
    console.error('❌ Teste falhou:', error);
    return { success: false, error };
  }
}

// ========================================
// 📋 GUIA DE USO E CONFIGURAÇÃO
// ========================================

/*
🎯 PROBLEMA RESOLVIDO:
- {{business_name}} e {{contact_name}} agora são substituídos pelos valores reais
- Mapeamento completo de todos os campos do formulário
- Templates específicos para admin e parceiro
- Sistema de fallback para garantir funcionamento

📧 TEMPLATES NECESSÁRIOS NO EMAILJS:

1. template_admin_complete (para admin):
   Campos disponíveis:
   - {{contact_name}} - Nome do contato
   - {{business_name}} - Nome do negócio
   - {{contact_email}} - Email do contato
   - {{business_type}} - Tipo de negócio
   - {{phone}} - Telefone
   - {{address_street}} - Endereço
   - {{address_city}} - Cidade
   - {{address_postal}} - CEP
   - {{address_country}} - País
   - {{founder_story}} - História do fundador
   - {{cultural_mission}} - Missão cultural
   - {{experience_title}} - Título da experiência
   - {{experience_description}} - Descrição da experiência
   - {{normal_price}} - Preço normal
   - {{duo_value}} - Valor DUO
   - {{contact_date}} - Data do contato

2. template_partner_basic (para parceiro):
   Campos disponíveis:
   - {{contact_name}} - Nome do contato
   - {{business_name}} - Nome do negócio
   - {{contact_date}} - Data do contato

3. template_r3t7pti (fallback universal):
   Mantido como backup

🔧 COMO USAR:

1. Importar as funções:
   import { sendPartnerRegistrationEmails, debugEmailFields } from './services/emailService';

2. Para debug (verificar mapeamento):
   debugEmailFields(partnerData);

3. Para enviar emails:
   const result = await sendPartnerRegistrationEmails(partnerData);

4. Para testar:
   import { testEmailConfiguration } from './services/emailService';
   await testEmailConfiguration();

📝 FORMATO DOS DADOS:
   const partnerData = {
     // Campos básicos obrigatórios
     businessName: 'Nome do Negócio',
     contactName: 'Nome do Contato', 
     email: 'email@exemplo.com',
     phone: '+41 79 123 4567',
     businessType: 'Tipo do Negócio',
     
     // Endereço (flexível)
     address: 'Endereço completo', // OU
     city: 'Cidade',
     postalCode: 'CEP',
     // OU
     address: {
       street: 'Rua, 123',
       city: 'Cidade',
       postalCode: 'CEP',
       country: 'País'
     },
     
     // História e missão
     founderStory: 'História do fundador...',
     culturalMission: 'Missão cultural...',
     
     // Experiência (flexível)
     experienceTitle: 'Título',
     experienceDescription: 'Descrição',
     normalPrice: 100,
     duoValue: 'Valor DUO',
     // OU
     proposedExperience: {
       title: 'Título',
       description: 'Descrição',
       normalPrice: 100,
       duoValue: 'Valor DUO'
     }
   };

✅ CORREÇÕES IMPLEMENTADAS:
- Mapeamento completo de todos os campos do formulário
- Templates específicos com fallback automático
- Função de debug para verificar campos
- Sanitização e validação de dados
- Logs detalhados para troubleshooting
- Sistema robusto com tratamento de erros

🚨 IMPORTANTE:
- Crie os templates template_admin_complete e template_partner_basic no EmailJS
- Use os campos exatos listados acima nos templates
- O sistema usará template_r3t7pti como fallback se os específicos falharem
*/

export default {
  sendPartnerRegistrationEmails,
  sendContactEmails,
  testEmailConfiguration
};