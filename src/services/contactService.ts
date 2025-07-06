import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

// Interface para dados do formulário de contato
export interface ContactFormData {
  name: string;
  email: string;
  business: string;
  type: 'gastronomy' | 'art' | 'wellbeing' | 'other';
  description: string;
}

// Interface para registro de contato no banco
export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  business: string;
  type: string;
  description: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
}

// Interface para dados completos do contato (com ID e timestamp)
export interface ContactData extends ContactFormData {
  id: string;
  created_at: string;
}

/**
 * Salva uma nova mensagem de contato no Supabase
 */
export async function saveContactMessage(formData: ContactFormData): Promise<ContactRecord> {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: formData.name,
      email: formData.email,
      business: formData.business,
      type: formData.type,
      description: formData.description,
      status: 'new'
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar mensagem de contato:', error);
    throw new Error('Erro ao salvar mensagem. Tente novamente.');
  }

  return data;
}

/**
 * Busca mensagens de contato com filtros opcionais
 */
export async function getContactMessages(filters?: {
  status?: 'new' | 'contacted' | 'closed';
  type?: string;
  limit?: number;
}): Promise<ContactRecord[]> {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar mensagens de contato:', error);
    throw new Error('Erro ao carregar mensagens.');
  }

  return data || [];
}

/**
 * Atualiza o status de uma mensagem de contato
 */
export async function updateContactStatus(
  id: string, 
  status: 'new' | 'contacted' | 'closed',
  adminNotes?: string
): Promise<void> {
  const updateData: {
    status: 'new' | 'contacted' | 'closed';
    updated_at: string;
    admin_notes?: string;
  } = {
    status,
    updated_at: new Date().toISOString()
  };

  if (adminNotes) {
    updateData.admin_notes = adminNotes;
  }

  const { error } = await supabase
    .from('contact_messages')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar status da mensagem:', error);
    throw new Error('Erro ao atualizar status.');
  }
}

/**
 * Envia emails de confirmação e notificação para mensagem de contato
 */
export async function sendContactEmails(contactData: ContactData): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const adminTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN;
  const confirmationTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'contact@dupassclub.ch';
  const replyToEmail = import.meta.env.VITE_REPLY_TO_EMAIL || 'contact@dupassclub.ch';

  if (!serviceId || !publicKey) {
    throw new Error('Configuração de email não encontrada');
  }

  try {
    // Email para admin com dados do prospect
    if (adminTemplateId) {
      await emailjs.send(
        serviceId,
        adminTemplateId,
        {
          to_email: adminEmail,
          contact_id: contactData.id,
          contact_name: contactData.name,
          contact_email: contactData.email,
          contact_business: contactData.business,
          contact_type: getBusinessTypeLabel(contactData.type),
          contact_description: contactData.description,
          contact_date: new Date(contactData.created_at).toLocaleString('pt-BR'),
          reply_to: replyToEmail
        },
        publicKey
      );
    }

    // Email de confirmação para o prospect
    if (confirmationTemplateId) {
      await emailjs.send(
        serviceId,
        confirmationTemplateId,
        {
          to_email: contactData.email,
          to_name: contactData.name,
          business_name: contactData.business,
          business_type: getBusinessTypeLabel(contactData.type),
          contact_id: contactData.id,
          reply_to: replyToEmail
        },
        publicKey
      );
    }
  } catch (error) {
    console.error('Erro ao enviar emails de contato:', error);
    throw new Error('Erro ao enviar emails de confirmação');
  }
}

/**
 * Converte tipo de negócio para label legível
 */
function getBusinessTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    gastronomy: 'Gastronomia',
    art: 'Arte e Cultura',
    wellbeing: 'Bem-estar',
    other: 'Outro'
  };
  return labels[type] || type;
}

/*
SQL Schema para a tabela contact_messages:

CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  business VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('gastronomy', 'art', 'wellbeing', 'other')),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_type ON contact_messages(type);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (formulário de contato)
CREATE POLICY "Allow public insert on contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Política para admins visualizarem todas as mensagens
CREATE POLICY "Allow admin read on contact_messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Política para admins atualizarem mensagens
CREATE POLICY "Allow admin update on contact_messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );
*/