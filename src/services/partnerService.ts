import { supabase } from '../lib/supabase';

// Interface para dados do parceiro
export interface PartnerRegistrationData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: 'restaurante' | 'cafe' | 'galeria' | 'atelier' | 'spa' | 'teatro' | 'outro';
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
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

// Interface para dados salvos no banco
export interface PartnerRecord {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  business_type: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country: string;
  founder_story: string;
  cultural_mission: string;
  experience_title: string;
  experience_description: string;
  experience_normal_price: number;
  experience_duo_value: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Salvar dados do parceiro no Supabase
export const savePartnerRegistration = async (data: PartnerRegistrationData): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    console.log('💾 Salvando dados do parceiro no Supabase...');
    
    const partnerRecord = {
      business_name: data.businessName,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone,
      business_type: data.businessType,
      address_street: data.address.street,
      address_city: data.address.city,
      address_postal_code: data.address.postalCode,
      address_country: data.address.country,
      founder_story: data.founderStory,
      cultural_mission: data.culturalMission,
      experience_title: data.proposedExperience.title,
      experience_description: data.proposedExperience.description,
      experience_normal_price: data.proposedExperience.normalPrice,
      experience_duo_value: data.proposedExperience.duoValue,
      terms_accepted: data.termsAccepted,
      privacy_accepted: data.privacyAccepted,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: savedData, error } = await supabase
      .from('partner_registrations')
      .insert([partnerRecord])
      .select('id')
      .single();

    if (error) {
      console.error('❌ Erro ao salvar no Supabase:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('✅ Dados salvos com sucesso:', savedData.id);
    return {
      success: true,
      id: savedData.id
    };
  } catch (error) {
    console.error('❌ Erro interno ao salvar dados:', error);
    return {
      success: false,
      error: 'Erro interno do sistema'
    };
  }
};

// Buscar registros de parceiros
export const getPartnerRegistrations = async (filters?: {
  status?: 'pending' | 'approved' | 'rejected';
  limit?: number;
  offset?: number;
}): Promise<{ success: boolean; data?: PartnerRecord[]; error?: string }> => {
  try {
    let query = supabase
      .from('partner_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Erro ao buscar registros:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data as PartnerRecord[]
    };
  } catch (error) {
    console.error('❌ Erro interno ao buscar dados:', error);
    return {
      success: false,
      error: 'Erro interno do sistema'
    };
  }
};

// Atualizar status do parceiro
export const updatePartnerStatus = async (
  id: string, 
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const updateData: {
      status: 'pending' | 'approved' | 'rejected';
      updated_at: string;
      admin_notes?: string;
    } = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.admin_notes = notes;
    }

    const { error } = await supabase
      .from('partner_registrations')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao atualizar status:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('✅ Status atualizado com sucesso');
    return {
      success: true
    };
  } catch (error) {
    console.error('❌ Erro interno ao atualizar status:', error);
    return {
      success: false,
      error: 'Erro interno do sistema'
    };
  }
};

// SQL para criar a tabela (para referência)
export const CREATE_PARTNER_REGISTRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS partner_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  business_type VARCHAR(50) NOT NULL,
  address_street TEXT NOT NULL,
  address_city VARCHAR(100) NOT NULL,
  address_postal_code VARCHAR(20) NOT NULL,
  address_country VARCHAR(100) NOT NULL,
  founder_story TEXT NOT NULL,
  cultural_mission TEXT NOT NULL,
  experience_title VARCHAR(255) NOT NULL,
  experience_description TEXT NOT NULL,
  experience_normal_price DECIMAL(10,2) NOT NULL,
  experience_duo_value TEXT NOT NULL,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  privacy_accepted BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_partner_registrations_email ON partner_registrations(email);
CREATE INDEX IF NOT EXISTS idx_partner_registrations_status ON partner_registrations(status);
CREATE INDEX IF NOT EXISTS idx_partner_registrations_created_at ON partner_registrations(created_at);

-- RLS (Row Level Security)
ALTER TABLE partner_registrations ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (cadastro)
CREATE POLICY "Allow public insert" ON partner_registrations
  FOR INSERT WITH CHECK (true);

-- Política para admin visualizar todos
CREATE POLICY "Allow admin select" ON partner_registrations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para admin atualizar
CREATE POLICY "Allow admin update" ON partner_registrations
  FOR UPDATE USING (auth.role() = 'authenticated');
`;