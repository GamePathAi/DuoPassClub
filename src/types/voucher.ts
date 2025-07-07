// 🎯 INTERFACE UNIFICADA PARA VOUCHERS - CORREÇÃO CRÍTICA
// Esta interface resolve as inconsistências entre VoucherDetails e VoucherActive

export interface VoucherData {
  id: string;
  user_id: string;
  code: string;
  title: string;
  business_name: string;           // ✅ Campo direto (não aninhado)
  original_price: number;
  discounted_price: number;
  image_url?: string;
  status: 'purchased' | 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string;
  used_at?: string;
  terms_conditions?: string;
  offer_id?: string;
}

// Interface para voucher ativo (VoucherActive.tsx)
export interface VoucherDetails {
  id: string;
  voucher_code: string;
  qr_code_data: string;
  status: string;
  expires_at: string;
  created_at: string;
  offer: {
    id: string;
    title: string;
    description: string;
    original_value: number;
    image_url: string;
    location: string;
    terms_conditions: string;
    merchant: {
      business_name: string;
      address: string;
      phone?: string;
      website?: string;
      description: string;
    };
  };
}

// Interface para props de componentes
export interface VoucherCardProps {
  voucher: VoucherData;
  onUse?: (voucher: VoucherData) => void;
  onView?: (voucher: VoucherData) => void;
}

// Interface estendida com offer
export interface VoucherWithOffer extends VoucherData {
  offer?: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    location: string;
    terms_conditions: string;
  };
}