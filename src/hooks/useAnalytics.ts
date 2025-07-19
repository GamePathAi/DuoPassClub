import { useState, useEffect, useCallback } from 'react';
import { AnalyticsAgent, BusinessMetric, BusinessInsight, AnalyticsPeriod } from '../services/analytics-agent';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export interface AnalyticsState {
  metrics: BusinessMetric[];
  insights: BusinessInsight[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface KPICard {
  title: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [state, setState] = useState<AnalyticsState>({
    metrics: [],
    insights: [],
    loading: false,
    error: null,
    lastUpdated: null
  });
  
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [refreshing, setRefreshing] = useState(false);
  
  const analyticsAgent = AnalyticsAgent.getInstance();

  // Check if user has admin access
  const hasAccess = user?.user_type === 'admin';

  // Generate period based on selection
  const getCurrentPeriod = useCallback((): AnalyticsPeriod => {
    const now = new Date();
    let start: Date;
    
    switch (selectedPeriod) {
      case 'daily':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'monthly':
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    
    return {
      start,
      end: now,
      type: selectedPeriod
    };
  }, [selectedPeriod]);

  // Load existing data from database
  const loadStoredData = useCallback(async () => {
    if (!hasAccess) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const period = getCurrentPeriod();
      const [metrics, insights] = await Promise.all([
        analyticsAgent.getMetrics(period),
        analyticsAgent.getInsights(20)
      ]);
      
      setState(prev => ({
        ...prev,
        metrics,
        insights,
        loading: false,
        lastUpdated: new Date()
      }));
    } catch (error) {
      console.error('Error loading stored data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar dados armazenados'
      }));
    }
  }, [hasAccess, getCurrentPeriod, analyticsAgent]);

  // Run fresh analysis
  const runAnalysis = useCallback(async () => {
    if (!hasAccess) return;
    
    try {
      setRefreshing(true);
      setState(prev => ({ ...prev, error: null }));
      
      const period = getCurrentPeriod();
      const result = await analyticsAgent.runCompleteAnalysis(period, language);
      
      setState(prev => ({
        ...prev,
        metrics: result.metrics,
        insights: result.insights,
        lastUpdated: new Date()
      }));
    } catch (error) {
      console.error('Error running analysis:', error);
      setState(prev => ({
        ...prev,
        error: 'Erro ao executar análise. Verifique sua conexão e tente novamente.'
      }));
    } finally {
      setRefreshing(false);
    }
  }, [hasAccess, getCurrentPeriod, analyticsAgent, language]);

  // Generate KPI cards from metrics
  const getKPICards = useCallback((): KPICard[] => {
    const cards: KPICard[] = [];
    
    // New Users KPI
    const newUsersMetric = state.metrics.find(m => m.metric_name === 'new_users');
    if (newUsersMetric) {
      cards.push({
        title: 'Novos Usuários',
        value: newUsersMetric.metric_value,
        change: newUsersMetric.percentage_change || 0,
        trend: (newUsersMetric.percentage_change || 0) >= 0 ? 'up' : 'down',
        icon: 'Users',
        color: 'from-blue-500 to-blue-600'
      });
    }
    
    // Voucher Usage Rate KPI
    const usageRateMetric = state.metrics.find(m => m.metric_name === 'voucher_usage_rate');
    if (usageRateMetric) {
      cards.push({
        title: 'Taxa de Uso',
        value: `${usageRateMetric.metric_value.toFixed(1)}%`,
        change: usageRateMetric.percentage_change || 0,
        trend: (usageRateMetric.metric_value || 0) >= 50 ? 'up' : 'down',
        icon: 'Ticket',
        color: 'from-green-500 to-green-600'
      });
    }
    
    // Total Users KPI
    const totalUsersMetric = state.metrics.find(m => m.metric_name === 'total_users');
    if (totalUsersMetric) {
      cards.push({
        title: 'Total de Usuários',
        value: totalUsersMetric.metric_value,
        trend: 'up',
        icon: 'UserCheck',
        color: 'from-purple-500 to-purple-600'
      });
    }
    
    // Partner Performance KPI
    const partnerMetric = state.metrics.find(m => m.metric_name === 'avg_partner_performance');
    if (partnerMetric) {
      cards.push({
        title: 'Performance Parceiros',
        value: `${partnerMetric.metric_value.toFixed(1)}%`,
        trend: (partnerMetric.metric_value || 0) >= 60 ? 'up' : 'down',
        icon: 'Store',
        color: 'from-orange-500 to-orange-600'
      });
    }
    
    return cards;
  }, [state.metrics]);

  // Generate chart data for visualizations
  const getChartData = useCallback(() => {
    const growthData: ChartData[] = [];
    const voucherData: ChartData[] = [];
    const partnerData: ChartData[] = [];
    
    // Growth chart data
    const growthMetrics = state.metrics.filter(m => m.metric_type === 'growth');
    growthMetrics.forEach(metric => {
      if (metric.metric_name === 'new_users') {
        growthData.push({
          name: 'Novos Usuários',
          value: metric.metric_value,
          date: metric.period_start
        });
      }
    });
    
    // Voucher performance data
    const voucherMetrics = state.metrics.filter(m => m.metric_type === 'voucher_performance');
    voucherMetrics.forEach(metric => {
      if (metric.metric_name === 'vouchers_created') {
        voucherData.push({
          name: 'Criados',
          value: metric.metric_value
        });
      } else if (metric.metric_name === 'vouchers_used') {
        voucherData.push({
          name: 'Utilizados',
          value: metric.metric_value
        });
      }
    });
    
    // Partner data from metadata
    const partnerMetrics = state.metrics.filter(m => m.metric_type === 'partner_analysis');
    partnerMetrics.forEach(metric => {
      if (metric.metadata?.merchant_stats) {
        Object.entries(metric.metadata.merchant_stats).forEach(([merchant, stats]: [string, { created: number; used: number; category?: string }]) => {
          partnerData.push({
            name: merchant,
            value: stats.created > 0 ? (stats.used / stats.created) * 100 : 0,
            category: stats.category
          });
        });
      }
    });
    
    return {
      growth: growthData,
      vouchers: voucherData,
      partners: partnerData.slice(0, 10) // Top 10 partners
    };
  }, [state.metrics]);

  // Get alerts from insights
  const getAlerts = useCallback(() => {
    return state.insights
      .filter(insight => insight.priority_level === 'critical' || insight.priority_level === 'warning')
      .sort((a, b) => {
        const priorityOrder = { critical: 3, warning: 2, info: 1 };
        return priorityOrder[b.priority_level] - priorityOrder[a.priority_level];
      })
      .slice(0, 5); // Top 5 alerts
  }, [state.insights]);

  // Get performance insights
  const getPerformanceInsights = useCallback(() => {
    return state.insights
      .filter(insight => insight.insight_type === 'performance' || insight.insight_type === 'optimization')
      .slice(0, 3);
  }, [state.insights]);

  // Auto-load data on mount and period change
  useEffect(() => {
    if (hasAccess) {
      loadStoredData();
    }
  }, [hasAccess, loadStoredData]);

  // Refresh data every 5 minutes
  useEffect(() => {
    if (!hasAccess) return;
    
    const interval = setInterval(() => {
      loadStoredData();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [hasAccess, loadStoredData]);

  return {
    // State
    ...state,
    refreshing,
    selectedPeriod,
    hasAccess,
    
    // Actions
    setSelectedPeriod,
    runAnalysis,
    loadStoredData,
    
    // Computed data
    kpiCards: getKPICards(),
    chartData: getChartData(),
    alerts: getAlerts(),
    performanceInsights: getPerformanceInsights(),
    
    // Utilities
    getCurrentPeriod
  };
};

export default useAnalytics;