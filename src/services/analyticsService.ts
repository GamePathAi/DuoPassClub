// import { supabase } from '../lib/supabaseConfig';

export interface UserAnalytics {
  user_id: string;
  total_sessions: number;
  avg_session_duration: number; // em minutos
  total_offers_viewed: number;
  total_offers_redeemed: number;
  conversion_rate: number;
  favorite_categories: string[];
  preferred_times: string[]; // horários de maior atividade
  location_data: {
    most_visited_areas: string[];
    avg_distance_traveled: number;
  };
  engagement_score: number; // 0-100
  lifetime_value: number;
  churn_probability: number; // 0-1
  last_activity: string;
}

export interface MerchantAnalytics {
  merchant_id: string;
  total_offers_created: number;
  total_redemptions: number;
  avg_offer_performance: number;
  revenue_generated: number;
  customer_acquisition: number;
  customer_retention_rate: number;
  peak_hours: string[];
  popular_offer_types: string[];
  rating_average: number;
  review_count: number;
  conversion_funnel: {
    views: number;
    clicks: number;
    redemptions: number;
  };
  roi_metrics: {
    cost_per_acquisition: number;
    return_on_investment: number;
  };
}

export interface OfferAnalytics {
  offer_id: string;
  total_views: number;
  total_clicks: number;
  total_redemptions: number;
  conversion_rate: number;
  click_through_rate: number;
  avg_time_to_redemption: number; // em horas
  user_demographics: {
    age_groups: Record<string, number>;
    gender_distribution: Record<string, number>;
    location_distribution: Record<string, number>;
  };
  performance_by_time: {
    hourly: Record<string, number>;
    daily: Record<string, number>;
    weekly: Record<string, number>;
  };
  revenue_impact: number;
  cost_effectiveness: number;
}

export interface PlatformAnalytics {
  overview: {
    total_users: number;
    active_users_daily: number;
    active_users_monthly: number;
    total_merchants: number;
    active_merchants: number;
    total_offers: number;
    active_offers: number;
    total_transactions: number;
    total_revenue: number;
  };
  growth_metrics: {
    user_growth_rate: number;
    merchant_growth_rate: number;
    revenue_growth_rate: number;
    retention_rate: number;
  };
  engagement_metrics: {
    avg_session_duration: number;
    pages_per_session: number;
    bounce_rate: number;
    daily_active_users: number;
    monthly_active_users: number;
  };
  conversion_metrics: {
    overall_conversion_rate: number;
    offer_to_redemption_rate: number;
    signup_to_first_purchase: number;
    free_to_paid_conversion: number;
  };
  financial_metrics: {
    average_order_value: number;
    customer_lifetime_value: number;
    monthly_recurring_revenue: number;
    churn_rate: number;
  };
}

export interface RealtimeMetrics {
  current_active_users: number;
  current_sessions: number;
  offers_viewed_last_hour: number;
  redemptions_last_hour: number;
  revenue_last_hour: number;
  top_performing_offers: Array<{
    offer_id: string;
    title: string;
    views: number;
    redemptions: number;
  }>;
  system_health: {
    api_response_time: number;
    error_rate: number;
    uptime_percentage: number;
  };
}

export interface PredictiveAnalytics {
  user_churn_predictions: Array<{
    user_id: string;
    churn_probability: number;
    risk_factors: string[];
    recommended_actions: string[];
  }>;
  demand_forecasting: {
    next_week_demand: Record<string, number>; // categoria -> demanda prevista
    seasonal_trends: Record<string, number>;
    growth_projections: {
      users: number;
      revenue: number;
      merchants: number;
    };
  };
  offer_optimization: Array<{
    offer_id: string;
    current_performance: number;
    optimization_suggestions: string[];
    predicted_improvement: number;
  }>;
}

export interface AnalyticsFilter {
  start_date?: string;
  end_date?: string;
  user_segment?: string;
  merchant_category?: string;
  location?: string;
  offer_type?: string;
  device_type?: string;
}

export interface CohortAnalysis {
  cohort_month: string;
  user_count: number;
  retention_rates: Record<string, number>; // mês -> taxa de retenção
  revenue_per_cohort: Record<string, number>;
  avg_lifetime_value: number;
}

export interface FunnelAnalysis {
  stage_name: string;
  users_entered: number;
  users_completed: number;
  conversion_rate: number;
  avg_time_in_stage: number; // em horas
  drop_off_reasons: string[];
}

export interface ABTestResult {
  test_id: string;
  test_name: string;
  variant_a: {
    name: string;
    users: number;
    conversions: number;
    conversion_rate: number;
  };
  variant_b: {
    name: string;
    users: number;
    conversions: number;
    conversion_rate: number;
  };
  statistical_significance: number;
  confidence_level: number;
  winner: 'A' | 'B' | 'inconclusive';
  lift: number; // % de melhoria
}

export class AnalyticsService {
  // Analytics de Usuários
  static async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    try {
      // Simular dados de analytics do usuário
      const mockData: UserAnalytics = {
        user_id: userId,
        total_sessions: 45,
        avg_session_duration: 8.5,
        total_offers_viewed: 234,
        total_offers_redeemed: 18,
        conversion_rate: 7.7,
        favorite_categories: ['Restaurantes', 'Beleza', 'Entretenimento'],
        preferred_times: ['12:00-14:00', '18:00-20:00'],
        location_data: {
          most_visited_areas: ['Centro', 'Zona Sul', 'Barra'],
          avg_distance_traveled: 5.2
        },
        engagement_score: 78,
        lifetime_value: 450.80,
        churn_probability: 0.15,
        last_activity: new Date(Date.now() - 3600000).toISOString()
      };

      console.log('Buscando analytics do usuário:', userId);
      return mockData;
    } catch (error) {
      console.error('Erro ao buscar analytics do usuário:', error);
      throw error;
    }
  }

  static async getUserSegmentAnalytics(): Promise<UserAnalytics[]> {
    try {
      // Simular dados de segmento
      const mockUsers = Array.from({ length: 10 }, (_, i) => ({
        user_id: `user_${i + 1}`,
        total_sessions: 20 + Math.floor(Math.random() * 50),
        avg_session_duration: 5 + Math.random() * 10,
        total_offers_viewed: 50 + Math.floor(Math.random() * 200),
        total_offers_redeemed: 5 + Math.floor(Math.random() * 20),
        conversion_rate: 3 + Math.random() * 12,
        favorite_categories: ['Restaurantes', 'Beleza', 'Entretenimento'].slice(0, 1 + Math.floor(Math.random() * 3)),
        preferred_times: ['12:00-14:00', '18:00-20:00'],
        location_data: {
          most_visited_areas: ['Centro', 'Zona Sul'],
          avg_distance_traveled: 2 + Math.random() * 8
        },
        engagement_score: 50 + Math.floor(Math.random() * 50),
        lifetime_value: 100 + Math.random() * 500,
        churn_probability: Math.random() * 0.5,
        last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString()
      }));

      return mockUsers;
    } catch (error) {
      console.error('Erro ao buscar analytics do segmento:', error);
      throw error;
    }
  }

  // Analytics de Parceiros
  static async getMerchantAnalytics(merchantId: string): Promise<MerchantAnalytics> {
    try {
      const mockData: MerchantAnalytics = {
        merchant_id: merchantId,
        total_offers_created: 24,
        total_redemptions: 156,
        avg_offer_performance: 6.5,
        revenue_generated: 12450.80,
        customer_acquisition: 89,
        customer_retention_rate: 68.5,
        peak_hours: ['12:00-14:00', '19:00-21:00'],
        popular_offer_types: ['Desconto', 'Combo', '2x1'],
        rating_average: 4.3,
        review_count: 127,
        conversion_funnel: {
          views: 2340,
          clicks: 456,
          redemptions: 156
        },
        roi_metrics: {
          cost_per_acquisition: 15.50,
          return_on_investment: 3.2
        }
      };

      console.log('Buscando analytics do parceiro:', merchantId);
      return mockData;
    } catch (error) {
      console.error('Erro ao buscar analytics do parceiro:', error);
      throw error;
    }
  }

  // Analytics de Ofertas
  static async getOfferAnalytics(offerId: string): Promise<OfferAnalytics> {
    try {
      const mockData: OfferAnalytics = {
        offer_id: offerId,
        total_views: 1250,
        total_clicks: 234,
        total_redemptions: 45,
        conversion_rate: 3.6,
        click_through_rate: 18.7,
        avg_time_to_redemption: 2.5,
        user_demographics: {
          age_groups: {
            '18-25': 25,
            '26-35': 40,
            '36-45': 20,
            '46+': 15
          },
          gender_distribution: {
            'Masculino': 45,
            'Feminino': 52,
            'Outro': 3
          },
          location_distribution: {
            'Centro': 35,
            'Zona Sul': 30,
            'Zona Norte': 20,
            'Outros': 15
          }
        },
        performance_by_time: {
          hourly: {
            '09': 5, '10': 8, '11': 12, '12': 25, '13': 30,
            '14': 20, '15': 15, '16': 18, '17': 22, '18': 28,
            '19': 35, '20': 30, '21': 20, '22': 10
          },
          daily: {
            'Segunda': 15, 'Terça': 18, 'Quarta': 20, 'Quinta': 22,
            'Sexta': 35, 'Sábado': 40, 'Domingo': 25
          },
          weekly: {
            'Semana 1': 120, 'Semana 2': 145, 'Semana 3': 160, 'Semana 4': 180
          }
        },
        revenue_impact: 2250.50,
        cost_effectiveness: 4.2
      };

      return mockData;
    } catch (error) {
      console.error('Erro ao buscar analytics da oferta:', error);
      throw error;
    }
  }

  // Analytics da Plataforma
  static async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    try {
      const mockData: PlatformAnalytics = {
        overview: {
          total_users: 15420,
          active_users_daily: 3240,
          active_users_monthly: 12340,
          total_merchants: 890,
          active_merchants: 756,
          total_offers: 2340,
          active_offers: 1890,
          total_transactions: 45670,
          total_revenue: 485670.50
        },
        growth_metrics: {
          user_growth_rate: 23.5,
          merchant_growth_rate: 18.2,
          revenue_growth_rate: 31.8,
          retention_rate: 78.5
        },
        engagement_metrics: {
          avg_session_duration: 8.5,
          pages_per_session: 4.2,
          bounce_rate: 25.3,
          daily_active_users: 3240,
          monthly_active_users: 12340
        },
        conversion_metrics: {
          overall_conversion_rate: 7.8,
          offer_to_redemption_rate: 12.5,
          signup_to_first_purchase: 45.2,
          free_to_paid_conversion: 15.8
        },
        financial_metrics: {
          average_order_value: 35.80,
          customer_lifetime_value: 245.60,
          monthly_recurring_revenue: 89450.30,
          churn_rate: 5.2
        }
      };

      return mockData;
    } catch (error) {
      console.error('Erro ao buscar analytics da plataforma:', error);
      throw error;
    }
  }

  // Métricas em Tempo Real
  static async getRealtimeMetrics(): Promise<RealtimeMetrics> {
    try {
      const mockData: RealtimeMetrics = {
        current_active_users: 234,
        current_sessions: 189,
        offers_viewed_last_hour: 456,
        redemptions_last_hour: 23,
        revenue_last_hour: 890.50,
        top_performing_offers: [
          { offer_id: 'offer_1', title: 'Pizza 50% OFF', views: 89, redemptions: 12 },
          { offer_id: 'offer_2', title: 'Combo Burger', views: 67, redemptions: 8 },
          { offer_id: 'offer_3', title: 'Spa Relaxante', views: 45, redemptions: 6 }
        ],
        system_health: {
          api_response_time: 245,
          error_rate: 0.02,
          uptime_percentage: 99.8
        }
      };

      return mockData;
    } catch (error) {
      console.error('Erro ao buscar métricas em tempo real:', error);
      throw error;
    }
  }

  // Analytics Preditivos
  static async getPredictiveAnalytics(): Promise<PredictiveAnalytics> {
    try {
      const mockData: PredictiveAnalytics = {
        user_churn_predictions: [
          {
            user_id: 'user_123',
            churn_probability: 0.75,
            risk_factors: ['Baixa atividade', 'Sem compras recentes', 'Não abre emails'],
            recommended_actions: ['Oferta personalizada', 'Desconto especial', 'Contato direto']
          },
          {
            user_id: 'user_456',
            churn_probability: 0.45,
            risk_factors: ['Diminuição de sessões'],
            recommended_actions: ['Gamificação', 'Novos conteúdos']
          }
        ],
        demand_forecasting: {
          next_week_demand: {
            'Restaurantes': 450,
            'Beleza': 230,
            'Entretenimento': 180,
            'Saúde': 120
          },
          seasonal_trends: {
            'Verão': 1.3,
            'Inverno': 0.8,
            'Natal': 1.8,
            'Carnaval': 1.5
          },
          growth_projections: {
            users: 18500,
            revenue: 620000,
            merchants: 1100
          }
        },
        offer_optimization: [
          {
            offer_id: 'offer_1',
            current_performance: 6.5,
            optimization_suggestions: [
              'Melhorar título',
              'Ajustar horário de exibição',
              'Aumentar desconto'
            ],
            predicted_improvement: 25.5
          }
        ]
      };

      return mockData;
    } catch (error) {
      console.error('Erro ao buscar analytics preditivos:', error);
      throw error;
    }
  }

  // Análise de Coorte
  static async getCohortAnalysis(): Promise<CohortAnalysis[]> {
    try {
      const mockData: CohortAnalysis[] = [
        {
          cohort_month: '2024-01',
          user_count: 1250,
          retention_rates: {
            'Mês 0': 100,
            'Mês 1': 65,
            'Mês 2': 45,
            'Mês 3': 35,
            'Mês 6': 25,
            'Mês 12': 18
          },
          revenue_per_cohort: {
            'Mês 0': 15600,
            'Mês 1': 12400,
            'Mês 2': 8900,
            'Mês 3': 7200
          },
          avg_lifetime_value: 245.60
        },
        {
          cohort_month: '2024-02',
          user_count: 1450,
          retention_rates: {
            'Mês 0': 100,
            'Mês 1': 68,
            'Mês 2': 48,
            'Mês 3': 38
          },
          revenue_per_cohort: {
            'Mês 0': 18200,
            'Mês 1': 14600,
            'Mês 2': 10400
          },
          avg_lifetime_value: 268.90
        }
      ];

      return mockData;
    } catch (error) {
      console.error('Erro ao buscar análise de coorte:', error);
      throw error;
    }
  }

  // Análise de Funil
  static async getFunnelAnalysis(funnelType: 'user_onboarding' | 'offer_conversion' | 'subscription'): Promise<FunnelAnalysis[]> {
    try {
      const funnels = {
        user_onboarding: [
          { stage_name: 'Visitante', users_entered: 10000, users_completed: 8500, conversion_rate: 85, avg_time_in_stage: 0.5, drop_off_reasons: ['Não interessado'] },
          { stage_name: 'Cadastro Iniciado', users_entered: 8500, users_completed: 6800, conversion_rate: 80, avg_time_in_stage: 2, drop_off_reasons: ['Formulário longo', 'Erro técnico'] },
          { stage_name: 'Email Verificado', users_entered: 6800, users_completed: 6120, conversion_rate: 90, avg_time_in_stage: 24, drop_off_reasons: ['Email não recebido'] },
          { stage_name: 'Perfil Completo', users_entered: 6120, users_completed: 5500, conversion_rate: 90, avg_time_in_stage: 12, drop_off_reasons: ['Muitas informações'] },
          { stage_name: 'Primeira Compra', users_entered: 5500, users_completed: 2750, conversion_rate: 50, avg_time_in_stage: 72, drop_off_reasons: ['Preço', 'Falta de ofertas interessantes'] }
        ],
        offer_conversion: [
          { stage_name: 'Visualização', users_entered: 5000, users_completed: 4200, conversion_rate: 84, avg_time_in_stage: 0.2, drop_off_reasons: ['Não interessante'] },
          { stage_name: 'Clique', users_entered: 4200, users_completed: 1260, conversion_rate: 30, avg_time_in_stage: 1, drop_off_reasons: ['Mudou de ideia'] },
          { stage_name: 'Visualização Detalhes', users_entered: 1260, users_completed: 945, conversion_rate: 75, avg_time_in_stage: 3, drop_off_reasons: ['Condições não atrativas'] },
          { stage_name: 'Resgate', users_entered: 945, users_completed: 378, conversion_rate: 40, avg_time_in_stage: 2, drop_off_reasons: ['Processo complexo', 'Mudou de ideia'] }
        ],
        subscription: [
          { stage_name: 'Interesse', users_entered: 2000, users_completed: 1600, conversion_rate: 80, avg_time_in_stage: 1, drop_off_reasons: ['Preço alto'] },
          { stage_name: 'Teste Gratuito', users_entered: 1600, users_completed: 1200, conversion_rate: 75, avg_time_in_stage: 168, drop_off_reasons: ['Não viu valor'] },
          { stage_name: 'Conversão Paga', users_entered: 1200, users_completed: 360, conversion_rate: 30, avg_time_in_stage: 24, drop_off_reasons: ['Preço', 'Não usa o suficiente'] }
        ]
      };

      return funnels[funnelType] || [];
    } catch (error) {
      console.error('Erro ao buscar análise de funil:', error);
      throw error;
    }
  }

  // Testes A/B
  static async getABTestResults(testId?: string): Promise<ABTestResult[]> {
    try {
      const mockTests: ABTestResult[] = [
        {
          test_id: 'test_1',
          test_name: 'Botão de CTA - Cor',
          variant_a: {
            name: 'Azul (Controle)',
            users: 1000,
            conversions: 85,
            conversion_rate: 8.5
          },
          variant_b: {
            name: 'Verde (Teste)',
            users: 1000,
            conversions: 102,
            conversion_rate: 10.2
          },
          statistical_significance: 95.5,
          confidence_level: 95,
          winner: 'B',
          lift: 20
        },
        {
          test_id: 'test_2',
          test_name: 'Email Subject Line',
          variant_a: {
            name: 'Oferta Especial',
            users: 5000,
            conversions: 450,
            conversion_rate: 9.0
          },
          variant_b: {
            name: 'Desconto Limitado',
            users: 5000,
            conversions: 485,
            conversion_rate: 9.7
          },
          statistical_significance: 87.2,
          confidence_level: 95,
          winner: 'inconclusive',
          lift: 7.8
        }
      ];

      return testId ? mockTests.filter(test => test.test_id === testId) : mockTests;
    } catch (error) {
      console.error('Erro ao buscar resultados de testes A/B:', error);
      throw error;
    }
  }

  // Relatórios Customizados
  static async generateCustomReport(config: {
    metrics: string[];
    dimensions: string[];
    filters: AnalyticsFilter;
    format: 'json' | 'csv' | 'pdf';
  }): Promise<{ generated_at: string; config: Record<string, unknown>; data: { summary: Record<string, unknown>; metrics: Record<string, unknown>[]; detailed_data: Record<string, unknown>[] } }> {
    try {
      console.log('Gerando relatório customizado:', config);
      
      // Simular geração de relatório
      const reportData = {
        generated_at: new Date().toISOString(),
        config,
        data: {
          summary: {
            total_records: 1250,
            date_range: `${config.filters.start_date} - ${config.filters.end_date}`
          },
          metrics: config.metrics.map(metric => ({
            name: metric,
            value: Math.floor(Math.random() * 1000),
            change: (Math.random() - 0.5) * 50
          })),
          detailed_data: Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            ...config.dimensions.reduce((acc, dim) => {
              acc[dim] = `${dim}_value_${i + 1}`;
              return acc;
            }, {} as Record<string, string>),
            ...config.metrics.reduce((acc, metric) => {
              acc[metric] = Math.floor(Math.random() * 1000);
              return acc;
            }, {} as Record<string, number>)
          }))
        }
      };

      return reportData;
    } catch (error) {
      console.error('Erro ao gerar relatório customizado:', error);
      throw error;
    }
  }

  // Alertas e Monitoramento
  static async getAlerts(): Promise<Array<{
    id: string;
    type: 'performance' | 'anomaly' | 'threshold' | 'system';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    metric: string;
    current_value: number;
    threshold_value: number;
    created_at: string;
    resolved: boolean;
  }>> {
    try {
      const mockAlerts = [
        {
          id: 'alert_1',
          type: 'threshold' as const,
          severity: 'high' as const,
          title: 'Taxa de conversão baixa',
          description: 'A taxa de conversão caiu abaixo de 5% nas últimas 2 horas',
          metric: 'conversion_rate',
          current_value: 4.2,
          threshold_value: 5.0,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          resolved: false
        },
        {
          id: 'alert_2',
          type: 'anomaly' as const,
          severity: 'medium' as const,
          title: 'Pico incomum de tráfego',
          description: 'Aumento de 300% no tráfego comparado ao mesmo horário da semana passada',
          metric: 'active_users',
          current_value: 1200,
          threshold_value: 300,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          resolved: false
        },
        {
          id: 'alert_3',
          type: 'system' as const,
          severity: 'critical' as const,
          title: 'Tempo de resposta elevado',
          description: 'API respondendo em mais de 2 segundos',
          metric: 'response_time',
          current_value: 2500,
          threshold_value: 1000,
          created_at: new Date(Date.now() - 1800000).toISOString(),
          resolved: true
        }
      ];

      return mockAlerts;
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      throw error;
    }
  }

  // Exportação de Dados
  static async exportData(config: {
    data_type: 'users' | 'merchants' | 'offers' | 'transactions';
    format: 'csv' | 'json' | 'xlsx';
    filters: AnalyticsFilter;
    fields?: string[];
  }): Promise<{ download_url: string; file_size: number; expires_at: string }> {
    try {
      console.log('Exportando dados:', config);
      
      // Simular exportação
      return {
        download_url: `/api/exports/download/${Date.now()}.${config.format}`,
        file_size: 1024 * 1024 * 2.5, // 2.5MB
        expires_at: new Date(Date.now() + 24 * 3600000).toISOString() // 24 horas
      };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  // Benchmarking
  static async getBenchmarkData(): Promise<{
    industry_averages: Record<string, number>;
    your_performance: Record<string, number>;
    percentile_ranking: Record<string, number>;
    improvement_opportunities: Array<{
      metric: string;
      gap: number;
      recommendation: string;
    }>;
  }> {
    try {
      return {
        industry_averages: {
          conversion_rate: 6.2,
          retention_rate: 72.5,
          avg_session_duration: 7.8,
          customer_lifetime_value: 189.50
        },
        your_performance: {
          conversion_rate: 7.8,
          retention_rate: 78.5,
          avg_session_duration: 8.5,
          customer_lifetime_value: 245.60
        },
        percentile_ranking: {
          conversion_rate: 75,
          retention_rate: 82,
          avg_session_duration: 68,
          customer_lifetime_value: 89
        },
        improvement_opportunities: [
          {
            metric: 'avg_session_duration',
            gap: -0.7,
            recommendation: 'Melhorar engajamento com conteúdo personalizado'
          }
        ]
      };
    } catch (error) {
      console.error('Erro ao buscar dados de benchmark:', error);
      throw error;
    }
  }
}