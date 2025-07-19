import { supabase } from '../lib/supabase';
import { Language } from '../types';

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Gemini API call function
const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key não configurada. Adicione VITE_GEMINI_API_KEY no arquivo .env');
  }

  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

export interface BusinessMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'growth' | 'voucher_performance' | 'partner_analysis' | 'seasonal';
  period_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  period_start: string;
  period_end: string;
  comparison_value?: number;
  percentage_change?: number;
  metadata?: Record<string, unknown>;
}

export interface BusinessInsight {
  id?: string;
  insight_type: 'performance' | 'optimization' | 'prediction' | 'alert';
  priority_level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendations?: string;
  affected_metrics?: string[];
  confidence_score?: number;
  period_analyzed: string;
  data_context?: Record<string, unknown>;
  is_active?: boolean;
  expires_at?: string;
}

export interface AnalyticsPeriod {
  start: Date;
  end: Date;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export class AnalyticsAgent {
  private static instance: AnalyticsAgent;

  public static getInstance(): AnalyticsAgent {
    if (!AnalyticsAgent.instance) {
      AnalyticsAgent.instance = new AnalyticsAgent();
    }
    return AnalyticsAgent.instance;
  }

  // Calculate growth metrics
  async calculateGrowthMetrics(period: AnalyticsPeriod): Promise<BusinessMetric[]> {
    const metrics: BusinessMetric[] = [];
    
    try {
      // New users in period
      const { data: newUsers } = await supabase
        .from('users')
        .select('id')
        .gte('created_at', period.start.toISOString())
        .lte('created_at', period.end.toISOString());

      // Previous period for comparison
      const previousPeriod = this.getPreviousPeriod(period);
      const { data: previousUsers } = await supabase
        .from('users')
        .select('id')
        .gte('created_at', previousPeriod.start.toISOString())
        .lte('created_at', previousPeriod.end.toISOString());

      const newUsersCount = newUsers?.length || 0;
      const previousUsersCount = previousUsers?.length || 0;
      const growthRate = previousUsersCount > 0 
        ? ((newUsersCount - previousUsersCount) / previousUsersCount) * 100 
        : 0;

      metrics.push({
        metric_name: 'new_users',
        metric_value: newUsersCount,
        metric_type: 'growth',
        period_type: period.type,
        period_start: period.start.toISOString().split('T')[0],
        period_end: period.end.toISOString().split('T')[0],
        comparison_value: previousUsersCount,
        percentage_change: growthRate,
        metadata: { period_analyzed: `${period.start.toDateString()} - ${period.end.toDateString()}` }
      });

      // Total active users
      const { data: totalUsers } = await supabase
        .from('users')
        .select('id')
        .lte('created_at', period.end.toISOString());

      metrics.push({
        metric_name: 'total_users',
        metric_value: totalUsers?.length || 0,
        metric_type: 'growth',
        period_type: period.type,
        period_start: period.start.toISOString().split('T')[0],
        period_end: period.end.toISOString().split('T')[0],
        metadata: { cumulative: true }
      });

      return metrics;
    } catch (error) {
      console.error('Error calculating growth metrics:', error);
      return [];
    }
  }

  // Calculate voucher performance metrics
  async calculateVoucherMetrics(period: AnalyticsPeriod): Promise<BusinessMetric[]> {
    const metrics: BusinessMetric[] = [];
    
    try {
      // Vouchers created in period
      const { data: vouchersCreated } = await supabase
        .from('vouchers')
        .select('id, used_at')
        .gte('created_at', period.start.toISOString())
        .lte('created_at', period.end.toISOString());

      const totalCreated = vouchersCreated?.length || 0;
      const totalUsed = vouchersCreated?.filter(v => v.used_at).length || 0;
      const usageRate = totalCreated > 0 ? (totalUsed / totalCreated) * 100 : 0;

      metrics.push(
        {
          metric_name: 'vouchers_created',
          metric_value: totalCreated,
          metric_type: 'voucher_performance',
          period_type: period.type,
          period_start: period.start.toISOString().split('T')[0],
          period_end: period.end.toISOString().split('T')[0]
        },
        {
          metric_name: 'vouchers_used',
          metric_value: totalUsed,
          metric_type: 'voucher_performance',
          period_type: period.type,
          period_start: period.start.toISOString().split('T')[0],
          period_end: period.end.toISOString().split('T')[0]
        },
        {
          metric_name: 'voucher_usage_rate',
          metric_value: usageRate,
          metric_type: 'voucher_performance',
          period_type: period.type,
          period_start: period.start.toISOString().split('T')[0],
          period_end: period.end.toISOString().split('T')[0],
          metadata: { threshold_warning: 50 } // Alert if below 50%
        }
      );

      return metrics;
    } catch (error) {
      console.error('Error calculating voucher metrics:', error);
      return [];
    }
  }

  // Calculate partner analysis metrics
  async calculatePartnerMetrics(period: AnalyticsPeriod): Promise<BusinessMetric[]> {
    const metrics: BusinessMetric[] = [];
    
    try {
      // Partner performance analysis
      const { data: offers } = await supabase
        .from('offers')
        .select(`
          id, merchant_name, category,
          vouchers!inner(id, used_at, created_at)
        `)
        .gte('vouchers.created_at', period.start.toISOString())
        .lte('vouchers.created_at', period.end.toISOString());

      if (offers) {
        // Group by merchant
        const merchantStats = offers.reduce((acc: Record<string, { created: number; used: number; category: string }>, offer) => {
          const merchant = offer.merchant_name;
          if (!acc[merchant]) {
            acc[merchant] = { created: 0, used: 0, category: offer.category };
          }
          acc[merchant].created += offer.vouchers.length;
          acc[merchant].used += offer.vouchers.filter((v: { used_at?: string }) => v.used_at).length;
          return acc;
        }, {});

        // Calculate average partner performance
        const partnerCount = Object.keys(merchantStats).length;
        const avgUsageRate = partnerCount > 0 
          ? Object.values(merchantStats).reduce((sum: number, stats: { created: number; used: number; category: string }) => {
              return sum + (stats.created > 0 ? (stats.used / stats.created) * 100 : 0);
            }, 0) / partnerCount
          : 0;

        metrics.push({
          metric_name: 'avg_partner_performance',
          metric_value: avgUsageRate,
          metric_type: 'partner_analysis',
          period_type: period.type,
          period_start: period.start.toISOString().split('T')[0],
          period_end: period.end.toISOString().split('T')[0],
          metadata: { partner_count: partnerCount, merchant_stats: merchantStats }
        });
      }

      return metrics;
    } catch (error) {
      console.error('Error calculating partner metrics:', error);
      return [];
    }
  }

  // Generate AI insights from metrics
  async generateInsights(metrics: BusinessMetric[], period: AnalyticsPeriod, language: Language = 'pt'): Promise<BusinessInsight[]> {
    try {
      const prompt = this.buildAnalysisPrompt(metrics, period, language);
      const systemPrompt = this.getSystemPrompt(language);
      
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      const analysisText = await callGeminiAPI(fullPrompt);
      
      return this.parseInsightsFromAnalysis(analysisText, period);
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  // Save metrics to database
  async saveMetrics(metrics: BusinessMetric[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('business_metrics')
        .insert(metrics);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving metrics:', error);
      throw error;
    }
  }

  // Save insights to database
  async saveInsights(insights: BusinessInsight[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('business_insights')
        .insert(insights);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving insights:', error);
      throw error;
    }
  }

  // Get stored metrics
  async getMetrics(period: AnalyticsPeriod, metricType?: string): Promise<BusinessMetric[]> {
    try {
      let query = supabase
        .from('business_metrics')
        .select('*')
        .gte('period_start', period.start.toISOString().split('T')[0])
        .lte('period_end', period.end.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return [];
    }
  }

  // Get stored insights
  async getInsights(limit: number = 10, priorityLevel?: string): Promise<BusinessInsight[]> {
    try {
      let query = supabase
        .from('business_insights')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (priorityLevel) {
        query = query.eq('priority_level', priorityLevel);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  }

  // Run complete analysis for a period
  async runCompleteAnalysis(period: AnalyticsPeriod, language: Language = 'pt'): Promise<{
    metrics: BusinessMetric[];
    insights: BusinessInsight[];
  }> {
    try {
      // Calculate all metrics
      const [growthMetrics, voucherMetrics, partnerMetrics] = await Promise.all([
        this.calculateGrowthMetrics(period),
        this.calculateVoucherMetrics(period),
        this.calculatePartnerMetrics(period)
      ]);

      const allMetrics = [...growthMetrics, ...voucherMetrics, ...partnerMetrics];
      
      // Generate insights
      const insights = await this.generateInsights(allMetrics, period, language);
      
      // Save to database
      await Promise.all([
        this.saveMetrics(allMetrics),
        this.saveInsights(insights)
      ]);

      return { metrics: allMetrics, insights };
    } catch (error) {
      console.error('Error running complete analysis:', error);
      throw error;
    }
  }

  // Helper methods
  private getPreviousPeriod(period: AnalyticsPeriod): AnalyticsPeriod {
    const duration = period.end.getTime() - period.start.getTime();
    return {
      start: new Date(period.start.getTime() - duration),
      end: new Date(period.start.getTime()),
      type: period.type
    };
  }

  private buildAnalysisPrompt(metrics: BusinessMetric[], period: AnalyticsPeriod, language: Language): string {
    const metricsText = metrics.map(m => 
      `${m.metric_name}: ${m.metric_value}${m.percentage_change ? ` (${m.percentage_change > 0 ? '+' : ''}${m.percentage_change.toFixed(1)}%)` : ''}`
    ).join('\n');

    const prompts = {
      pt: `Analise as seguintes métricas do DUO PASS Club para o período ${period.start.toDateString()} - ${period.end.toDateString()}:

${metricsText}

Gere insights categorizados em:
1. PERFORMANCE (o que está funcionando bem)
2. OPTIMIZATION (oportunidades de melhoria)
3. PREDICTION (tendências futuras)
4. ALERT (problemas que precisam atenção)

Para cada insight, forneça:
- Título claro
- Descrição detalhada
- Recomendações específicas
- Nível de prioridade (critical/warning/info)`,
      en: `Analyze the following DUO PASS Club metrics for the period ${period.start.toDateString()} - ${period.end.toDateString()}:

${metricsText}

Generate insights categorized as:
1. PERFORMANCE (what's working well)
2. OPTIMIZATION (improvement opportunities)
3. PREDICTION (future trends)
4. ALERT (issues requiring attention)

For each insight, provide:
- Clear title
- Detailed description
- Specific recommendations
- Priority level (critical/warning/info)`,
      fr: `Analysez les métriques suivantes du DUO PASS Club pour la période ${period.start.toDateString()} - ${period.end.toDateString()}:

${metricsText}

Générez des insights catégorisés en:
1. PERFORMANCE (ce qui fonctionne bien)
2. OPTIMIZATION (opportunités d'amélioration)
3. PREDICTION (tendances futures)
4. ALERT (problèmes nécessitant attention)

Pour chaque insight, fournissez:
- Titre clair
- Description détaillée
- Recommandations spécifiques
- Niveau de priorité (critical/warning/info)`,
      de: `Analysieren Sie die folgenden DUO PASS Club Metriken für den Zeitraum ${period.start.toDateString()} - ${period.end.toDateString()}:

${metricsText}

Generieren Sie Erkenntnisse kategorisiert als:
1. PERFORMANCE (was gut funktioniert)
2. OPTIMIZATION (Verbesserungsmöglichkeiten)
3. PREDICTION (zukünftige Trends)
4. ALERT (Probleme, die Aufmerksamkeit erfordern)

Für jede Erkenntnis, geben Sie an:
- Klarer Titel
- Detaillierte Beschreibung
- Spezifische Empfehlungen
- Prioritätsstufe (critical/warning/info)`,
      it: `Analizza le seguenti metriche del DUO PASS Club per il periodo ${period.start.toDateString()} - ${period.end.toDateString()}:

${metricsText}

Genera insights categorizzati come:
1. PERFORMANCE (cosa funziona bene)
2. OPTIMIZATION (opportunità di miglioramento)
3. PREDICTION (tendenze future)
4. ALERT (problemi che richiedono attenzione)

Per ogni insight, fornisci:
- Titolo chiaro
- Descrizione dettagliata
- Raccomandazioni specifiche
- Livello di priorità (critical/warning/info)`,
      es: `Analiza las siguientes métricas del DUO PASS Club para el período ${period.start.toDateString()} - ${period.end.toDateString()}:

${metricsText}

Genera insights categorizados como:
1. PERFORMANCE (lo que funciona bien)
2. OPTIMIZATION (oportunidades de mejora)
3. PREDICTION (tendencias futuras)
4. ALERT (problemas que requieren atención)

Para cada insight, proporciona:
- Título claro
- Descripción detallada
- Recomendaciones específicas
- Nivel de prioridad (critical/warning/info)`
    };

    return prompts[language] || prompts.pt;
  }

  private getSystemPrompt(language: Language): string {
    const systemPrompts = {
      pt: `Você é Sofia, analista de Business Intelligence do DUO PASS Club. 
            Analise as métricas fornecidas e gere insights acionáveis em português.
            Foque em identificar tendências, oportunidades e alertas críticos.
            Seja específica e forneça recomendações práticas.`,
      en: `You are Sofia, Business Intelligence analyst for DUO PASS Club. 
            Analyze the provided metrics and generate actionable insights in English.
            Focus on identifying trends, opportunities and critical alerts.
            Be specific and provide practical recommendations.`,
      fr: `Vous êtes Sofia, analyste Business Intelligence du DUO PASS Club. 
            Analysez les métriques fournies et générez des insights actionnables en français.
            Concentrez-vous sur l'identification des tendances, opportunités et alertes critiques.
            Soyez spécifique et fournissez des recommandations pratiques.`,
      de: `Sie sind Sofia, Business Intelligence Analystin für DUO PASS Club. 
            Analysieren Sie die bereitgestellten Metriken und generieren Sie umsetzbare Erkenntnisse auf Deutsch.
            Konzentrieren Sie sich auf die Identifizierung von Trends, Chancen und kritischen Warnungen.
            Seien Sie spezifisch und geben Sie praktische Empfehlungen.`,
      it: `Sei Sofia, analista di Business Intelligence per DUO PASS Club. 
            Analizza le metriche fornite e genera insights azionabili in italiano.
            Concentrati sull'identificazione di tendenze, opportunità e avvisi critici.
            Sii specifica e fornisci raccomandazioni pratiche.`,
      es: `Eres Sofia, analista de Business Intelligence para DUO PASS Club. 
            Analiza las métricas proporcionadas y genera insights accionables en español.
            Enfócate en identificar tendencias, oportunidades y alertas críticas.
            Sé específica y proporciona recomendaciones prácticas.`
    };

    return systemPrompts[language] || systemPrompts.pt;
  }

  private parseInsightsFromAnalysis(analysisText: string, period: AnalyticsPeriod): BusinessInsight[] {
    const insights: BusinessInsight[] = [];
    
    // Simple parsing - in production, you might want more sophisticated parsing
    const sections = analysisText.split(/\d+\./g).filter(s => s.trim());
    
    sections.forEach((section, index) => {
      const lines = section.trim().split('\n').filter(l => l.trim());
      if (lines.length >= 2) {
        const title = lines[0].replace(/^[A-Z]+\s*\(.*?\)\s*:?\s*/i, '').trim();
        const description = lines.slice(1).join(' ').trim();
        
        let insightType: BusinessInsight['insight_type'] = 'performance';
        let priorityLevel: BusinessInsight['priority_level'] = 'info';
        
        if (section.toLowerCase().includes('performance')) insightType = 'performance';
        else if (section.toLowerCase().includes('optimization')) insightType = 'optimization';
        else if (section.toLowerCase().includes('prediction')) insightType = 'prediction';
        else if (section.toLowerCase().includes('alert')) insightType = 'alert';
        
        if (section.toLowerCase().includes('critical') || section.toLowerCase().includes('crítico')) {
          priorityLevel = 'critical';
        } else if (section.toLowerCase().includes('warning') || section.toLowerCase().includes('atenção')) {
          priorityLevel = 'warning';
        }
        
        insights.push({
          insight_type: insightType,
          priority_level: priorityLevel,
          title: title.substring(0, 200),
          description: description.substring(0, 1000),
          period_analyzed: `${period.start.toDateString()} - ${period.end.toDateString()}`,
          confidence_score: 0.8,
          data_context: { analysis_section: index + 1 }
        });
      }
    });
    
    return insights;
  }
}