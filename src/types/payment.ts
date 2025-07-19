export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  provider: string;
  last_four?: string;
  brand?: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_offers_per_month: number;
  cashback_percentage: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending' | 'trialing';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
  trial_end?: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'cashback' | 'refund' | 'bonus' | 'purchase';
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payment_method_id?: string;
  subscription_id?: string;
  offer_id?: string;
  metadata?: Record<string, string | number | boolean>;
  gateway_transaction_id?: string;
  gateway_response?: Record<string, string | number | boolean>;
  created_at: string;
  completed_at?: string;
  failed_at?: string;
  payment_method?: PaymentMethod;
}

export interface CashbackTransaction {
  id: string;
  user_id: string;
  offer_id: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string;
  approved_at?: string;
  paid_at?: string;
  offer?: {
    title: string;
    merchant?: {
      business_name: string;
    };
  };
}

export interface PaymentGatewayConfig {
  provider: 'stripe' | 'mercadopago' | 'pagseguro' | 'cielo' | 'getnet';
  public_key: string;
  private_key: string;
  webhook_secret: string;
  environment: 'sandbox' | 'production';
  enabled: boolean;
}

export interface PixPayment {
  id: string;
  transaction_id: string;
  qr_code: string;
  qr_code_base64?: string;
  pix_key: string;
  amount: number;
  description: string;
  expires_at: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paid_at?: string;
  created_at: string;
}

export interface PaymentWebhook {
  id: string;
  provider: string;
  event_type: string;
  transaction_id: string;
  payload: Record<string, string | number | boolean>;
  processed: boolean;
  processed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface RefundRequest {
  id: string;
  transaction_id: string;
  user_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  admin_notes?: string;
  processed_by?: string;
  created_at: string;
  processed_at?: string;
}

export interface PaymentStats {
  total_revenue: number;
  monthly_revenue: number;
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  pending_transactions: number;
  total_cashback_paid: number;
  active_subscriptions: number;
  cancelled_subscriptions: number;
  average_transaction_value: number;
  top_payment_methods: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
  revenue_by_plan: Array<{
    plan_id: string;
    plan_name: string;
    revenue: number;
    subscribers: number;
  }>;
}

export interface PaymentFormData {
  payment_method: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
  card_number?: string;
  card_holder_name?: string;
  card_expiry?: string;
  card_cvv?: string;
  save_card?: boolean;
  pix_email?: string;
  bank_account?: string;
  cpf?: string;
}

export interface PaymentValidation {
  is_valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface PaymentReceipt {
  id: string;
  transaction_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  plan_name?: string;
  billing_cycle?: string;
  issued_at: string;
  pdf_url?: string;
}

// Enums para melhor tipagem
export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum TransactionType {
  SUBSCRIPTION = 'subscription',
  CASHBACK = 'cashback',
  REFUND = 'refund',
  BONUS = 'bonus',
  PURCHASE = 'purchase'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum CashbackStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}