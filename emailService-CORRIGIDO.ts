import emailjs from '@emailjs/browser';

// Configurações do EmailJS
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_nj1x65i',
  templateIds: {
    // TEMPORÁRIO: Usar template_r3t7pti para tudo
    partnerConfirmation: 'template_r3t7pti',
    adminNotification: 'template_r3t7pti',
    contactConfirmation: 'template_r3t7pti',
    contactAdmin: 'template_r3t7pti'
  },
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'jwnAl9bi3b1X98hdq' // Chave pública do EmailJS
};

// Templates HTML para emails
export const EMAIL_TEMPLATES = {
  // Template para confirmação de contato de parceiro cultural
  culturalPartnerContactConfirmation: `
    <h2>🎉 Obrigado pelo seu interesse no DuoPass Club!</h2>
    <p>Olá {{to_name}},</p>
    <p>Recebemos seu interesse em se tornar um parceiro cultural do DuoPass Club e estamos animados para conhecer mais sobre sua proposta!</p>

    <h3>📋 Próximos Passos:</h3>
    <ul>
      <li><strong>Análise (24-48h):</strong> Nossa equipe entrará em contato</li>
      <li><strong>Conversa:</strong> Vamos conhecer sua história e proposta</li>
      <li><strong>Curadoria:</strong> Criaremos juntos sua experiência perfeita</li>
      <li><strong>Ativação:</strong> Seu espaço entra na plataforma</li>
    </ul>

    <h3>📞 Contato:</h3>
    <p>Email: contact@duopassclub.ch</p>

    <p>Obrigado por querer fazer parte da nossa comunidade cultural!</p>
    <p><strong>Equipe DuoPass Club</strong></p>
  `,
  
  // Template para notificação de admin sobre contato de parceiro cultural
  culturalPartnerContactAdmin: `
    <h2>🔔 Novo Interesse de Parceiro Cultural</h2>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Data:</strong> {{contact_date}}</p>
    <p><strong>Hora:</strong> {{contact_time}}</p>
    <p><strong>Origem:</strong> {{contact_source}}</p>

    <h3>📝 Mensagem:</h3>
    <p>{{message}}</p>

    <p><strong>Ação Recomendada:</strong> Entrar em contato em até 24h para agendar uma conversa inicial.</p>
  `
};

// Variável para controlar inicialização única
let emailjsInitialized = false;

// Inicializar EmailJS apenas uma vez
function initializeEmailJS() {
  if (!emailjsInitialized && EMAILJS_CONFIG.publicKey) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    emailjsInitialized = true;
    console.log('✅ EmailJS inicializado com sucesso.');
  }
}

// Inicializar EmailJS automaticamente
initializeEmailJS();

// Função para validar email
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Função para sanitizar strings
function sanitizeString(str: any): string {
  if (str === null || str === undefined) return 'N/A';
  return String(str)
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove caracteres de controle
    .replace(/["'`]/g, '') // Remove aspas
    .trim();
}

// Função para normalizar payload para o template que funciona
function normalizePayloadForWorkingTemplate(originalPayload: Record<string, any>, emailType: string): Record<string, any> {
  const basePayload = {
    to_email: sanitizeString(originalPayload.to_email),
    contact_name: sanitizeString(originalPayload.contact_name || originalPayload.to_name || 'Nome não informado'),
    contact_email: sanitizeString(originalPayload.contact_email || originalPayload.to_email),
    contact_business: sanitizeString(originalPayload.contact_business || originalPayload.business_name || 'Negócio não informado'),
    contact_type: sanitizeString(originalPayload.contact_type || originalPayload.business_type || 'Tipo não informado'),
    contact_description: sanitizeString(originalPayload.contact_description || originalPayload.message || `Email de ${emailType}`),
    contact_date: new Date().toLocaleString('pt-BR'),
    reply_to: sanitizeString(originalPayload.reply_to || 'contact@duopassclub.ch')
  };
  
  console.log(`🔧 Payload normalizado para template_r3t7pti (${emailType}):`, basePayload);
  return basePayload;
}

// Função para criar um template de email personalizado
export const createEmailTemplate = (templateType: string, data: Record<string, any>): string => {
  let template = '';
  
  switch (templateType) {
    case 'culturalPartnerContactConfirmation':
      template = EMAIL_TEMPLATES.culturalPartnerContactConfirmation;
      break;
    case 'culturalPartnerContactAdmin':
      template = EMAIL_TEMPLATES.culturalPartnerContactAdmin;
      break;
    default:
      console.warn(`Template de email '${templateType}' não encontrado.`);
      return '';
  }
  
  // Substituir placeholders pelos dados reais
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key] || '');
  });
  
  return template;
};

// Interface para dados do parceiro
interface PartnerData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  founderStory: string;
  culturalMission: string;
  proposedExperience: {
    title: string;
    description: string;
    normalPrice: number;
    duoValue: string;
  };
}

// Interface para dados de contato simples
export interface ContactData {
  email: string;
  name?: string;
  message?: string;
  subject?: string;
  source?: string;
  id?: string;
  business?: string;
  type?: string;
  description?: string;
  created_at?: string;
}

// Função auxiliar para obter label do tipo de negócio
function getBusinessTypeLabel(type: string | undefined): string {
  if (!type) return 'Não especificado';
  
  const types: Record<string, string> = {
    'gastronomy': 'Gastronomia',
    'culture': 'Cultura',
    'wellness': 'Bem-estar',
    'retail': 'Varejo',
    'services': 'Serviços',
    'other': 'Outro'
  };
  
  return types[type] || type;
}

// Enviar email de confirmação para o parceiro
export const sendPartnerConfirmationEmail = async (partnerData: PartnerData): Promise<boolean> => {
  try {
    // Garantir inicialização
    initializeEmailJS();
    
    // Criar payload original
    const originalParams = {
      to_email: partnerData.email,
      to_name: partnerData.contactName,
      business_name: partnerData.businessName,
      business_type: partnerData.businessType,
      reply_to: import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@duopassclub.ch'
    };
    
    // Normalizar payload para o template que funciona
    const templateParams = normalizePayloadForWorkingTemplate(originalParams, 'confirmação parceiro');

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partnerConfirmation,
      templateParams
    );

    console.log('✅ Email de confirmação enviado:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
    return false;
  }
};

// Enviar email de confirmação para contato de parceiro cultural (formulário simples)
export const sendCulturalPartnerContactConfirmation = async (email: string): Promise<boolean> => {
  try {
    // Garantir inicialização
    initializeEmailJS();
    
    // Criar payload original
    const originalParams = {
      to_email: email,
      to_name: email.split('@')[0], // Nome básico extraído do email
      from_name: 'DuoPass Club',
      message: 'Obrigado pelo seu interesse em se tornar um parceiro cultural do DuoPass Club. Em breve entraremos em contato para conhecer mais sobre sua história e proposta cultural.',
      subject: 'Recebemos seu interesse - DuoPass Club',
      reply_to: import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@duopassclub.ch'
    };
    
    // Normalizar payload para o template que funciona
    const templateParams = normalizePayloadForWorkingTemplate(originalParams, 'confirmação contato cultural');
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactConfirmation,
      templateParams
    );

    console.log('✅ Email de confirmação de contato enviado:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação de contato:', error);
    return false;
  }
};

// Enviar notificação para admin
export const sendAdminNotificationEmail = async (partnerData: PartnerData): Promise<boolean> => {
  try {
    // Garantir inicialização
    initializeEmailJS();
    
    // Criar payload original
    const adminNotificationParamsRaw = {
      to_email: import.meta.env.VITE_ADMIN_EMAIL || 'silviabonafe@duopassclub.ch',
      business_name: partnerData.businessName,
      contact_name: partnerData.contactName,
      contact_email: partnerData.email,
      phone: partnerData.phone,
      business_type: partnerData.businessType,
      address_street: partnerData.address.street,
      address_city: partnerData.address.city,
      address_postal_code: partnerData.address.postalCode,
      address_country: partnerData.address.country,
      founder_story: partnerData.founderStory,
      cultural_mission: partnerData.culturalMission,
      experience_title: partnerData.proposedExperience.title,
      experience_description: partnerData.proposedExperience.description,
      experience_normal_price: `CHF ${partnerData.proposedExperience.normalPrice}`,
      experience_duo_value: `CHF ${partnerData.proposedExperience.duoValue}`,
      contact_description: `Novo parceiro: ${partnerData.businessName} (${partnerData.businessType}) - ${partnerData.proposedExperience.title} - CHF ${partnerData.proposedExperience.normalPrice}`,
      reply_to: import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@duopassclub.ch'
    };
    
    // Normalizar payload para o template que funciona
    const templateParams = normalizePayloadForWorkingTemplate(adminNotificationParamsRaw, 'notificação admin');

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.adminNotification,
      templateParams
    );

    console.log('✅ Notificação admin enviada:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('❌ Erro detalhado ao enviar notificação admin:', JSON.stringify(error, null, 2));
    return false;
  }
};

// Enviar emails de contato (admin + confirmação)
export const sendContactEmails = async (contactData: ContactData): Promise<{ success: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  try {
    // Garantir inicialização
    initializeEmailJS();
    
    // Email para admin com dados do prospect
    const adminParamsRaw = {
      to_email: import.meta.env.VITE_ADMIN_EMAIL || 'silviabonafe@duopassclub.ch',
      contact_id: contactData.id,
      contact_name: contactData.name,
      contact_email: contactData.email,
      contact_business: contactData.business,
      contact_type: getBusinessTypeLabel(contactData.type),
      contact_description: contactData.description,
      contact_date: contactData.created_at ? new Date(contactData.created_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR'),
      reply_to: import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@duopassclub.ch'
    };
    
    // Normalizar payload para o template que funciona
    const adminParams = normalizePayloadForWorkingTemplate(adminParamsRaw, 'admin');
    
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactAdmin,
      adminParams
    );
    
    console.log('✅ Email admin enviado:', adminResponse.status, adminResponse.text);
    
    // Email de confirmação para o prospect
    const confirmationParamsRaw = {
      to_email: contactData.email,
      to_name: contactData.name || contactData.email.split('@')[0],
      business_name: contactData.business,
      business_type: getBusinessTypeLabel(contactData.type),
      contact_id: contactData.id,
      reply_to: import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@duopassclub.ch'
    };
    
    // Normalizar payload para o template que funciona
    const confirmationParams = normalizePayloadForWorkingTemplate(confirmationParamsRaw, 'confirmação');
    
    const confirmationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.contactConfirmation,
      confirmationParams
    );
    
    console.log('✅ Email confirmação enviado:', confirmationResponse.status, confirmationResponse.text);
    
    return {
      success: true,
      errors: []
    };
  } catch (error) {
    console.error('❌ Erro ao enviar emails de contato:', error);
    errors.push('Erro ao enviar emails: ' + (error instanceof Error ? error.message : String(error)));
    
    return {
      success: false,
      errors
    };
  }
};

// Enviar emails de registro de parceiro (admin + confirmação)
export const sendPartnerRegistrationEmails = async (partnerData: PartnerData & { adminOnly?: boolean }): Promise<{ success: boolean; errors: string[] }> => {
  const errors: string[] = [];
  const isAdminOnly = partnerData.adminOnly || false;
  
  try {
    // Garantir inicialização
    initializeEmailJS();
    
    if (!isAdminOnly) {
      const partnerEmailSent = await sendPartnerConfirmationEmail(partnerData);
      if (!partnerEmailSent) {
        errors.push('Falha ao enviar email de confirmação para o parceiro');
      }
    }

    const adminEmailSent = await sendAdminNotificationEmail(partnerData);
    if (!adminEmailSent) {
      errors.push('Falha ao enviar notificação para admin');
    }

    return {
      success: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error('❌ Erro geral no envio de emails:', error);
    return {
      success: false,
      errors: ['Erro interno no sistema de emails']
    };
  }
};