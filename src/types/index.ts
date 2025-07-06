export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: 'customer' | 'merchant';
  subscription_status?: 'active' | 'inactive' | 'trial';
  subscription_expires_at?: string;
  created_at: string;
}

export interface Offer {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  original_value: number;
  category: string;
  location: string;
  city?: string;
  expires_at: string;
  is_active: boolean;
  image_url?: string;
  terms_conditions: string;
  created_at: string;
  merchant?: {
    business_name: string;
    contact_info: string;
  };
}

export interface ActivatedCoupon {
  id: string;
  user_id: string;
  offer_id: string;
  activated_at: string;
  used_at?: string;
  status: 'active' | 'used' | 'expired';
  offer?: Offer;
}

export interface Voucher {
  id: string;
  user_id: string;
  merchant_id: string;
  voucher_code: string;
  qr_code_data: string;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string;
  used_at?: string;
  used_location?: string;
  user?: {
    full_name: string;
    email: string;
  };
  merchant?: {
    business_name: string;
    contact_info: string;
  };
}

export interface VoucherUsage {
  id: string;
  voucher_id: string;
  merchant_id: string;
  user_id: string;
  used_at: string;
  location: string;
  validated_by: string;
}

export interface UsageReport {
  period: 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  total_vouchers_used: number;
  unique_customers: number;
  merchant_stats: {
    merchant_id: string;
    business_name: string;
    total_uses: number;
    unique_customers: number;
  }[];
  top_customers: {
    user_id: string;
    full_name: string;
    total_uses: number;
  }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export type Language = 'pt' | 'en';