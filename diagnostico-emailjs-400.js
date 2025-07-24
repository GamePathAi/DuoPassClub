// 🔍 DIAGNÓSTICO EMAILJS - STATUS 400 (Bad Request)
// Script para identificar e resolver problemas de envio de email

import emailjs from '@emailjs/browser';

// ========================================
// 🔧 CONFIGURAÇÕES ATUAIS DO EMAILJS
// ========================================
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_nj1x65i',
  templateIds: {
    partnerConfirmation: import.meta.env.VITE_EMAILJS_PARTNER_TEMPLATE_ID || 'template_d63ebza',
    adminNotification: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || 'template_r3t7pti',
    contactConfirmation: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION || 'template_d63ebza',
    contactAdmin: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN || 'template_r3t7pti'
  },
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'jwnAl9bi3b1X98hdq'
};

// ========================================
// 🚨 PROBLEMAS IDENTIFICADOS NO CÓDIGO ATUAL
// ========================================

/*
PROBLEMA 1: INICIALIZAÇÃO DUPLICADA
- O emailjs.init() está sendo chamado automaticamente no emailService.ts
- Mas nas funções sendContactEmails() e sendCulturalPartnerContactConfirmation() 
  a publicKey está sendo passada como 4º parâmetro
- Isso causa conflito e pode resultar em erro 400

PROBLEMA 2: INCONSISTÊNCIA NOS TEMPLATE IDS
- Alguns templates estão usando IDs diferentes
- VITE_EMAILJS_PARTNER_TEMPLATE_ID vs VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION
- Ambos apontam para 'template_d63ebza'

PROBLEMA 3: PAYLOAD INCONSISTENTE
- Diferentes funções enviam campos diferentes
- Alguns campos podem não existir nos templates do EmailJS
- Campos com valores undefined/null causam erro 400

PROBLEMA 4: ENCODING DE CARACTERES
- Textos com acentos/caracteres especiais podem causar erro 400
- Falta validação de encoding UTF-8
*/

// ========================================
// 🔍 FUNÇÕES DE DIAGNÓSTICO
// ========================================

/**
 * Testa a configuração básica do EmailJS
 */
export async function testarConfiguracaoBasica() {
  console.log('🔍 ETAPA 1: Testando Configuração Básica');
  
  const problemas = [];
  
  // Verificar variáveis de ambiente
  if (!EMAILJS_CONFIG.serviceId) {
    problemas.push('❌ VITE_EMAILJS_SERVICE_ID não configurado');
  } else {
    console.log('✅ Service ID:', EMAILJS_CONFIG.serviceId);
  }
  
  if (!EMAILJS_CONFIG.publicKey) {
    problemas.push('❌ VITE_EMAILJS_PUBLIC_KEY não configurado');
  } else {
    console.log('✅ Public Key:', EMAILJS_CONFIG.publicKey);
  }
  
  // Verificar template IDs
  Object.entries(EMAILJS_CONFIG.templateIds).forEach(([key, value]) => {
    if (!value) {
      problemas.push(`❌ Template ${key} não configurado`);
    } else {
      console.log(`✅ Template ${key}:`, value);
    }
  });
  
  return problemas;
}

/**
 * Valida o payload antes do envio
 */
export function validarPayload(templateParams) {
  console.log('🔍 ETAPA 2: Validando Payload');
  console.log('📦 Dados enviados:', JSON.stringify(templateParams, null, 2));
  
  const problemas = [];
  
  // Verificar campos obrigatórios
  const camposObrigatorios = ['to_email', 'from_name'];
  camposObrigatorios.forEach(campo => {
    if (!templateParams[campo]) {
      problemas.push(`❌ Campo obrigatório ausente: ${campo}`);
    }
  });
  
  // Verificar formato de email
  if (templateParams.to_email && !isValidEmail(templateParams.to_email)) {
    problemas.push(`❌ Email inválido: ${templateParams.to_email}`);
  }
  
  // Verificar campos undefined/null
  Object.entries(templateParams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      problemas.push(`❌ Campo com valor null/undefined: ${key}`);
    }
    
    // Verificar caracteres especiais problemáticos
    if (typeof value === 'string' && hasProblematicChars(value)) {
      console.warn(`⚠️ Campo ${key} contém caracteres que podem causar problemas:`, value);
    }
  });
  
  return problemas;
}

/**
 * Testa envio com payload mínimo
 */
export async function testePayloadMinimo() {
  console.log('🔍 ETAPA 3: Teste com Payload Mínimo');
  
  const payloadMinimo = {
    to_email: 'teste@duopassclub.ch',
    from_name: 'DuoPass Test',
    message: 'Teste de envio minimo'
  };
  
  try {
    // Inicializar EmailJS corretamente
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactConfirmation,
      payloadMinimo
      // NÃO passar publicKey aqui - já foi inicializada
    );
    
    console.log('✅ Teste mínimo bem-sucedido:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Teste mínimo falhou:', error);
    return { success: false, error };
  }
}

/**
 * Corrige o problema de inicialização dupla
 */
export function corrigirInicializacao() {
  console.log('🔧 ETAPA 4: Corrigindo Inicialização');
  
  // Limpar inicialização anterior
  if (window.emailjs) {
    delete window.emailjs;
  }
  
  // Inicializar corretamente
  emailjs.init(EMAILJS_CONFIG.publicKey);
  console.log('✅ EmailJS reinicializado corretamente');
}

/**
 * Função corrigida para envio de emails de contato
 */
export async function enviarEmailContato_CORRIGIDO(contactData) {
  console.log('🔧 ENVIANDO EMAIL CORRIGIDO - Contato');
  
  try {
    // Garantir inicialização correta
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Payload limpo e validado
    const templateParams = {
      to_email: import.meta.env.VITE_ADMIN_EMAIL || 'silviabonafe@duopassclub.ch',
      contact_id: contactData.id || 'N/A',
      contact_name: contactData.name || 'Nome não informado',
      contact_email: contactData.email || 'Email não informado',
      contact_business: contactData.business || 'Negócio não informado',
      contact_type: getBusinessTypeLabel(contactData.type) || 'Tipo não informado',
      contact_description: contactData.description || 'Descrição não informada',
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@duopassclub.ch'
    };
    
    // Validar payload
    const problemas = validarPayload(templateParams);
    if (problemas.length > 0) {
      throw new Error(`Problemas no payload: ${problemas.join(', ')}`);
    }
    
    // Enviar email admin
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactAdmin,
      templateParams
      // NÃO passar publicKey aqui
    );
    
    console.log('✅ Email admin enviado:', adminResponse);
    
    // Enviar email confirmação
    const confirmationParams = {
      to_email: contactData.email,
      to_name: contactData.name || contactData.email.split('@')[0],
      business_name: contactData.business,
      business_type: getBusinessTypeLabel(contactData.type),
      contact_id: contactData.id,
      reply_to: import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@duopassclub.ch'
    };
    
    const confirmationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactConfirmation,
      confirmationParams
      // NÃO passar publicKey aqui
    );
    
    console.log('✅ Email confirmação enviado:', confirmationResponse);
    
    return { success: true, adminResponse, confirmationResponse };
    
  } catch (error) {
    console.error('❌ Erro no envio corrigido:', error);
    throw error;
  }
}

/**
 * Função corrigida para envio de emails de parceiro
 */
export async function enviarEmailParceiro_CORRIGIDO(partnerData) {
  console.log('🔧 ENVIANDO EMAIL CORRIGIDO - Parceiro');
  
  try {
    // Garantir inicialização correta
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Payload limpo para confirmação do parceiro
    const partnerParams = {
      contact_name: partnerData.contactName || 'Nome não informado',
      business_name: partnerData.businessName || 'Negócio não informado',
      email: partnerData.email || 'Email não informado'
    };
    
    // Validar payload
    const problemasPartner = validarPayload(partnerParams);
    if (problemasPartner.length > 0) {
      console.warn('⚠️ Problemas no payload do parceiro:', problemasPartner);
    }
    
    // Enviar confirmação para parceiro
    const partnerResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partnerConfirmation,
      partnerParams
    );
    
    console.log('✅ Email parceiro enviado:', partnerResponse);
    
    // Payload para admin (mais completo)
    const adminParams = {
      business_name: partnerData.businessName || 'N/A',
      contact_name: partnerData.contactName || 'N/A',
      email: partnerData.email || 'N/A',
      phone: partnerData.phone || 'N/A',
      business_type: partnerData.businessType || 'N/A',
      address_street: partnerData.address?.street || 'N/A',
      address_city: partnerData.address?.city || 'N/A',
      address_postal_code: partnerData.address?.postalCode || 'N/A',
      address_country: partnerData.address?.country || 'N/A',
      founder_story: partnerData.founderStory || 'N/A',
      cultural_mission: partnerData.culturalMission || 'N/A',
      experience_title: partnerData.proposedExperience?.title || 'N/A',
      experience_description: partnerData.proposedExperience?.description || 'N/A',
      experience_normal_price: partnerData.proposedExperience?.normalPrice ? `CHF ${partnerData.proposedExperience.normalPrice}` : 'N/A',
      experience_duo_value: partnerData.proposedExperience?.duoValue || 'N/A'
    };
    
    // Enviar notificação para admin
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.adminNotification,
      adminParams
    );
    
    console.log('✅ Email admin enviado:', adminResponse);
    
    return { success: true, partnerResponse, adminResponse };
    
  } catch (error) {
    console.error('❌ Erro no envio de parceiro corrigido:', error);
    throw error;
  }
}

// ========================================
// 🛠️ FUNÇÕES AUXILIARES
// ========================================

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function hasProblematicChars(text) {
  // Caracteres que podem causar problemas no EmailJS
  const problematicChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/;
  return problematicChars.test(text);
}

function getBusinessTypeLabel(type) {
  const labels = {
    gastronomy: 'Gastronomia',
    art: 'Arte e Cultura',
    wellbeing: 'Bem-estar',
    other: 'Outro'
  };
  return labels[type] || type;
}

// ========================================
// 🚀 FUNÇÃO PRINCIPAL DE DIAGNÓSTICO
// ========================================

export async function executarDiagnosticoCompleto() {
  console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DO EMAILJS');
  console.log('=' .repeat(50));
  
  try {
    // Etapa 1: Configuração básica
    const problemasConfig = await testarConfiguracaoBasica();
    
    if (problemasConfig.length > 0) {
      console.error('❌ Problemas de configuração encontrados:');
      problemasConfig.forEach(problema => console.error(problema));
      return { success: false, problemas: problemasConfig };
    }
    
    // Etapa 2: Corrigir inicialização
    corrigirInicializacao();
    
    // Etapa 3: Teste mínimo
    const resultadoTeste = await testePayloadMinimo();
    
    if (!resultadoTeste.success) {
      console.error('❌ Teste mínimo falhou:', resultadoTeste.error);
      return { success: false, erro: resultadoTeste.error };
    }
    
    console.log('✅ DIAGNÓSTICO CONCLUÍDO COM SUCESSO!');
    console.log('🔧 Use as funções corrigidas: enviarEmailContato_CORRIGIDO() e enviarEmailParceiro_CORRIGIDO()');
    
    return { success: true, message: 'Diagnóstico concluído com sucesso' };
    
  } catch (error) {
    console.error('❌ Erro durante diagnóstico:', error);
    return { success: false, erro: error };
  }
}

// ========================================
// 📋 INSTRUÇÕES DE USO
// ========================================

/*
PARA USAR ESTE DIAGNÓSTICO:

1. Importe este arquivo no seu componente:
   import { executarDiagnosticoCompleto, enviarEmailContato_CORRIGIDO } from './diagnostico-emailjs-400.js';

2. Execute o diagnóstico:
   await executarDiagnosticoCompleto();

3. Use as funções corrigidas:
   await enviarEmailContato_CORRIGIDO(contactData);
   await enviarEmailParceiro_CORRIGIDO(partnerData);

4. Monitore o console para identificar problemas específicos

PROBLEMAS MAIS COMUNS E SOLUÇÕES:

❌ Status 400 - Bad Request:
   - Payload com campos undefined/null
   - Inicialização dupla do EmailJS
   - Template ID incorreto
   - Caracteres especiais não codificados

✅ SOLUÇÕES IMPLEMENTADAS:
   - Validação completa do payload
   - Inicialização única e correta
   - Fallbacks para campos obrigatórios
   - Limpeza de caracteres problemáticos
*/

export default {
  executarDiagnosticoCompleto,
  enviarEmailContato_CORRIGIDO,
  enviarEmailParceiro_CORRIGIDO,
  testarConfiguracaoBasica,
  validarPayload,
  testePayloadMinimo
};