import emailjs from '@emailjs/browser';

// Configurações do EmailJS
const EMAILJS_CONFIG = {
  serviceId: 'service_duopass', // Será configurado no EmailJS
  templateIds: {
    partnerConfirmation: 'template_partner_confirmation',
    adminNotification: 'template_admin_notification'
  },
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // Será configurado
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

// Inicializar EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.publicKey);
};

// Enviar email de confirmação para o parceiro
export const sendPartnerConfirmationEmail = async (partnerData: PartnerData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: partnerData.email,
      to_name: partnerData.contactName,
      business_name: partnerData.businessName,
      business_type: partnerData.businessType,
      experience_title: partnerData.proposedExperience.title,
      reply_to: 'contact@dupassclub.ch',
      from_name: 'DUO PASS Club',
      from_email: 'contact@dupassclub.ch'
    };

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

// Enviar notificação para admin
export const sendAdminNotificationEmail = async (partnerData: PartnerData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: 'contact@dupassclub.ch',
      to_name: 'Equipe DUO PASS',
      partner_name: partnerData.contactName,
      business_name: partnerData.businessName,
      partner_email: partnerData.email,
      partner_phone: partnerData.phone,
      business_type: partnerData.businessType,
      address: `${partnerData.address.street}, ${partnerData.address.city}, ${partnerData.address.postalCode}`,
      founder_story: partnerData.founderStory,
      cultural_mission: partnerData.culturalMission,
      experience_title: partnerData.proposedExperience.title,
      experience_description: partnerData.proposedExperience.description,
      normal_price: partnerData.proposedExperience.normalPrice,
      duo_value: partnerData.proposedExperience.duoValue,
      reply_to: 'contact@dupassclub.ch',
      from_name: 'Sistema DUO PASS',
      from_email: 'contact@dupassclub.ch'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.adminNotification,
      templateParams
    );

    console.log('✅ Notificação admin enviada:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar notificação admin:', error);
    return false;
  }
};

// Função principal para enviar ambos os emails
export const sendPartnerRegistrationEmails = async (partnerData: PartnerData): Promise<{ success: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  try {
    // Enviar email de confirmação para o parceiro
    const partnerEmailSent = await sendPartnerConfirmationEmail(partnerData);
    if (!partnerEmailSent) {
      errors.push('Falha ao enviar email de confirmação para o parceiro');
    }

    // Enviar notificação para admin
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

// Templates de email (para referência)
export const EMAIL_TEMPLATES = {
  partnerConfirmation: {
    subject: '🎉 Bem-vindo ao DUO PASS Club!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">DUO PASS Club</h1>
          <p style="color: white; margin: 10px 0 0 0;">Experiências Culturais Autênticas</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333;">Olá {{to_name}}! 👋</h2>
          
          <p>Que alegria ter o <strong>{{business_name}}</strong> como nosso novo parceiro cultural!</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f59e0b; margin-top: 0;">📋 Próximos Passos:</h3>
            <ul style="color: #666;">
              <li>Nossa equipe analisará sua proposta em até 48h</li>
              <li>Entraremos em contato para alinhar detalhes</li>
              <li>Configuraremos sua experiência na plataforma</li>
              <li>Você receberá acesso ao portal do parceiro</li>
            </ul>
          </div>
          
          <p>Sua experiência <strong>"{{experience_title}}"</strong> promete ser incrível!</p>
          
          <p>Dúvidas? Responda este email ou entre em contato:</p>
          <p>📧 contact@dupassclub.ch<br>
          🌐 dupassclub.ch</p>
          
          <p style="margin-top: 30px;">Com carinho,<br>
          <strong>Equipe DUO PASS Club</strong></p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>DUO PASS Club - Conectando pessoas através de experiências culturais autênticas</p>
        </div>
      </div>
    `
  },
  
  adminNotification: {
    subject: '🚀 Novo Parceiro Cadastrado - {{business_name}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Novo Parceiro Cadastrado</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333;">📋 Informações do Parceiro</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Estabelecimento:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">{{business_name}}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Responsável:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">{{partner_name}}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">{{partner_email}}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Telefone:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">{{partner_phone}}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Tipo:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">{{business_type}}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Endereço:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">{{address}}</td>
            </tr>
          </table>
          
          <h3 style="color: #f59e0b;">🎯 Experiência Proposta</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p><strong>Título:</strong> {{experience_title}}</p>
            <p><strong>Descrição:</strong> {{experience_description}}</p>
            <p><strong>Preço Normal:</strong> R$ {{normal_price}}</p>
            <p><strong>Oferta DUO:</strong> {{duo_value}}</p>
          </div>
          
          <h3 style="color: #f59e0b;">📖 História e Missão</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p><strong>História:</strong> {{founder_story}}</p>
            <p><strong>Missão Cultural:</strong> {{cultural_mission}}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
            <h3 style="color: #92400e; margin-top: 0;">⚡ Ações Necessárias:</h3>
            <ul style="color: #92400e;">
              <li>Analisar proposta de experiência</li>
              <li>Verificar informações de contato</li>
              <li>Agendar reunião de alinhamento</li>
              <li>Configurar acesso ao portal</li>
            </ul>
          </div>
        </div>
      </div>
    `
  }
};