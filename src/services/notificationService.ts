import { supabase } from '../lib/supabase';
import { supabase } from '../lib/supabaseConfig';
import { NotificationInput } from '../hooks/useNotifications';
// import { NotificationType } from '../types/notification';

export interface DemoNotificationData {
  type: string;
  title: string;
  message: string;
  icon?: string;
  action_url?: string;
  action_text?: string;
}

// interface NotificationData {
//   user_id: string;
//   type: NotificationType;
//   title: string;
//   message: string;
//   icon?: string;
//   action_url?: string;
//   action_text?: string;
// }

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'in_app';
  category: 'marketing' | 'transactional' | 'system' | 'promotional';
  subject?: string;
  title?: string;
  body: string;
  variables: string[];
  design_config?: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    layout: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  template_id: string;
  target_audience: {
    user_segments: string[];
    filters: Record<string, string | number | boolean>;
    estimated_reach: number;
  };
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    send_at?: string;
    timezone?: string;
    recurring_pattern?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      days_of_week?: number[];
      time: string;
    };
  };
  personalization: {
    enabled: boolean;
    rules: Array<{
      condition: string;
      variable: string;
      value: string;
    }>;
  };
  ab_test?: {
    enabled: boolean;
    variants: Array<{
      name: string;
      template_id: string;
      traffic_percentage: number;
    }>;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    unsubscribed: number;
    bounced: number;
  };
  created_at: string;
  updated_at: string;
}

export interface NotificationDelivery {
  id: string;
  campaign_id?: string;
  template_id: string;
  user_id: string;
  type: 'email' | 'push' | 'sms' | 'in_app';
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  content: {
    subject?: string;
    title?: string;
    body: string;
    action_url?: string;
  };
  metadata: Record<string, string | number | boolean>;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  error_message?: string;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: {
    marketing: boolean;
    transactional: boolean;
    system: boolean;
    promotional: boolean;
  };
  push_notifications: {
    marketing: boolean;
    transactional: boolean;
    system: boolean;
    promotional: boolean;
    location_based: boolean;
  };
  sms_notifications: {
    transactional: boolean;
    promotional: boolean;
  };
  frequency_limits: {
    max_daily_marketing: number;
    max_weekly_promotional: number;
  };
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
    timezone: string;
  };
  updated_at: string;
}

export interface NotificationAnalytics {
  campaign_id: string;
  metrics: {
    sent: number;
    delivered: number;
    delivery_rate: number;
    opened: number;
    open_rate: number;
    clicked: number;
    click_rate: number;
    converted: number;
    conversion_rate: number;
    unsubscribed: number;
    unsubscribe_rate: number;
    bounced: number;
    bounce_rate: number;
  };
  performance_by_time: Record<string, number>;
  performance_by_segment: Record<string, { sent: number; opened: number; clicked: number; converted: number }>;
  device_breakdown: Record<string, number>;
  location_breakdown: Record<string, number>;
  revenue_attribution: number;
}

export interface SmartNotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    event: string;
    conditions: Record<string, string | number | boolean>;
    delay_minutes?: number;
  };
  target_criteria: {
    user_segments: string[];
    behavioral_filters: Record<string, string | number | boolean>;
    exclusion_rules: string[];
  };
  content_rules: {
    template_selection: 'fixed' | 'dynamic' | 'ab_test';
    template_id?: string;
    dynamic_rules?: Array<{
      condition: string;
      template_id: string;
    }>;
  };
  frequency_control: {
    max_per_day: number;
    max_per_week: number;
    cooldown_hours: number;
  };
  optimization: {
    send_time_optimization: boolean;
    content_optimization: boolean;
    frequency_optimization: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Demo notifications for customers
const customerDemoNotifications: DemoNotificationData[] = [
  {
    type: 'offer_new',
    title: 'Nova oferta disponível!',
    message: '🎁 40% OFF Hambúrguer Gourmet na Burger House - Válida até meia-noite!',
    action_url: '/offers',
    action_text: 'Ver Oferta'
  },
  {
    type: 'voucher_redeemed',
    title: 'Voucher resgatado com sucesso!',
    message: '💰 Parabéns! Você economizou R$ 25,00 na Pizzaria Italiana',
    action_url: '/vouchers',
    action_text: 'Ver Vouchers'
  },
  {
    type: 'achievement_unlocked',
    title: 'Conquista desbloqueada!',
    message: '🏆 Incrível! Você resgatou 10 ofertas este mês e desbloqueou o badge "Explorador"',
    action_url: '/profile',
    action_text: 'Ver Perfil'
  },
  {
    type: 'system_update',
    title: 'Complete seu perfil',
    message: '📱 Adicione mais informações ao seu perfil para receber ofertas personalizadas',
    action_url: '/profile',
    action_text: 'Completar'
  },
  {
    type: 'voucher_expiring',
    title: 'Voucher expirando!',
    message: '⏰ Seu voucher de academia expira amanhã - use agora e economize R$ 50,00!',
    action_url: '/vouchers',
    action_text: 'Usar Agora'
  },
  {
    type: 'level_up',
    title: 'Nível UP!',
    message: '⭐ Parabéns! Agora você é membro Bronze e tem acesso a ofertas exclusivas',
    action_url: '/profile',
    action_text: 'Ver Benefícios'
  },
  {
    type: 'goal_reached',
    title: 'Meta alcançada!',
    message: '🎯 Fantástico! Você economizou R$ 200,00 este mês com o DuoPass Club',
    action_url: '/history',
    action_text: 'Ver Histórico'
  }
];

// Demo notifications for merchants
const merchantDemoNotifications: DemoNotificationData[] = [
  {
    type: 'business_performance',
    title: 'Excelente performance!',
    message: '📊 Parabéns! 22 clientes resgataram suas ofertas hoje - 45% acima da média',
    action_url: '/merchant/dashboard',
    action_text: 'Ver Dashboard'
  },
  {
    type: 'offer_management',
    title: 'Oferta expirando',
    message: '💼 Sua oferta "Desconto 30% Pizza" expira em 24 horas',
    action_url: '/merchant/offers',
    action_text: 'Gerenciar Ofertas'
  },
  {
    type: 'business_opportunity',
    title: 'Oportunidade de negócio',
    message: '🎯 45 clientes visualizaram seu estabelecimento hoje - considere criar uma oferta especial',
    action_url: '/merchant/offers/new',
    action_text: 'Criar Oferta'
  },
  {
    type: 'system_merchant',
    title: 'Novos relatórios disponíveis',
    message: '⚙️ Acesse os novos relatórios de performance e analytics avançados',
    action_url: '/merchant/analytics',
    action_text: 'Ver Relatórios'
  },
  {
    type: 'payment_processed',
    title: 'Pagamento processado',
    message: '💳 Pagamento de R$ 850,00 referente às ofertas de março foi processado',
    action_url: '/merchant/payments',
    action_text: 'Ver Detalhes'
  },
  {
    type: 'business_opportunity',
    title: 'Dica de conversão',
    message: '💡 Ofertas de fim de semana têm 60% mais conversão - que tal criar uma promoção especial?',
    action_url: '/merchant/offers/new',
    action_text: 'Criar Promoção'
  },
  {
    type: 'business_performance',
    title: 'Novos favoritos',
    message: '🌟 25 clientes favoritaram seu estabelecimento esta semana!',
    action_url: '/merchant/customers',
    action_text: 'Ver Clientes'
  }
];

// Templates predefinidos
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'welcome_email',
    name: 'Email de Boas-vindas',
    type: 'email',
    category: 'transactional',
    subject: 'Bem-vindo ao DuoPass Club, {{user_name}}!',
    body: `
      <h1>Olá {{user_name}}, bem-vindo ao DuoPass Club!</h1>
      <p>Estamos muito felizes em tê-lo conosco. Agora você tem acesso a ofertas exclusivas dos melhores estabelecimentos da sua cidade.</p>
      <h2>Primeiros Passos:</h2>
      <ul>
        <li>Complete seu perfil para receber ofertas personalizadas</li>
        <li>Explore as ofertas disponíveis na sua região</li>
        <li>Baixe nosso app para não perder nenhuma oportunidade</li>
      </ul>
      <p>Como bônus de boas-vindas, você ganhou <strong>{{welcome_points}} pontos</strong>!</p>
      <a href="{{app_download_url}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Baixar App</a>
    `,
    variables: ['user_name', 'welcome_points', 'app_download_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'offer_nearby_push',
    name: 'Oferta Próxima - Push',
    type: 'push',
    category: 'promotional',
    title: '🎯 Oferta próxima a você!',
    body: '{{offer_title}} em {{merchant_name}} - apenas {{distance}}m de distância. {{discount}}% OFF!',
    variables: ['offer_title', 'merchant_name', 'distance', 'discount'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'points_milestone_push',
    name: 'Marco de Pontos - Push',
    type: 'push',
    category: 'system',
    title: '🎉 Parabéns! Novo marco alcançado!',
    body: 'Você acumulou {{total_points}} pontos e subiu para o nível {{new_level}}! Continue assim!',
    variables: ['total_points', 'new_level'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'subscription_reminder_email',
    name: 'Lembrete de Assinatura',
    type: 'email',
    category: 'transactional',
    subject: 'Sua assinatura DuoPass vence em {{days_until_expiry}} dias',
    body: `
      <h1>Olá {{user_name}},</h1>
      <p>Sua assinatura {{plan_name}} vence em <strong>{{days_until_expiry}} dias</strong>.</p>
      <p>Para continuar aproveitando todos os benefícios exclusivos, renove sua assinatura agora:</p>
      <ul>
        <li>Ofertas exclusivas para assinantes</li>
        <li>Pontos em dobro em todas as compras</li>
        <li>Acesso antecipado a promoções</li>
        <li>Suporte prioritário</li>
      </ul>
      <a href="{{renewal_url}}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Renovar Assinatura</a>
    `,
    variables: ['user_name', 'days_until_expiry', 'plan_name', 'renewal_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'winback_email',
    name: 'Email de Reativação',
    type: 'email',
    category: 'marketing',
    subject: 'Sentimos sua falta! Oferta especial para você 💙',
    body: `
      <h1>Olá {{user_name}}, sentimos sua falta!</h1>
      <p>Notamos que você não visita o DuoPass há {{days_inactive}} dias. Que tal voltar com uma oferta especial?</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #007bff;">🎁 Oferta Especial de Volta</h2>
        <p><strong>{{discount_percentage}}% de desconto</strong> na sua próxima compra</p>
        <p>Válido até {{offer_expiry}}</p>
      </div>
      <p>Além disso, você ganha <strong>{{bonus_points}} pontos bônus</strong> só por voltar!</p>
      <a href="{{return_url}}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Aproveitar Oferta</a>
    `,
    variables: ['user_name', 'days_inactive', 'discount_percentage', 'offer_expiry', 'bonus_points', 'return_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'merchant_approval_email',
    name: 'Aprovação de Parceiro',
    type: 'email',
    category: 'transactional',
    subject: 'Parabéns! Sua parceria foi aprovada 🎉',
    body: `
      <h1>Parabéns {{merchant_name}}!</h1>
      <p>Sua solicitação de parceria foi aprovada. Agora você faz parte da rede DuoPass Club!</p>
      <h2>Próximos Passos:</h2>
      <ol>
        <li>Acesse seu painel de parceiro</li>
        <li>Configure seu perfil e informações</li>
        <li>Crie sua primeira oferta</li>
        <li>Comece a atrair novos clientes</li>
      </ol>
      <p>Seu consultor dedicado é <strong>{{consultant_name}}</strong> ({{consultant_email}}).</p>
      <a href="{{partner_dashboard_url}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Acessar Painel</a>
    `,
    variables: ['merchant_name', 'consultant_name', 'consultant_email', 'partner_dashboard_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class NotificationService {
  // Create a notification
  static async createNotification(notificationData: NotificationInput): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([notificationData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create multiple notifications
  static async createBulkNotifications(notifications: NotificationInput[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Generate demo notifications for a user
  static async generateDemoNotifications(userId: string, userType: 'client' | 'merchant'): Promise<void> {
    const demoData = userType === 'client' ? customerDemoNotifications : merchantDemoNotifications;
    
    // Select 3-5 random notifications
    const shuffled = [...demoData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
    
    const notifications: NotificationInput[] = selected.map((demo) => ({
      user_id: userId,
      type: demo.type,
      title: demo.title,
      message: demo.message,
      icon: demo.icon,
      action_url: demo.action_url,
      action_text: demo.action_text
    }));

    await this.createBulkNotifications(notifications);
  }

  // Notification templates for different events
  static async notifyOfferRedeemed(userId: string, offerTitle: string, savings: number): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'voucher_redeemed',
      title: 'Voucher resgatado!',
      message: `💰 Parabéns! Você economizou R$ ${savings.toFixed(2)} com "${offerTitle}"`,
      action_url: '/vouchers',
      action_text: 'Ver Vouchers'
    });
  }

  static async notifyNewOffer(userId: string, offerTitle: string, discount: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'offer_new',
      title: 'Nova oferta disponível!',
      message: `🎁 ${discount} em ${offerTitle} - Não perca!`,
      action_url: '/offers',
      action_text: 'Ver Oferta'
    });
  }

  static async notifyOfferExpiring(userId: string, offerTitle: string, hoursLeft: number): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'offer_expiring',
      title: 'Oferta expirando!',
      message: `⏰ "${offerTitle}" expira em ${hoursLeft} horas`,
      action_url: '/offers',
      action_text: 'Resgatar Agora'
    });
  }

  static async notifyMerchantOfferRedeemed(merchantId: string, offerTitle: string, count: number): Promise<void> {
    await this.createNotification({
      user_id: merchantId,
      type: 'business_performance',
      title: 'Oferta resgatada!',
      message: `📊 Sua oferta "${offerTitle}" foi resgatada ${count} vezes hoje`,
      action_url: '/merchant/dashboard',
      action_text: 'Ver Dashboard'
    });
  }

  static async notifyMerchantOfferExpiring(merchantId: string, offerTitle: string, hoursLeft: number): Promise<void> {
    await this.createNotification({
      user_id: merchantId,
      type: 'offer_management',
      title: 'Oferta expirando',
      message: `💼 Sua oferta "${offerTitle}" expira em ${hoursLeft} horas`,
      action_url: '/merchant/offers',
      action_text: 'Gerenciar Ofertas'
    });
  }

  static async notifyAchievementUnlocked(userId: string, achievementName: string, description: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'achievement_unlocked',
      title: 'Conquista desbloqueada!',
      message: `🏆 ${achievementName}: ${description}`,
      action_url: '/profile',
      action_text: 'Ver Perfil'
    });
  }

  static async notifyLevelUp(userId: string, newLevel: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'level_up',
      title: 'Nível UP!',
      message: `⭐ Parabéns! Agora você é membro ${newLevel}`,
      action_url: '/profile',
      action_text: 'Ver Benefícios'
    });
  }

  // Clean old notifications (older than 30 days)
  static async cleanOldNotifications(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;
    } catch (error) {
      console.error('Error cleaning old notifications:', error);
    }
  }

  // ===== FUNCIONALIDADES AVANÇADAS =====

  // Gerenciamento de Templates
  static async createTemplate(templateData: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationTemplate> {
    try {
      const template: NotificationTemplate = {
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Criando template de notificação:', template);
      return template;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      throw error;
    }
  }

  static async getTemplates(filters?: { type?: string; category?: string; is_active?: boolean }): Promise<NotificationTemplate[]> {
    try {
      let templates = [...NOTIFICATION_TEMPLATES];

      if (filters) {
        if (filters.type) templates = templates.filter(t => t.type === filters.type);
        if (filters.category) templates = templates.filter(t => t.category === filters.category);
        if (filters.is_active !== undefined) templates = templates.filter(t => t.is_active === filters.is_active);
      }

      return templates;
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      throw error;
    }
  }

  static async updateTemplate(templateId: string, updates: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    try {
      const template = NOTIFICATION_TEMPLATES.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template não encontrado');
      }

      const updatedTemplate = {
        ...template,
        ...updates,
        updated_at: new Date().toISOString()
      };

      console.log('Atualizando template:', updatedTemplate);
      return updatedTemplate;
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      throw error;
    }
  }

  // Gerenciamento de Campanhas
  static async createCampaign(campaignData: Omit<NotificationCampaign, 'id' | 'metrics' | 'created_at' | 'updated_at'>): Promise<NotificationCampaign> {
    try {
      const campaign: NotificationCampaign = {
        id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...campaignData,
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          unsubscribed: 0,
          bounced: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Criando campanha de notificação:', campaign);
      return campaign;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  }

  static async getCampaigns(filters?: { status?: string; type?: string }): Promise<NotificationCampaign[]> {
    try {
      // Simular dados de campanhas
      const mockCampaigns: NotificationCampaign[] = [
        {
          id: 'campaign_1',
          name: 'Campanha de Boas-vindas',
          description: 'Série automática para novos usuários',
          template_id: 'welcome_email',
          target_audience: {
            user_segments: ['new_users'],
            filters: { registration_date: 'last_7_days' },
            estimated_reach: 1250
          },
          schedule: {
            type: 'immediate'
          },
          personalization: {
            enabled: true,
            rules: []
          },
          status: 'sent',
          metrics: {
            sent: 1250,
            delivered: 1198,
            opened: 756,
            clicked: 234,
            converted: 89,
            unsubscribed: 12,
            bounced: 52
          },
          created_at: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString()
        },
        {
          id: 'campaign_2',
          name: 'Promoção Fim de Semana',
          description: 'Ofertas especiais para o fim de semana',
          template_id: 'weekend_promo',
          target_audience: {
            user_segments: ['active_users', 'premium_users'],
            filters: { last_activity: 'last_30_days' },
            estimated_reach: 5600
          },
          schedule: {
            type: 'scheduled',
            send_at: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
            timezone: 'America/Sao_Paulo'
          },
          personalization: {
            enabled: true,
            rules: [
              {
                condition: 'user.location == "Rio de Janeiro"',
                variable: 'city_offers',
                value: 'ofertas_rj'
              }
            ]
          },
          ab_test: {
            enabled: true,
            variants: [
              { name: 'Versão A', template_id: 'weekend_promo_a', traffic_percentage: 50 },
              { name: 'Versão B', template_id: 'weekend_promo_b', traffic_percentage: 50 }
            ]
          },
          status: 'scheduled',
          metrics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
            unsubscribed: 0,
            bounced: 0
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return mockCampaigns.filter(campaign => {
        if (filters?.status && campaign.status !== filters.status) return false;
        return true;
      });
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      throw error;
    }
  }

  static async sendCampaign(campaignId: string): Promise<{ success: boolean; message: string; sent_count: number }> {
    try {
      console.log('Enviando campanha:', campaignId);
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sentCount = Math.floor(Math.random() * 1000) + 500;
      
      return {
        success: true,
        message: 'Campanha enviada com sucesso',
        sent_count: sentCount
      };
    } catch (error) {
      console.error('Erro ao enviar campanha:', error);
      throw error;
    }
  }

  // Envio de Notificações Avançadas
  static async sendAdvancedNotification(data: {
    user_id: string;
    template_id: string;
    variables?: Record<string, string | number | boolean>;
    override_preferences?: boolean;
    schedule_for?: string;
  }): Promise<NotificationDelivery> {
    try {
      const template = NOTIFICATION_TEMPLATES.find(t => t.id === data.template_id);
      if (!template) {
        throw new Error('Template não encontrado');
      }

      // Verificar preferências do usuário
      if (!data.override_preferences) {
        const preferences = await this.getUserPreferences(data.user_id);
        if (!this.shouldSendNotification(template, preferences)) {
          throw new Error('Usuário optou por não receber este tipo de notificação');
        }
      }

      // Processar variáveis no conteúdo
      const processedContent = this.processTemplate(template, data.variables || {});

      const delivery: NotificationDelivery = {
        id: `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        template_id: data.template_id,
        user_id: data.user_id,
        type: template.type,
        status: data.schedule_for ? 'pending' : 'sent',
        content: processedContent,
        metadata: {
          variables: data.variables,
          scheduled_for: data.schedule_for
        },
        sent_at: data.schedule_for ? undefined : new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      console.log('Enviando notificação avançada:', delivery);
      
      // Simular envio baseado no tipo
      switch (template.type) {
        case 'email':
          await this.sendEmail(delivery);
          break;
        case 'push':
          await this.sendPushNotification(delivery);
          break;
        case 'sms':
          await this.sendSMS(delivery);
          break;
        case 'in_app':
          await this.sendInAppNotification(delivery);
          break;
      }

      return delivery;
    } catch (error) {
      console.error('Erro ao enviar notificação avançada:', error);
      throw error;
    }
  }

  private static processTemplate(template: NotificationTemplate, variables: Record<string, string | number | boolean>): {
    subject?: string;
    title?: string;
    body: string;
    action_url?: string;
  } {
    let subject = template.subject;
    let title = template.title;
    let body = template.body;

    // Substituir variáveis
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      if (subject) subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      if (title) title = title.replace(new RegExp(placeholder, 'g'), String(value));
      body = body.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return {
      subject,
      title,
      body,
      action_url: variables.action_url
    };
  }

  private static async sendEmail(delivery: NotificationDelivery): Promise<void> {
    console.log('Enviando email:', {
      to: delivery.user_id,
      subject: delivery.content.subject,
      body: delivery.content.body
    });
    
    // Integração com serviço de email (SendGrid, AWS SES, etc.)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private static async sendPushNotification(delivery: NotificationDelivery): Promise<void> {
    console.log('Enviando push notification:', {
      to: delivery.user_id,
      title: delivery.content.title,
      body: delivery.content.body,
      action_url: delivery.content.action_url
    });
    
    // Integração com serviço de push (Firebase, OneSignal, etc.)
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private static async sendSMS(delivery: NotificationDelivery): Promise<void> {
    console.log('Enviando SMS:', {
      to: delivery.user_id,
      message: delivery.content.body
    });
    
    // Integração com serviço de SMS (Twilio, AWS SNS, etc.)
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  private static async sendInAppNotification(delivery: NotificationDelivery): Promise<void> {
    console.log('Enviando notificação in-app:', {
      to: delivery.user_id,
      title: delivery.content.title,
      body: delivery.content.body
    });
    
    // Salvar no banco para exibição no app
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Preferências do Usuário
  static async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      // Simular busca de preferências
      const mockPreferences: NotificationPreferences = {
        user_id: userId,
        email_notifications: {
          marketing: true,
          transactional: true,
          system: true,
          promotional: true
        },
        push_notifications: {
          marketing: true,
          transactional: true,
          system: true,
          promotional: false,
          location_based: true
        },
        sms_notifications: {
          transactional: true,
          promotional: false
        },
        frequency_limits: {
          max_daily_marketing: 3,
          max_weekly_promotional: 5
        },
        quiet_hours: {
          enabled: true,
          start_time: '22:00',
          end_time: '08:00',
          timezone: 'America/Sao_Paulo'
        },
        updated_at: new Date().toISOString()
      };

      return mockPreferences;
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
      throw error;
    }
  }

  static async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const currentPreferences = await this.getUserPreferences(userId);
      
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences,
        user_id: userId,
        updated_at: new Date().toISOString()
      };

      console.log('Atualizando preferências do usuário:', updatedPreferences);
      return updatedPreferences;
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      throw error;
    }
  }

  private static shouldSendNotification(template: NotificationTemplate, preferences: NotificationPreferences): boolean {
    const typePreferences = preferences[`${template.type}_notifications` as keyof NotificationPreferences] as Record<string, boolean> | undefined;
    
    if (!typePreferences) return false;
    
    return typePreferences[template.category] === true;
  }

  // Analytics de Notificações
  static async getCampaignAnalytics(campaignId: string): Promise<NotificationAnalytics> {
    try {
      const mockAnalytics: NotificationAnalytics = {
        campaign_id: campaignId,
        metrics: {
          sent: 1250,
          delivered: 1198,
          delivery_rate: 95.8,
          opened: 756,
          open_rate: 63.1,
          clicked: 234,
          click_rate: 31.0,
          converted: 89,
          conversion_rate: 38.0,
          unsubscribed: 12,
          unsubscribe_rate: 1.0,
          bounced: 52,
          bounce_rate: 4.2
        },
        performance_by_time: {
          '00:00': 5, '01:00': 3, '02:00': 2, '03:00': 1,
          '08:00': 45, '09:00': 78, '10:00': 89, '11:00': 95,
          '12:00': 120, '13:00': 98, '14:00': 87, '15:00': 76,
          '18:00': 110, '19:00': 125, '20:00': 98, '21:00': 67
        },
        performance_by_segment: {
          'new_users': { open_rate: 68.5, click_rate: 35.2 },
          'active_users': { open_rate: 58.9, click_rate: 28.7 },
          'premium_users': { open_rate: 72.1, click_rate: 41.3 }
        },
        device_breakdown: {
          'mobile': 78.5,
          'desktop': 18.2,
          'tablet': 3.3
        },
        location_breakdown: {
          'São Paulo': 35.2,
          'Rio de Janeiro': 28.7,
          'Belo Horizonte': 12.4,
          'Outros': 23.7
        },
        revenue_attribution: 15670.80
      };

      return mockAnalytics;
    } catch (error) {
      console.error('Erro ao buscar analytics da campanha:', error);
      throw error;
    }
  }

  // Notificações Inteligentes
  static async createSmartRule(ruleData: Omit<SmartNotificationRule, 'id' | 'created_at' | 'updated_at'>): Promise<SmartNotificationRule> {
    try {
      const rule: SmartNotificationRule = {
        id: `smart_rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...ruleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Criando regra inteligente:', rule);
      return rule;
    } catch (error) {
      console.error('Erro ao criar regra inteligente:', error);
      throw error;
    }
  }

  static async triggerSmartNotification(event: string, eventData: Record<string, string | number | boolean>): Promise<void> {
    try {
      console.log('Processando evento para notificações inteligentes:', event, eventData);
      
      // Buscar regras ativas para este evento e processar
      console.log('Notificações inteligentes processadas para evento:', event);
    } catch (error) {
      console.error('Erro ao processar notificações inteligentes:', error);
      throw error;
    }
  }

  // Otimização de Envio
  static async optimizeSendTime(userId: string, defaultTime: string): Promise<string> {
    try {
      // Analisar histórico de engajamento do usuário
      const userEngagementHours = {
        '08:00': 0.15,
        '12:00': 0.25,
        '18:00': 0.35,
        '20:00': 0.45,
        '21:00': 0.30
      };
      
      const bestHour = Object.entries(userEngagementHours)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      console.log(`Horário otimizado para usuário ${userId}: ${bestHour}`);
      return bestHour;
    } catch (error) {
      console.error('Erro ao otimizar horário de envio:', error);
      return defaultTime;
    }
  }

  // Relatórios
  static async generateReport(config: {
    type: 'campaign_performance' | 'user_engagement' | 'template_analysis';
    date_range: { start: string; end: string };
    filters?: Record<string, string | number | boolean>;
  }): Promise<{ generated_at: string; config: { type: string; date_range: { start: string; end: string }; filters?: Record<string, string | number | boolean> }; data: { summary: Record<string, number>; performance: Record<string, number>; detailed_data: Record<string, unknown>[] } }> {
    try {
      console.log('Gerando relatório de notificações:', config);
      
      const reportData = {
        generated_at: new Date().toISOString(),
        config,
        summary: {
          total_campaigns: 45,
          total_notifications_sent: 125670,
          avg_open_rate: 62.5,
          avg_click_rate: 28.7,
          avg_conversion_rate: 12.3
        },
        detailed_metrics: {
          by_type: {
            email: { sent: 89450, open_rate: 58.9, click_rate: 25.4 },
            push: { sent: 34560, open_rate: 78.2, click_rate: 35.7 },
            sms: { sent: 1660, open_rate: 95.1, click_rate: 45.2 }
          },
          by_category: {
            marketing: { sent: 67890, open_rate: 55.3, click_rate: 22.1 },
            transactional: { sent: 45670, open_rate: 89.7, click_rate: 67.8 },
            promotional: { sent: 12110, open_rate: 48.9, click_rate: 18.5 }
          }
        },
        recommendations: [
          'Aumentar frequência de notificações push para usuários mobile',
          'Otimizar horários de envio para campanhas de marketing',
          'Personalizar mais o conteúdo baseado no comportamento do usuário'
        ]
      };

      return reportData;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }
}