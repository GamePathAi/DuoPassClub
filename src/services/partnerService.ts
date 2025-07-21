import { supabase } from '../lib/supabase';

// Interface para dados do parceiro (do formulário)
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

// Verificar se o e-mail já existe
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('partner_registrations')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: 'No rows found'
      console.error('❌ Erro ao verificar e-mail:', error);
      return { exists: false, error: error.message };
    }

    return { exists: !!data };
  } catch (error) {
    console.error('❌ Erro interno ao verificar e-mail:', error);
    return { exists: false, error: 'Erro interno do sistema' };
  }
};

// Salvar dados do parceiro no Supabase
export const savePartnerRegistration = async (data: PartnerRegistrationData): Promise<{ success: boolean; id?: number; error?: string }> => {
  try {
    console.log('💾 Salvando dados do parceiro no Supabase com novo schema...');

    const { data: savedData, error } = await supabase
      .from('partner_registrations')
      .insert([
        {
          business_name: data.businessName,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone,
          address_street: data.address.street,
          address_city: data.address.city,
          address_postal_code: data.address.postalCode,
          address_country: data.address.country || 'Switzerland',
          business_type: data.businessType,
          founder_story: data.founderStory,
          cultural_mission: data.culturalMission,
          experience_title: data.proposedExperience.title,
          experience_description: data.proposedExperience.description,
          experience_normal_price: data.proposedExperience.normalPrice,
          experience_duo_value: data.proposedExperience.duoValue,
        },
      ])
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
}): Promise<{ success: boolean; data?: any[]; error?: string }> => {
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