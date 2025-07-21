// types/index.ts - Tipos atualizados para integração com Supabase

export interface User {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  cultural_interests?: string[];
  onboarding_completed?: boolean;
  terms_accepted?: boolean; // Adicionado para rastrear aceite de termos
  // Outros campos do usuário conforme necessário
}

export interface Merchant {
  id: string;
  business_name: string;
  contact_info?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  created_at: string;
  updated_at?: string;
}

export interface Offer {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  original_value: number;
  discounted_value?: number;
  discount_percentage?: number;
  category: string;
  location?: string;
  city: string;
  expires_at: string;
  is_active: boolean;
  image_url?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at?: string;
  // Relacionamento com merchant
  merchant?: Merchant;
  tier?: 'Golden' | 'Premium' | 'Freemium'; // Nível da oferta para a estratégia Trial -> Freemium
}

export interface Voucher {
  id: string;
  user_id: string;
  offer_id?: string;
  code: string;
  title: string;
  business_name: string;
  original_price: number;
  discounted_price: number;
  image_url?: string;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string;
  used_at?: string;
  terms_conditions?: string;
  // Campos adicionais para QR code
  qr_code_data?: string;
  // Relacionamento opcional com offer
  offer?: Offer;
}

export interface VoucherWithOffer extends Voucher {
  offer: Offer;
}

export type NotificationType = 'offer_new' | 'offer_expiring' | 'voucher_redeemed' | 'voucher_available' | 'voucher_expiring' | 'achievement_unlocked' | 'level_up' | 'goal_reached' | 'system_update' | 'profile_reminder' | 'business_performance' | 'offer_management' | 'business_opportunity' | 'system_merchant' | 'payment_processed';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  action_url?: string;
  action_text?: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

// Tipos para estatísticas
export interface VoucherStats {
  total: number;
  active: number;
  used: number;
  expired: number;
}

// Tipos para filtros
export type VoucherFilter = 'all' | 'active' | 'used' | 'expired';
export type VoucherStatus = 'active' | 'used' | 'expired';

// Tipos para respostas da API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Tipos para formulários
export interface CreateVoucherForm {
  offer_id: string;
  user_id: string;
  expires_at?: string;
}

export interface UpdateVoucherForm {
  status?: VoucherStatus;
  used_at?: string;
}

// Tipos para contexto de autenticação
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Tipos para configuração do Supabase
export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Tipos para erros customizados
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// Tipos para navegação
export interface RouteParams {
  id?: string;
  code?: string;
}

// Tipos para componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface VoucherCardProps extends ComponentProps {
  voucher: Voucher;
  onUse?: (voucher: Voucher) => void;
  onView?: (voucher: Voucher) => void;
  onDelete?: (voucher: Voucher) => void;
}

export interface LoadingProps extends ComponentProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ErrorProps extends ComponentProps {
  error: string | AppError;
  onRetry?: () => void;
}

// Utilitários para verificação de tipos
export function isVoucherExpired(voucher: Voucher): boolean {
  return new Date(voucher.expires_at) <= new Date();
}

export function isVoucherUsed(voucher: Voucher): boolean {
  return voucher.status === 'used';
}

export function isVoucherActive(voucher: Voucher): boolean {
  return voucher.status === 'active' && !isVoucherExpired(voucher);
}

export function getVoucherStatusColor(status: VoucherStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'used':
      return 'text-blue-600 bg-blue-100';
    case 'expired':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getVoucherStatusText(status: VoucherStatus): string {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'used':
      return 'Usado';
    case 'expired':
      return 'Expirado';
    default:
      return 'Desconhecido';
  }
}

export function formatPrice(price: number): string {
  return `CHF ${price.toFixed(2)}`;
}

// Tipos para internacionalização
export type Language = 'pt' | 'en' | 'fr' | 'de' | 'it' | 'es';

export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  return Math.round((1 - discountedPrice / originalPrice) * 100);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}