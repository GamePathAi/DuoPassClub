// Utilitários para operações comuns com Supabase
import { supabase } from './supabase';
import { 
  DbUser, 
  DbOffer, 
  DbVoucher, 
  DbActivatedCoupon,
  UpdateUser,
  OfferWithMerchant,
  VoucherWithDetails,
  ApiResponse,
  PaginatedResponse
} from '../types/database';

// Utilitários para usuários
export const userUtils = {
  // Buscar usuário por ID
  async getById(id: string): Promise<ApiResponse<DbUser>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      return {
        data,
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  },

  // Buscar comerciantes
  async getMerchants(): Promise<ApiResponse<DbUser[]>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'merchant')
        .order('full_name');
      
      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(id: string, updates: UpdateUser): Promise<ApiResponse<DbUser>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return {
        data,
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  }
};

// Utilitários para ofertas
export const offerUtils = {
  // Buscar ofertas ativas
  async getActiveOffers(page = 1, limit = 10): Promise<PaginatedResponse<OfferWithMerchant>> {
    try {
      const offset = (page - 1) * limit;
      
      // Buscar ofertas com contagem total
      const [offersResult, countResult] = await Promise.all([
        supabase
          .from('offers')
          .select(`
            *,
            merchant:users!merchant_id (
              full_name,
              business_name,
              contact_info
            )
          `)
          .eq('is_active', true)
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .gte('expires_at', new Date().toISOString())
      ]);
      
      const { data: offers, error: offersError } = offersResult;
      const { count, error: countError } = countResult;
      
      if (offersError || countError) {
        throw new Error(offersError?.message || countError?.message);
      }
      
      return {
        data: offers || [],
        error: null,
        success: true,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  // Buscar ofertas por categoria
  async getByCategory(category: string, page = 1, limit = 10): Promise<PaginatedResponse<OfferWithMerchant>> {
    try {
      const offset = (page - 1) * limit;
      
      const [offersResult, countResult] = await Promise.all([
        supabase
          .from('offers')
          .select(`
            *,
            merchant:users!merchant_id (
              full_name,
              business_name,
              contact_info
            )
          `)
          .eq('is_active', true)
          .eq('category', category)
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('category', category)
          .gte('expires_at', new Date().toISOString())
      ]);
      
      const { data: offers, error: offersError } = offersResult;
      const { count, error: countError } = countResult;
      
      if (offersError || countError) {
        throw new Error(offersError?.message || countError?.message);
      }
      
      return {
        data: offers || [],
        error: null,
        success: true,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  // Buscar ofertas do comerciante
  async getMerchantOffers(merchantId: string): Promise<ApiResponse<DbOffer[]>> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });
      
      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  }
};

// Utilitários para vouchers
export const voucherUtils = {
  // Buscar vouchers do usuário
  async getUserVouchers(userId: string): Promise<ApiResponse<VoucherWithDetails[]>> {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          offer:offers!offer_id (*),
          user:users!user_id (
            full_name,
            email
          ),
          merchant:users!merchant_id (
            full_name,
            business_name,
            contact_info
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  },

  // Buscar vouchers do comerciante
  async getMerchantVouchers(merchantId: string, limit = 10): Promise<ApiResponse<VoucherWithDetails[]>> {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          user:users!user_id (
            full_name,
            email
          ),
          merchant:users!merchant_id (
            full_name,
            business_name,
            contact_info
          )
        `)
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  },

  // Validar voucher por código
  async validateByCode(voucherCode: string, merchantId: string): Promise<ApiResponse<DbVoucher>> {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('voucher_code', voucherCode)
        .eq('merchant_id', merchantId)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .single();
      
      return {
        data,
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  }
};

// Utilitários para cupons ativados
export const couponUtils = {
  // Buscar cupons do usuário
  async getUserCoupons(userId: string): Promise<ApiResponse<DbActivatedCoupon[]>> {
    try {
      const { data, error } = await supabase
        .from('activated_coupons')
        .select(`
          *,
          offer:offers (
            *,
            merchant:users!merchant_id (
              full_name,
              business_name,
              contact_info
            )
          )
        `)
        .eq('user_id', userId)
        .order('activated_at', { ascending: false });
      
      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  },

  // Ativar cupom
  async activate(userId: string, offerId: string): Promise<ApiResponse<DbActivatedCoupon>> {
    try {
      // Verificar se já existe cupom ativo para esta oferta
      const { data: existing } = await supabase
        .from('activated_coupons')
        .select('*')
        .eq('user_id', userId)
        .eq('offer_id', offerId)
        .single();
      
      if (existing) {
        return {
          data: null,
          error: 'Cupom já foi ativado para esta oferta',
          success: false
        };
      }
      
      const { data, error } = await supabase
        .from('activated_coupons')
        .insert({
          user_id: userId,
          offer_id: offerId
        })
        .select()
        .single();
      
      return {
        data,
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  }
};

// Utilitários para categorias
export const categoryUtils = {
  // Buscar todas as categorias
  async getAll(): Promise<ApiResponse<Record<string, unknown>[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  }
};

// Utilitário para busca
export const searchUtils = {
  // Buscar ofertas por termo
  async searchOffers(searchTerm: string, page = 1, limit = 10): Promise<PaginatedResponse<OfferWithMerchant>> {
    try {
      const offset = (page - 1) * limit;
      
      const [offersResult, countResult] = await Promise.all([
        supabase
          .from('offers')
          .select(`
            *,
            merchant:users!merchant_id (
              full_name,
              business_name,
              contact_info
            )
          `)
          .eq('is_active', true)
          .gte('expires_at', new Date().toISOString())
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .gte('expires_at', new Date().toISOString())
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      ]);
      
      const { data: offers, error: offersError } = offersResult;
      const { count, error: countError } = countResult;
      
      if (offersError || countError) {
        throw new Error(offersError?.message || countError?.message);
      }
      
      return {
        data: offers || [],
        error: null,
        success: true,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  }
};

// Utilitário para limpeza de dados expirados
export const cleanupUtils = {
  // Expirar vouchers antigos
  async expireOldVouchers(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.rpc('expire_old_vouchers');
      
      return {
        data: null,
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  },

  // Expirar cupons antigos
  async expireOldCoupons(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.rpc('expire_old_coupons');
      
      return {
        data: null,
        error: error?.message || null,
        success: !error
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      };
    }
  }
};

// Exportar todos os utilitários
export const supabaseUtils = {
  user: userUtils,
  offer: offerUtils,
  voucher: voucherUtils,
  coupon: couponUtils,
  category: categoryUtils,
  search: searchUtils,
  cleanup: cleanupUtils
};

export default supabaseUtils;