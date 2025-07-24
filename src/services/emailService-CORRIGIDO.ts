// 🔧 EMAIL SERVICE DEFINITIVAMENTE CORRIGIDO
// Campos exatos do template_d63ebza conforme o painel EmailJS

import emailjs from '@emailjs/browser';

// ========================================
// 🔧 CONFIGURAÇÃO FINAL CORRIGIDA
// ========================================

const EMAILJS_CONFIG = {
  serviceId: 'service_nj1x65i',
  templateIds: {
    adminNotification: 'template_d63ebza',    // Para admin - campos específicos
    partnerConfirmation: 'template_r3t7pti'   // Para confirmação - campos genéricos
  },
  publicKey: 'jwnAl9bi3b1X98hdq'
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
  console.log('📧 Enviando emails de parceiro - VERSÃO FINAL CORRIGIDA');
  
  try {
    // Garantir inicialização
    initializeEmailJS();
    
    // 1. EMAIL PARA ADMIN - template_d63ebza com campos EXATOS
    const adminParams = {
      // ✅ Campos que correspondem EXATAMENTE ao template:
      business_name: sanitizeString(partnerData.businessName),
      contact_name: sanitizeString(partnerData.contactName),
      email: sanitizeString(partnerData.email),
      phone: sanitizeString(partnerData.phone),
      business_type: sanitizeString(partnerData.businessType),
      
      // Campos de endereço
      address_street: sanitizeString(partnerData.address?.street),
      address_city: sanitizeString(partnerData.address?.city),
      address_postal_code: sanitizeString(partnerData.address?.postalCode),
      address_country: sanitizeString(partnerData.address?.country),
      
      // História e missão
      founder_story: sanitizeString(partnerData.founderStory),
      cultural_mission: sanitizeString(partnerData.culturalMission),
      
      // Experiência proposta
      experience_title: sanitizeString(partnerData.proposedExperience?.title),
      experience_description: sanitizeString(partnerData.proposedExperience?.description),
      experience_normal_price: `CHF ${partnerData.proposedExperience?.normalPrice || 0}`,
      experience_duo_value: sanitizeString(partnerData.proposedExperience?.duoValue)
    };
    
    console.log('📤 Enviando para admin com template_d63ebza:', adminParams);
    
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.adminNotification,
      adminParams
    );
    
    console.log('✅ Email admin enviado com sucesso:', adminResponse.status);
    
    // 2. EMAIL DE CONFIRMAÇÃO PARA PARCEIRO - template_r3t7pti
    const partnerParams = {
      to_email: sanitizeString(partnerData.email),
      contact_name: sanitizeString(partnerData.contactName),
      contact_business: sanitizeString(partnerData.businessName),
      contact_type: sanitizeString(partnerData.businessType),
      contact_description: `Obrigado por se registrar como parceiro do DUO PASS Club! Recebemos os dados do ${partnerData.businessName} e entraremos em contato em breve.`,
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    console.log('📤 Enviando confirmação para parceiro com template_r3t7pti:', partnerParams);
    
    const partnerResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partnerConfirmation,
      partnerParams
    );
    
    console.log('✅ Email parceiro enviado com sucesso:', partnerResponse.status);
    
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
  console.log('📧 Enviando emails de contato - VERSÃO CORRIGIDA');
  
  try {
    initializeEmailJS();
    
    // Para contatos simples, usar apenas template_r3t7pti que funciona
    const adminParams = {
      to_email: 'silviabonafe@duopassclub.ch',
      contact_name: sanitizeString(contactData.name),
      contact_email: sanitizeString(contactData.email),
      contact_business: sanitizeString(contactData.business),
      contact_type: sanitizeString(contactData.type),
      contact_description: sanitizeString(contactData.description),
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partnerConfirmation, // Usar template_r3t7pti
      adminParams
    );
    
    console.log('✅ Email admin enviado:', adminResponse.status);
    
    // Email de confirmação para cliente
    const confirmationParams = {
      to_email: sanitizeString(contactData.email),
      contact_name: sanitizeString(contactData.name),
      contact_business: sanitizeString(contactData.business),
      contact_type: sanitizeString(contactData.type),
      contact_description: 'Obrigado pelo seu interesse! Recebemos seu contato e responderemos em breve.',
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    const confirmationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partnerConfirmation,
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
// 🔍 FUNÇÃO DE TESTE
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
// 📋 COMO USAR ESTE ARQUIVO CORRIGIDO
// ========================================

/*
1. Substitua a importação no seu código:
   
   // No arquivo onde você chama as funções de email:
   import { sendPartnerRegistrationEmails } from './services/emailService-FINAL-CORRIGIDO';

2. Para testar:
   import { testEmailConfiguration } from './services/emailService-FINAL-CORRIGIDO';
   await testEmailConfiguration();

3. O formato dos dados que você passa deve ser:
   const partnerData = {
     businessName: 'Nome do Negócio',
     contactName: 'Nome do Contato',
     email: 'email@exemplo.com',
     phone: 'telefone',
     businessType: 'tipo',
     address: {
       street: 'rua',
       city: 'cidade', 
       postalCode: 'cep',
       country: 'país'
     },
     founderStory: 'história',
     culturalMission: 'missão',
     proposedExperience: {
       title: 'título',
       description: 'descrição',
       normalPrice: 100,
       duoValue: 'valor duo'
     }
   };

✅ CORREÇÕES IMPLEMENTADAS:
- Campos exatos do template_d63ebza para admin
- template_r3t7pti para confirmações (que já funciona)
- Sanitização completa de dados
- Logs detalhados para debugging
- Função de teste incluída
*/

export default {
  sendPartnerRegistrationEmails,
  sendContactEmails,
  testEmailConfiguration
};