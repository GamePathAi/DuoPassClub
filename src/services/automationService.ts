// import { supabase } from '../lib/supabaseConfig';
// import { CRMService } from './crmService';
// import { PaymentService } from './paymentService';
import { GamificationService } from './gamificationService';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger_type: 'user_registration' | 'merchant_signup' | 'offer_created' | 'payment_completed' | 'inactivity' | 'milestone_reached' | 'scheduled' | 'manual';
  trigger_conditions: Record<string, string | number | boolean>;
  actions: AutomationAction[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_executed?: string;
  execution_count: number;
  success_rate: number;
}

export interface AutomationAction {
  type: 'send_email' | 'send_push' | 'send_sms' | 'add_points' | 'create_offer' | 'update_user' | 'create_task' | 'webhook' | 'wait';
  parameters: Record<string, unknown>;
  delay_minutes?: number;
}

export interface AutomationExecution {
  id: string;
  rule_id: string;
  trigger_data: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  error_message?: string;
  actions_completed: number;
  total_actions: number;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 'engagement' | 'retention' | 'conversion' | 'support' | 'marketing';
  template_data: Partial<AutomationRule>;
  is_predefined: boolean;
}

export interface AutomationStats {
  total_rules: number;
  active_rules: number;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  avg_execution_time: number;
  most_used_triggers: Array<{ trigger_type: string; count: number }>;
  performance_by_rule: Array<{ rule_id: string; name: string; success_rate: number; execution_count: number }>;
}

// Templates predefinidos de automação
export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'welcome_series',
    name: 'Série de Boas-vindas',
    description: 'Sequência automática de emails para novos usuários',
    category: 'onboarding',
    template_data: {
      name: 'Série de Boas-vindas para Novos Usuários',
      trigger_type: 'user_registration',
      trigger_conditions: {},
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'welcome_email',
            subject: 'Bem-vindo ao DuoPass Club!',
            personalized: true
          }
        },
        {
          type: 'wait',
          parameters: {},
          delay_minutes: 1440 // 24 horas
        },
        {
          type: 'send_email',
          parameters: {
            template: 'getting_started',
            subject: 'Como aproveitar ao máximo o DuoPass',
            include_tips: true
          }
        },
        {
          type: 'add_points',
          parameters: {
            points: 100,
            reason: 'welcome_bonus'
          },
          delay_minutes: 2880 // 48 horas
        }
      ],
      is_active: true
    },
    is_predefined: true
  },
  {
    id: 'merchant_onboarding',
    name: 'Onboarding de Parceiros',
    description: 'Processo automatizado para novos parceiros',
    category: 'onboarding',
    template_data: {
      name: 'Onboarding Automático de Parceiros',
      trigger_type: 'merchant_signup',
      trigger_conditions: {},
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'merchant_welcome',
            subject: 'Bem-vindo à rede DuoPass!',
            include_setup_guide: true
          }
        },
        {
          type: 'create_task',
          parameters: {
            title: 'Revisar documentação do parceiro',
            assigned_to: 'curadoria_team',
            priority: 'high',
            due_date: '+2 days'
          }
        },
        {
          type: 'send_email',
          parameters: {
            template: 'setup_reminder',
            subject: 'Complete seu perfil de parceiro',
            include_checklist: true
          },
          delay_minutes: 2880 // 48 horas
        }
      ],
      is_active: true
    },
    is_predefined: true
  },
  {
    id: 'inactivity_winback',
    name: 'Reativação de Usuários Inativos',
    description: 'Campanha para reativar usuários inativos',
    category: 'retention',
    template_data: {
      name: 'Campanha de Reativação',
      trigger_type: 'inactivity',
      trigger_conditions: {
        days_inactive: 30,
        last_purchase_days: 60
      },
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'winback_email',
            subject: 'Sentimos sua falta! Oferta especial para você',
            include_special_offer: true,
            discount_percentage: 20
          }
        },
        {
          type: 'send_push',
          parameters: {
            title: 'Oferta especial te esperando!',
            body: 'Volte e ganhe 20% de desconto na sua próxima compra',
            deep_link: '/ofertas/special'
          },
          delay_minutes: 1440 // 24 horas
        },
        {
          type: 'add_points',
          parameters: {
            points: 200,
            reason: 'winback_bonus',
            expires_in_days: 30
          },
          delay_minutes: 2880 // 48 horas
        }
      ],
      is_active: true
    },
    is_predefined: true
  },
  {
    id: 'milestone_celebration',
    name: 'Celebração de Marcos',
    description: 'Reconhecer conquistas dos usuários',
    category: 'engagement',
    template_data: {
      name: 'Celebração de Marcos dos Usuários',
      trigger_type: 'milestone_reached',
      trigger_conditions: {
        milestone_types: ['first_purchase', '10_purchases', '50_purchases', 'level_up']
      },
      actions: [
        {
          type: 'send_push',
          parameters: {
            title: 'Parabéns! 🎉',
            body: 'Você alcançou um novo marco!',
            include_badge: true
          }
        },
        {
          type: 'add_points',
          parameters: {
            points: 'dynamic', // Baseado no tipo de marco
            reason: 'milestone_bonus'
          }
        },
        {
          type: 'send_email',
          parameters: {
            template: 'milestone_celebration',
            subject: 'Celebrando sua conquista!',
            include_next_goal: true
          },
          delay_minutes: 60
        }
      ],
      is_active: true
    },
    is_predefined: true
  },
  {
    id: 'payment_followup',
    name: 'Follow-up de Pagamentos',
    description: 'Ações após pagamentos bem-sucedidos',
    category: 'conversion',
    template_data: {
      name: 'Follow-up Automático de Pagamentos',
      trigger_type: 'payment_completed',
      trigger_conditions: {
        payment_types: ['subscription', 'upgrade']
      },
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'payment_confirmation',
            subject: 'Pagamento confirmado - Bem-vindo ao plano Premium!',
            include_benefits: true
          }
        },
        {
          type: 'add_points',
          parameters: {
            points: 500,
            reason: 'subscription_bonus'
          }
        },
        {
          type: 'send_email',
          parameters: {
            template: 'premium_tips',
            subject: 'Como aproveitar seus novos benefícios Premium',
            include_exclusive_offers: true
          },
          delay_minutes: 1440 // 24 horas
        }
      ],
      is_active: true
    },
    is_predefined: true
  },
  {
    id: 'quality_monitoring',
    name: 'Monitoramento de Qualidade',
    description: 'Alertas automáticos para problemas de qualidade',
    category: 'support',
    template_data: {
      name: 'Monitoramento Automático de Qualidade',
      trigger_type: 'scheduled',
      trigger_conditions: {
        schedule: 'daily',
        time: '09:00'
      },
      actions: [
        {
          type: 'webhook',
          parameters: {
            url: '/api/quality-check',
            method: 'POST',
            check_merchant_ratings: true,
            check_offer_performance: true,
            check_user_complaints: true
          }
        },
        {
          type: 'create_task',
          parameters: {
            title: 'Revisar relatório de qualidade diário',
            assigned_to: 'quality_team',
            priority: 'medium',
            conditional: 'if_issues_found'
          }
        }
      ],
      is_active: true
    },
    is_predefined: true
  }
];

export class AutomationService {
  // Gerenciamento de Regras
  static async createRule(ruleData: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'execution_count' | 'success_rate'>): Promise<AutomationRule> {
    try {
      const rule: AutomationRule = {
        id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...ruleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        execution_count: 0,
        success_rate: 0
      };

      // Salvar no Supabase (simulado)
      console.log('Criando regra de automação:', rule);
      
      return rule;
    } catch (error) {
      console.error('Erro ao criar regra de automação:', error);
      throw error;
    }
  }

  static async updateRule(ruleId: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    try {
      const updatedRule = {
        ...updates,
        id: ruleId,
        updated_at: new Date().toISOString()
      } as AutomationRule;

      console.log('Atualizando regra de automação:', updatedRule);
      
      return updatedRule;
    } catch (error) {
      console.error('Erro ao atualizar regra:', error);
      throw error;
    }
  }

  static async deleteRule(ruleId: string): Promise<void> {
    try {
      console.log('Deletando regra de automação:', ruleId);
      // Implementar deleção no Supabase
    } catch (error) {
      console.error('Erro ao deletar regra:', error);
      throw error;
    }
  }

  static async getRules(filters?: {
    is_active?: boolean;
    trigger_type?: string;
    category?: string;
  }): Promise<AutomationRule[]> {
    try {
      // Simular dados de regras
      const mockRules: AutomationRule[] = AUTOMATION_TEMPLATES.map(template => ({
        id: template.id,
        name: template.template_data.name || template.name,
        description: template.description,
        trigger_type: template.template_data.trigger_type || 'manual',
        trigger_conditions: template.template_data.trigger_conditions || {},
        actions: template.template_data.actions || [],
        is_active: template.template_data.is_active || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        execution_count: Math.floor(Math.random() * 100),
        success_rate: 85 + Math.random() * 15
      }));

      return mockRules.filter(rule => {
        if (filters?.is_active !== undefined && rule.is_active !== filters.is_active) return false;
        if (filters?.trigger_type && rule.trigger_type !== filters.trigger_type) return false;
        return true;
      });
    } catch (error) {
      console.error('Erro ao buscar regras:', error);
      throw error;
    }
  }

  // Execução de Automações
  static async executeRule(ruleId: string, triggerData: Record<string, unknown>): Promise<AutomationExecution> {
    try {
      const execution: AutomationExecution = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        rule_id: ruleId,
        trigger_data: triggerData,
        status: 'running',
        started_at: new Date().toISOString(),
        actions_completed: 0,
        total_actions: 0
      };

      console.log('Iniciando execução de automação:', execution);

      // Buscar regra
      const rules = await this.getRules();
      const rule = rules.find(r => r.id === ruleId);
      
      if (!rule) {
        throw new Error('Regra não encontrada');
      }

      if (!rule.is_active) {
        throw new Error('Regra está inativa');
      }

      execution.total_actions = rule.actions.length;

      // Executar ações sequencialmente
      for (let i = 0; i < rule.actions.length; i++) {
        const action = rule.actions[i];
        
        try {
          // Aplicar delay se especificado
          if (action.delay_minutes && action.delay_minutes > 0) {
            console.log(`Aguardando ${action.delay_minutes} minutos antes da próxima ação...`);
            // Em produção, isso seria agendado para execução posterior
          }

          await this.executeAction(action, triggerData);
          execution.actions_completed++;
          
        } catch (actionError) {
          console.error(`Erro na ação ${i + 1}:`, actionError);
          execution.status = 'failed';
          execution.error_message = `Falha na ação ${i + 1}: ${actionError}`;
          break;
        }
      }

      if (execution.status === 'running') {
        execution.status = 'completed';
      }
      
      execution.completed_at = new Date().toISOString();
      
      console.log('Execução finalizada:', execution);
      return execution;
      
    } catch (error) {
      console.error('Erro na execução da automação:', error);
      throw error;
    }
  }

  private static async executeAction(
    action: AutomationAction, 
    triggerData: Record<string, unknown>
  ): Promise<void> {
    console.log('Executando ação:', action.type, action.parameters);

    switch (action.type) {
      case 'send_email':
        await this.sendEmail(action.parameters, triggerData);
        break;
        
      case 'send_push':
        await this.sendPushNotification(action.parameters, triggerData);
        break;
        
      case 'send_sms':
        await this.sendSMS(action.parameters, triggerData);
        break;
        
      case 'add_points':
        await this.addPoints(action.parameters, triggerData);
        break;
        
      case 'create_offer':
        await this.createOffer(action.parameters, triggerData);
        break;
        
      case 'update_user':
        await this.updateUser(action.parameters, triggerData);
        break;
        
      case 'create_task':
        await this.createTask(action.parameters, triggerData);
        break;
        
      case 'webhook':
        await this.callWebhook(action.parameters, triggerData);
        break;
        
      case 'wait':
        // Ação de espera - em produção seria agendada
        console.log('Ação de espera executada');
        break;
        
      default:
        throw new Error(`Tipo de ação não suportado: ${action.type}`);
    }
  }

  // Implementações das ações
  private static async sendEmail(parameters: Record<string, unknown>, triggerData: Record<string, unknown>): Promise<void> {
    console.log('Enviando email:', {
      template: parameters.template,
      subject: parameters.subject,
      to: triggerData.user_email || triggerData.email,
      personalized: parameters.personalized
    });
    
    // Integração com serviço de email (SendGrid, AWS SES, etc.)
    // await emailService.send(...);
  }

  private static async sendPushNotification(parameters: Record<string, unknown>, triggerData: Record<string, unknown>): Promise<void> {
    console.log('Enviando push notification:', {
      title: parameters.title,
      body: parameters.body,
      user_id: triggerData.user_id,
      deep_link: parameters.deep_link
    });
    
    // Integração com serviço de push (Firebase, OneSignal, etc.)
    // await pushService.send(...);
  }

  private static async sendSMS(parameters: Record<string, unknown>, triggerData: Record<string, unknown>): Promise<void> {
    console.log('Enviando SMS:', {
      message: parameters.message,
      phone: triggerData.phone || triggerData.user_phone
    });
    
    // Integração com serviço de SMS (Twilio, AWS SNS, etc.)
    // await smsService.send(...);
  }

  private static async addPoints(parameters: Record<string, unknown>, triggerData: Record<string, unknown>): Promise<void> {
    if (!triggerData.user_id) {
      throw new Error('user_id é obrigatório para adicionar pontos');
    }

    let points = parameters.points;
    
    // Pontos dinâmicos baseados no contexto
    if (points === 'dynamic') {
      const milestoneType = triggerData.milestone_type;
      points = this.calculateDynamicPoints(milestoneType);
    }

    await GamificationService.addPoints(
      triggerData.user_id,
      points,
      parameters.reason || 'automation_bonus'
    );
    
    console.log(`Adicionados ${points} pontos para usuário ${triggerData.user_id}`);
  }

  private static calculateDynamicPoints(milestoneType: string): number {
    const pointsMap: Record<string, number> = {
      'first_purchase': 100,
      '10_purchases': 500,
      '50_purchases': 1000,
      'level_up': 200,
      'referral': 300
    };
    
    return pointsMap[milestoneType] || 50;
  }

  private static async createOffer(parameters: Record<string, unknown>, triggerData: Record<string, unknown>): Promise<void> {
    console.log('Criando oferta automática:', {
      title: parameters.title,
      discount: parameters.discount,
      merchant_id: triggerData.merchant_id || parameters.merchant_id
    });
    
    // Integração com sistema de ofertas
    // await offerService.create(...);
  }

  private static async updateUser(parameters: Record<string, unknown>, triggerData: Record<string, unknown>): Promise<void> {
    if (!triggerData.user_id) {
      throw new Error('user_id é obrigatório para atualizar usuário');
    }

    console.log('Atualizando usuário:', {
      user_id: triggerData.user_id,
      updates: parameters.updates
    });
    
    // Integração com sistema de usuários
    // await userService.update(triggerData.user_id, parameters.updates);
  }

  private static async createTask(parameters: Record<string, unknown>): Promise<void> {
    console.log('Criando task:', {
      title: parameters.title,
      assigned_to: parameters.assigned_to,
      priority: parameters.priority,
      due_date: parameters.due_date
    });
    
    // Integração com sistema de tasks/tickets
    // await taskService.create(...);
  }

  private static async callWebhook(parameters: Record<string, unknown>, triggerData: Record<string, unknown>): Promise<void> {
    console.log('Chamando webhook:', {
      url: parameters.url,
      method: parameters.method,
      data: triggerData
    });
    
    // Fazer chamada HTTP para webhook
    // await fetch(parameters.url, { method: parameters.method, body: JSON.stringify(triggerData) });
  }

  // Triggers automáticos
  static async triggerUserRegistration(userData: Record<string, unknown>): Promise<void> {
    const rules = await this.getRules({ trigger_type: 'user_registration', is_active: true });
    
    for (const rule of rules) {
      try {
        await this.executeRule(rule.id, {
          user_id: userData.id,
          user_email: userData.email,
          user_name: userData.name,
          registration_date: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Erro ao executar regra ${rule.id}:`, error);
      }
    }
  }

  static async triggerMerchantSignup(merchantData: Record<string, unknown>): Promise<void> {
    const rules = await this.getRules({ trigger_type: 'merchant_signup', is_active: true });
    
    for (const rule of rules) {
      try {
        await this.executeRule(rule.id, {
          merchant_id: merchantData.id,
          merchant_email: merchantData.email,
          merchant_name: merchantData.name,
          signup_date: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Erro ao executar regra ${rule.id}:`, error);
      }
    }
  }

  static async triggerPaymentCompleted(paymentData: Record<string, unknown>): Promise<void> {
    const rules = await this.getRules({ trigger_type: 'payment_completed', is_active: true });
    
    for (const rule of rules) {
      // Verificar condições específicas
      if (rule.trigger_conditions.payment_types) {
        if (!rule.trigger_conditions.payment_types.includes(paymentData.type)) {
          continue;
        }
      }
      
      try {
        await this.executeRule(rule.id, {
          user_id: paymentData.user_id,
          payment_id: paymentData.id,
          amount: paymentData.amount,
          payment_type: paymentData.type,
          payment_date: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Erro ao executar regra ${rule.id}:`, error);
      }
    }
  }

  static async triggerMilestoneReached(milestoneData: Record<string, unknown>): Promise<void> {
    const rules = await this.getRules({ trigger_type: 'milestone_reached', is_active: true });
    
    for (const rule of rules) {
      // Verificar se o tipo de marco está nas condições
      if (rule.trigger_conditions.milestone_types) {
        if (!rule.trigger_conditions.milestone_types.includes(milestoneData.type)) {
          continue;
        }
      }
      
      try {
        await this.executeRule(rule.id, {
          user_id: milestoneData.user_id,
          milestone_type: milestoneData.type,
          milestone_value: milestoneData.value,
          achieved_date: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Erro ao executar regra ${rule.id}:`, error);
      }
    }
  }

  // Estatísticas e Monitoramento
  static async getStats(): Promise<AutomationStats> {
    try {
      const rules = await this.getRules();
      
      return {
        total_rules: rules.length,
        active_rules: rules.filter(r => r.is_active).length,
        total_executions: rules.reduce((sum, r) => sum + r.execution_count, 0),
        successful_executions: Math.floor(rules.reduce((sum, r) => sum + (r.execution_count * r.success_rate / 100), 0)),
        failed_executions: Math.floor(rules.reduce((sum, r) => sum + (r.execution_count * (100 - r.success_rate) / 100), 0)),
        avg_execution_time: 2.5, // segundos
        most_used_triggers: [
          { trigger_type: 'user_registration', count: 1250 },
          { trigger_type: 'payment_completed', count: 890 },
          { trigger_type: 'milestone_reached', count: 567 },
          { trigger_type: 'inactivity', count: 234 }
        ],
        performance_by_rule: rules.map(rule => ({
          rule_id: rule.id,
          name: rule.name,
          success_rate: rule.success_rate,
          execution_count: rule.execution_count
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  static async getExecutions(ruleId?: string, limit: number = 50): Promise<AutomationExecution[]> {
    try {
      // Simular dados de execuções
      const mockExecutions: AutomationExecution[] = [
        {
          id: 'exec_1',
          rule_id: 'welcome_series',
          trigger_data: { user_id: 'user_123', user_email: 'joao@email.com' },
          status: 'completed',
          started_at: new Date(Date.now() - 3600000).toISOString(),
          completed_at: new Date(Date.now() - 3500000).toISOString(),
          actions_completed: 3,
          total_actions: 3
        },
        {
          id: 'exec_2',
          rule_id: 'payment_followup',
          trigger_data: { user_id: 'user_456', payment_type: 'subscription' },
          status: 'running',
          started_at: new Date(Date.now() - 1800000).toISOString(),
          actions_completed: 1,
          total_actions: 3
        }
      ];

      return mockExecutions.filter(exec => !ruleId || exec.rule_id === ruleId).slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar execuções:', error);
      throw error;
    }
  }

  // Templates
  static getTemplates(category?: string): AutomationTemplate[] {
    if (category) {
      return AUTOMATION_TEMPLATES.filter(template => template.category === category);
    }
    return AUTOMATION_TEMPLATES;
  }

  static async createRuleFromTemplate(templateId: string, customizations?: Partial<AutomationRule>): Promise<AutomationRule> {
    const template = AUTOMATION_TEMPLATES.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template não encontrado');
    }

    const ruleData = {
      ...template.template_data,
      ...customizations,
      name: customizations?.name || template.template_data.name || template.name,
      description: customizations?.description || template.description
    } as Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'execution_count' | 'success_rate'>;

    return await this.createRule(ruleData);
  }
}