import { supabase } from '../lib/supabaseConfig';
import { PaymentService } from './paymentService';

interface MembershipStatus {
  isActive: boolean;
  plan?: {
    id: string;
    name: string;
    max_offers_per_month: number;
    cashback_percentage: number;
  };
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  redeemCount: number;
  canRedeem: boolean;
  remainingRedeems: number;
}

interface RedeemResult {
  success: boolean;
  error?: string;
  requiresUpgrade?: boolean;
  voucherId?: string;
}

export class MembershipService {
  // Verificar status de membership do usuário
  static async checkMembershipStatus(userId: string): Promise<MembershipStatus> {
    try {
      // Buscar assinatura ativa
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .single();

      // Lógica de transição do Trial para o Gratuito
      if (subscription && subscription.status === 'trialing' && subscription.trial_end && new Date(subscription.trial_end) < new Date()) {
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({ 
            plan_id: 'free', // ID do plano gratuito
            status: 'active', 
            trial_end: null 
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Erro ao atualizar trial para plano gratuito:', updateError);
        } else {
          // Recarrega os dados da assinatura para refletir o plano gratuito
          return this.checkMembershipStatus(userId);
        }
      }

      if (!subscription) {
        return {
          isActive: false,
          redeemCount: 0,
          canRedeem: false,
          remainingRedeems: 0
        };
      }

      // Buscar plano nos dados estáticos se não encontrado no banco
      let plan = subscription.plan;
      if (!plan) {
        plan = PaymentService.SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan_id);
      }

      if (!plan) {
        return {
          isActive: false,
          redeemCount: 0,
          canRedeem: false,
          remainingRedeems: 0
        };
      }

      let redeemCount = 0;
      let maxRedeems = plan.max_offers_per_month;

      if (subscription.status === 'trialing') {
        // Lógica para Golden Week (Trial)
        maxRedeems = 4; // 4 vouchers por semana
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const { count } = await supabase
          .from('vouchers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', oneWeekAgo.toISOString());
        
        redeemCount = count || 0;

      } else {
        // Lógica para planos normais (Freemium, etc.)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const { count } = await supabase
          .from('vouchers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', startOfMonth.toISOString());

        redeemCount = count || 0;
      }

      const currentRedeems = redeemCount;
      const canRedeem = maxRedeems === -1 || currentRedeems < maxRedeems;
      const remainingRedeems = maxRedeems === -1 ? -1 : Math.max(0, maxRedeems - currentRedeems);

      return {
        isActive: true,
        plan: {
          id: plan.id,
          name: plan.name,
          max_offers_per_month: plan.max_offers_per_month,
          cashback_percentage: plan.cashback_percentage
        },
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        redeemCount: currentRedeems,
        canRedeem,
        remainingRedeems
      };
    } catch (error) {
      console.error('Erro ao verificar status de membership:', error);
      return {
        isActive: false,
        redeemCount: 0,
        canRedeem: false,
        remainingRedeems: 0
      };
    }
  }

  // Tentar resgatar uma oferta
  static async redeemOffer(userId: string, offerId: string): Promise<RedeemResult> {
    try {
      // Verificar status de membership
      const membershipStatus = await this.checkMembershipStatus(userId);

      if (!membershipStatus.isActive) {
        return {
          success: false,
          error: 'Assinatura inativa',
          requiresUpgrade: true
        };
      }

      if (!membershipStatus.canRedeem) {
        return {
          success: false,
          error: `Limite de ${membershipStatus.plan?.max_offers_per_month} resgates por mês atingido`,
          requiresUpgrade: true
        };
      }

      // Buscar dados da oferta
      const { data: offer } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (!offer) {
        return {
          success: false,
          error: 'Oferta não encontrada'
        };
      }

      if (!offer.is_active) {
        return {
          success: false,
          error: 'Oferta não está mais ativa'
        };
      }

      // Verificar se a oferta não expirou
      if (offer.expires_at && new Date(offer.expires_at) < new Date()) {
        return {
          success: false,
          error: 'Oferta expirada'
        };
      }

      // Verificar se o usuário já resgatou esta oferta
      const { data: existingVoucher } = await supabase
        .from('vouchers')
        .select('*')
        .eq('user_id', userId)
        .eq('offer_id', offerId)
        .eq('status', 'active')
        .single();

      if (existingVoucher) {
        return {
          success: false,
          error: 'Você já resgatou esta oferta'
        };
      }

      // Gerar código único para o voucher
      const voucherCode = this.generateVoucherCode();
      const qrCodeData = JSON.stringify({
        voucherId: voucherCode,
        userId,
        offerId,
        timestamp: new Date().toISOString()
      });

      // Criar voucher
      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .insert({
          user_id: userId,
          offer_id: offerId,
          merchant_id: offer.merchant_id,
          voucher_code: voucherCode,
          qr_code_data: qrCodeData,
          status: 'active',
          expires_at: offer.expires_at,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (voucherError) {
        console.error('Erro ao criar voucher:', voucherError);
        return {
          success: false,
          error: 'Erro ao gerar voucher'
        };
      }

      // Processar cashback se aplicável
      if (membershipStatus.plan?.cashback_percentage > 0) {
        await PaymentService.processCashback(userId, offerId, offer.original_value);
      }

      return {
        success: true,
        voucherId: voucher.id
      };
    } catch (error) {
      console.error('Erro ao resgatar oferta:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Gerar código único para voucher
  private static generateVoucherCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `DUO-${timestamp}-${random}`.toUpperCase();
  }

  // Verificar se usuário pode acessar funcionalidade premium
  static async canAccessPremiumFeature(userId: string, feature: string): Promise<boolean> {
    try {
      const membershipStatus = await this.checkMembershipStatus(userId);
      
      if (!membershipStatus.isActive) {
        return false;
      }

      // Definir quais features são premium por plano
      const premiumFeatures = {
        'basic': ['favorites', 'basic_support'],
        'premium': ['favorites', 'basic_support', 'priority_support', 'exclusive_offers', 'early_access'],
        'vip': ['favorites', 'basic_support', 'priority_support', 'exclusive_offers', 'early_access', 'vip_events', 'dedicated_manager']
      };

      const planFeatures = premiumFeatures[membershipStatus.plan?.id as keyof typeof premiumFeatures] || [];
      return planFeatures.includes(feature);
    } catch (error) {
      console.error('Erro ao verificar acesso a feature premium:', error);
      return false;
    }
  }

  // Obter estatísticas de uso do mês
  static async getMonthlyUsageStats(userId: string): Promise<{
    redeemCount: number;
    maxRedeems: number;
    cashbackEarned: number;
    favoriteOffers: number;
  }> {
    try {
      const membershipStatus = await this.checkMembershipStatus(userId);
      
      // Buscar cashback do mês
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data: cashbacks } = await supabase
        .from('cashback_transactions')
        .select('amount')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      const cashbackEarned = cashbacks?.reduce((total, cb) => total + cb.amount, 0) || 0;

      // Buscar ofertas favoritas
      const { count: favoriteCount } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      return {
        redeemCount: membershipStatus.redeemCount,
        maxRedeems: membershipStatus.plan?.max_offers_per_month || 0,
        cashbackEarned,
        favoriteOffers: favoriteCount || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de uso:', error);
      return {
        redeemCount: 0,
        maxRedeems: 0,
        cashbackEarned: 0,
        favoriteOffers: 0
      };
    }
  }
}