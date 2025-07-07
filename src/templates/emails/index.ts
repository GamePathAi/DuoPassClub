// Email Templates para DUO PASS Club
// Compliance legal completo com GDPR, FADP e legislação suíça

export { default as ConfirmacaoAssinatura } from './ConfirmacaoAssinatura';
export { default as LembreteRenovacao } from './LembreteRenovacao';
export { default as ConfirmacaoCancelamento } from './ConfirmacaoCancelamento';
export { default as ReembolsoProcessado } from './ReembolsoProcessado';

// Tipos para os templates
export interface EmailTemplateProps {
  userName: string;
  [key: string]: string | number | boolean | Date;
}

// Configurações de email
export const EMAIL_CONFIG = {
  from: 'noreply@duopass.ch',
  replyTo: 'suporte@duopass.ch',
  company: {
    name: 'DUO PASS Club',
    address: 'Suíça',
    website: 'https://duopass.ch',
    support: 'suporte@duopass.ch',
    phone: '+41 XX XXX XX XX'
  },
  legal: {
    termsUrl: 'https://duopass.ch/termos-de-uso',
    privacyUrl: 'https://duopass.ch/privacidade',
    cancelUrl: 'https://duopass.ch/cancelamento',
    experiencesTermsUrl: 'https://duopass.ch/experiencias-termos'
  },
  compliance: {
    gdprCompliant: true,
    fadpCompliant: true,
    pciDssCompliant: true,
    swissConsumerLaw: true
  }
};

// Utilitários para formatação
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF'
  }).format(amount * 0.18);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('de-CH');
};

// Status de email
export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

// Tipos de email
export enum EmailType {
  SUBSCRIPTION_CONFIRMATION = 'subscription_confirmation',
  RENEWAL_REMINDER = 'renewal_reminder',
  CANCELLATION_CONFIRMATION = 'cancellation_confirmation',
  REFUND_PROCESSED = 'refund_processed'
}