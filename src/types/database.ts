// Tipos TypeScript gerados para o banco de dados Supabase
// Este arquivo define a estrutura completa do banco de dados

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          user_type: 'customer' | 'merchant'
          subscription_status: 'active' | 'inactive' | 'trial' | null
          subscription_expires_at: string | null
          business_name: string | null
          contact_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          user_type?: 'customer' | 'merchant'
          subscription_status?: 'active' | 'inactive' | 'trial' | null
          subscription_expires_at?: string | null
          business_name?: string | null
          contact_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          user_type?: 'customer' | 'merchant'
          subscription_status?: 'active' | 'inactive' | 'trial' | null
          subscription_expires_at?: string | null
          business_name?: string | null
          contact_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          id: string
          merchant_id: string
          title: string
          description: string
          original_value: number
          category: string
          location: string
          expires_at: string
          is_active: boolean
          image_url: string | null
          terms_conditions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          title: string
          description: string
          original_value: number
          category: string
          location: string
          expires_at: string
          is_active?: boolean
          image_url?: string | null
          terms_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          title?: string
          description?: string
          original_value?: number
          category?: string
          location?: string
          expires_at?: string
          is_active?: boolean
          image_url?: string | null
          terms_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_merchant_id_fkey"
            columns: ["merchant_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      activated_coupons: {
        Row: {
          id: string
          user_id: string
          offer_id: string
          activated_at: string
          used_at: string | null
          status: 'active' | 'used' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          offer_id: string
          activated_at?: string
          used_at?: string | null
          status?: 'active' | 'used' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          offer_id?: string
          activated_at?: string
          used_at?: string | null
          status?: 'active' | 'used' | 'expired'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activated_coupons_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activated_coupons_offer_id_fkey"
            columns: ["offer_id"]
            referencedRelation: "offers"
            referencedColumns: ["id"]
          }
        ]
      }
      vouchers: {
        Row: {
          id: string
          user_id: string
          merchant_id: string
          voucher_code: string
          qr_code_data: string
          status: 'active' | 'used' | 'expired'
          expires_at: string
          used_at: string | null
          used_location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          merchant_id: string
          voucher_code: string
          qr_code_data: string
          status?: 'active' | 'used' | 'expired'
          expires_at: string
          used_at?: string | null
          used_location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          merchant_id?: string
          voucher_code?: string
          qr_code_data?: string
          status?: 'active' | 'used' | 'expired'
          expires_at?: string
          used_at?: string | null
          used_location?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vouchers_merchant_id_fkey"
            columns: ["merchant_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      voucher_usage: {
        Row: {
          id: string
          voucher_id: string
          merchant_id: string
          user_id: string
          used_at: string
          location: string
          validated_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          voucher_id: string
          merchant_id: string
          user_id: string
          used_at?: string
          location: string
          validated_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          voucher_id?: string
          merchant_id?: string
          user_id?: string
          used_at?: string
          location?: string
          validated_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_usage_voucher_id_fkey"
            columns: ["voucher_id"]
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_merchant_id_fkey"
            columns: ["merchant_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_validated_by_fkey"
            columns: ["validated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_system_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          total_customers: number
          total_merchants: number
          total_offers: number
          active_offers: number
          total_vouchers: number
          used_vouchers: number
          total_categories: number
        }[]
      }
      get_monthly_usage_report: {
        Args: {
          target_month?: string
        }
        Returns: {
          month_year: string
          vouchers_generated: number
          vouchers_used: number
          unique_customers: number
          active_merchants: number
          usage_rate: number
        }[]
      }
      create_test_users: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
      clean_test_data: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
      expire_old_vouchers: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
      expire_old_coupons: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      user_type_enum: 'customer' | 'merchant'
      subscription_status_enum: 'active' | 'inactive' | 'trial'
      voucher_status_enum: 'active' | 'used' | 'expired'
      coupon_status_enum: 'active' | 'used' | 'expired'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para facilitar o uso
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

// Tipos específicos para as entidades principais
export type DbUser = Tables<'users'>
export type DbCategory = Tables<'categories'>
export type DbOffer = Tables<'offers'>
export type DbActivatedCoupon = Tables<'activated_coupons'>
export type DbVoucher = Tables<'vouchers'>
export type DbVoucherUsage = Tables<'voucher_usage'>

// Tipos para inserção
export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertOffer = Database['public']['Tables']['offers']['Insert']
export type InsertVoucher = Database['public']['Tables']['vouchers']['Insert']
export type InsertActivatedCoupon = Database['public']['Tables']['activated_coupons']['Insert']
export type InsertVoucherUsage = Database['public']['Tables']['voucher_usage']['Insert']

// Tipos para atualização
export type UpdateUser = Database['public']['Tables']['users']['Update']
export type UpdateOffer = Database['public']['Tables']['offers']['Update']
export type UpdateVoucher = Database['public']['Tables']['vouchers']['Update']
export type UpdateActivatedCoupon = Database['public']['Tables']['activated_coupons']['Update']

// Tipos para enums
export type UserType = Enums<'user_type_enum'>
export type SubscriptionStatus = Enums<'subscription_status_enum'>
export type VoucherStatus = Enums<'voucher_status_enum'>
export type CouponStatus = Enums<'coupon_status_enum'>

// Tipos para funções
export type SystemStats = Functions<'get_system_stats'>['Returns'][0]
export type MonthlyReport = Functions<'get_monthly_usage_report'>['Returns'][0]

// Tipos para joins comuns
export type OfferWithMerchant = DbOffer & {
  merchant: Pick<DbUser, 'full_name' | 'business_name' | 'contact_info'>
}

export type VoucherWithDetails = DbVoucher & {
  user: Pick<DbUser, 'full_name' | 'email'>
  merchant: Pick<DbUser, 'full_name' | 'business_name' | 'contact_info'>
}

export type ActivatedCouponWithOffer = DbActivatedCoupon & {
  offer: OfferWithMerchant
}

// Tipos para respostas da API
export type ApiResponse<T> = {
  data: T | null
  error: string | null
  success: boolean
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}