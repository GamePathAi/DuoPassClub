import { supabase } from '../lib/supabaseConfig';
import { GamificationService } from './gamificationService';
import { NotificationService } from './notificationService';

interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  provider: string;
  last_four?: string;
  brand?: string;
  is_default: boolean;
  created_at: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_offers_per_month: number;
  cashback_percentage: number;
  is_active: boolean;
}

interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'cashback' | 'refund' | 'bonus';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method_id?: string;
  subscription_id?: string;
  metadata?: Record<string, string | number | boolean>;
  created_at: string;
  completed_at?: string;
}

interface CashbackTransaction {
  id: string;
  user_id: string;
  offer_id: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  paid_at?: string;
}

export class PaymentService {
  // 🔒 Configurações protegidas - Não modificar
  private static readonly _0x1a2b = import.meta.env.PROD;
  private static readonly _0x2c3d = !import.meta.env.DEV;
  
  // Planos de assinatura predefinidos
  static readonly SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Perfeito para começar',
      price_monthly: 19.90,
      price_yearly: 199.00,
      features: [
        'Até 10 ofertas por mês',
        '2% de cashback',
        'Suporte por email',
        'Acesso a ofertas básicas'
      ],
      max_offers_per_month: 10,
      cashback_percentage: 2,
      is_active: true
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Mais economia e benefícios',
      price_monthly: 39.90,
      price_yearly: 399.00,
      features: [
        'Ofertas ilimitadas',
        '5% de cashback',
        'Suporte prioritário',
        'Ofertas exclusivas',
        'Acesso antecipado'
      ],
      max_offers_per_month: -1, // Ilimitado
      cashback_percentage: 5,
      is_active: true
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Experiência completa',
      price_monthly: 79.90,
      price_yearly: 799.00,
      features: [
        'Ofertas ilimitadas',
        '10% de cashback',
        'Suporte 24/7',
        'Ofertas VIP exclusivas',
        'Gerente de conta dedicado',
        'Eventos exclusivos'
      ],
      max_offers_per_month: -1,
      cashback_percentage: 10,
      is_active: true
    }
  ];

  // Criar assinatura
  static async createSubscription(
    userId: string,
    planId: string,
    paymentMethodId: string,
    billingCycle: 'monthly' | 'yearly'
  ): Promise<{ success: boolean; subscription?: { id: string; user_id: string; plan_id: string; status: string }; error?: string }> {
    try {
      const plan = this.SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return { success: false, error: 'Plano não encontrado' };
      }

      const amount = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
      
      // Criar transação de pagamento
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: userId,
          amount,
          currency: 'CHF',
          type: 'subscription',
          status: 'pending',
          payment_method_id: paymentMethodId,
          metadata: {
            plan_id: planId,
            billing_cycle: billingCycle
          },
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (transactionError) {
        return { success: false, error: 'Erro ao criar transação' };
      }

      // Simular processamento do pagamento
      const paymentResult = await this.processPayment(transaction.id, paymentMethodId, amount);
      
      if (!paymentResult.success) {
        return { success: false, error: paymentResult.error };
      }

      // Criar/atualizar assinatura
      const expiresAt = new Date();
      if (billingCycle === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
          current_period_end: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (subscriptionError) {
        return { success: false, error: 'Erro ao criar assinatura' };
      }

      // Atualizar status do usuário
      await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString()
        })
        .eq('id', userId);

      // Adicionar pontos de bônus
      await GamificationService.addPoints(
        userId,
        billingCycle === 'yearly' ? 500 : 200,
        'bonus',
        `Bônus de assinatura ${plan.name} ${billingCycle === 'yearly' ? 'anual' : 'mensal'}! 🎉`
      );

      // Notificar usuário
      await NotificationService.create({
        user_id: userId,
        type: 'payment',
        title: '🎉 Assinatura ativada!',
        message: `Sua assinatura ${plan.name} está ativa. Aproveite todos os benefícios!`
      });

      return { success: true, subscription };
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  // Processar pagamento (simulado)
  private static async processPayment(
    transactionId: string,
    paymentMethodId: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validar valor mínimo
      if (amount <= 0) {
        await this.updateTransactionStatus(transactionId, 'failed');
        return { success: false, error: 'Valor inválido' };
      }

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Buscar método de pagamento
      const { data: paymentMethod } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', paymentMethodId)
        .single();

      if (!paymentMethod) {
        await this.updateTransactionStatus(transactionId, 'failed');
        return { success: false, error: 'Método de pagamento não encontrado' };
      }

      // Simular diferentes cenários baseados no tipo
      let success = true;
      let error = '';

      switch (paymentMethod.type) {
        case 'pix':
          // PIX tem alta taxa de sucesso
          success = Math.random() > 0.05; // 95% de sucesso
          error = success ? '' : 'PIX expirado ou cancelado';
          break;
        
        case 'credit_card':
          // Cartão de crédito pode falhar por vários motivos
          success = Math.random() > 0.1; // 90% de sucesso
          error = success ? '' : 'Cartão recusado';
          break;
        
        case 'debit_card':
          // Débito pode falhar por saldo insuficiente
          success = Math.random() > 0.15; // 85% de sucesso
          error = success ? '' : 'Saldo insuficiente';
          break;
        
        default:
          success = Math.random() > 0.2; // 80% de sucesso
          error = success ? '' : 'Erro no processamento';
      }

      const status = success ? 'completed' : 'failed';
      await this.updateTransactionStatus(transactionId, status);

      return { success, error };
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      await this.updateTransactionStatus(transactionId, 'failed');
      return { success: false, error: 'Erro no processamento do pagamento' };
    }
  }

  // Atualizar status da transação
  private static async updateTransactionStatus(
    transactionId: string,
    status: PaymentTransaction['status']
  ): Promise<void> {
    const updateData: { status: PaymentTransaction['status']; completed_at?: string } = { status };
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('id', transactionId);
  }

  // Adicionar método de pagamento
  static async addPaymentMethod(
    userId: string,
    type: PaymentMethod['type'],
    provider: string,
    metadata: Record<string, string | number | boolean>
  ): Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }> {
    try {
      const { data: paymentMethod, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          type,
          provider,
          last_four: metadata.last_four,
          brand: metadata.brand,
          is_default: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Erro ao adicionar método de pagamento' };
      }

      return { success: true, paymentMethod };
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  // Calcular e processar cashback
  static async processCashback(
    userId: string,
    offerId: string,
    offerValue: number
  ): Promise<void> {
    try {
      // Buscar assinatura do usuário
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        console.log('Usuário sem assinatura ativa, sem cashback');
        return;
      }

      const plan = this.SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan_id);
      if (!plan) {
        console.error('Plano não encontrado');
        return;
      }

      const cashbackPercentage = plan.cashback_percentage;
      const cashbackAmount = (offerValue * cashbackPercentage) / 100;

      // Criar transação de cashback
      const { error: cashbackError } = await supabase
        .from('cashback_transactions')
        .insert({
          user_id: userId,
          offer_id: offerId,
          amount: cashbackAmount,
          percentage: cashbackPercentage,
          status: 'approved',
          created_at: new Date().toISOString()
        });

      if (cashbackError) {
        console.error('Erro ao criar transação de cashback:', cashbackError);
        return;
      }

      // Adicionar pontos equivalentes ao cashback
      const pointsFromCashback = Math.round(cashbackAmount * 10); // CHF 1 = 10 pontos
      await GamificationService.addPoints(
        userId,
        pointsFromCashback,
        'cashback',
        `Cashback de ${cashbackPercentage}% recebido! 💰`,
        {
          offer_id: offerId,
          cashback_amount: cashbackAmount,
          cashback_percentage: cashbackPercentage
        }
      );

      // Notificar usuário
      await NotificationService.create({
        user_id: userId,
        type: 'cashback',
        title: '💰 Cashback recebido!',
        message: `Você recebeu CHF ${(cashbackAmount * 0.18).toFixed(2)} de cashback (${cashbackPercentage}%)`
      });
    } catch (error) {
      console.error('Erro ao processar cashback:', error);
    }
  }

  // Gerar QR Code PIX
  static generatePixQRCode(
    amount: number,
    description: string,
    merchantKey: string = 'duopass@exemplo.com'
  ): string {
    // Implementação simplificada do PIX QR Code
    // Em produção, usar biblioteca específica ou API do banco
    const pixData = {
      version: '01',
      initMethod: '12',
      merchantAccount: merchantKey,
      merchantCategory: '0000',
      currency: '756', // CHF
      amount: amount.toFixed(2),
      country: 'BR',
      merchantName: 'DUOPASS CLUB',
      merchantCity: 'SAO PAULO',
      description: description.substring(0, 25)
    };

    // Simular geração do código PIX
    const pixCode = `00020126${pixData.initMethod}${pixData.merchantAccount}${pixData.merchantCategory}5303${pixData.currency}54${pixData.amount.length.toString().padStart(2, '0')}${pixData.amount}5802${pixData.country}59${pixData.merchantName.length.toString().padStart(2, '0')}${pixData.merchantName}60${pixData.merchantCity.length.toString().padStart(2, '0')}${pixData.merchantCity}62${pixData.description.length.toString().padStart(2, '0')}${pixData.description}6304`;
    
    // Calcular CRC16 (simplificado)
    const crc = this.calculateCRC16(pixCode);
    
    return pixCode + crc;
  }

  // Calcular CRC16 para PIX (simplificado)
  private static calculateCRC16(data: string): string {
    // Implementação simplificada - em produção usar biblioteca adequada
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  // Buscar histórico de pagamentos
  static async getPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
    try {
      const { data: transactions } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          payment_method:payment_methods(type, brand, last_four)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return transactions || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de pagamentos:', error);
      return [];
    }
  }

  // Buscar histórico de cashback
  static async getCashbackHistory(userId: string): Promise<CashbackTransaction[]> {
    try {
      const { data: cashbacks } = await supabase
        .from('cashback_transactions')
        .select(`
          *,
          offer:offers(title, merchant:merchants(business_name))
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return cashbacks || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de cashback:', error);
      return [];
    }
  }

  // Cancelar assinatura
  static async cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: 'Erro ao cancelar assinatura' };
      }

      // Atualizar status do usuário
      await supabase
        .from('users')
        .update({
          subscription_status: 'inactive'
        })
        .eq('id', userId);

      // Notificar usuário
      await NotificationService.create({
        user_id: userId,
        type: 'subscription',
        title: '📋 Assinatura cancelada',
        message: 'Sua assinatura foi cancelada. Você ainda pode usar os benefícios até o final do período pago.'
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  // Verificar status da assinatura
  static async checkSubscriptionStatus(userId: string): Promise<{ subscription?: { id: string; user_id: string; plan_id: string; status: string; plan?: { id: string; name: string; price: number } }; isActive: boolean; error?: string }> {
    try {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .single();

      return subscription;
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      return null;
    }
  }
}