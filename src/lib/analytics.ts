// Analytics e Error Tracking para DuoPass

// Tipos para eventos de analytics
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
}

// Declaração global para gtag
declare global {
  interface Window {
    gtag: (command: string, targetId?: string, config?: Record<string, unknown>) => void;
    dataLayer: Record<string, unknown>[];
  }
}

// Configuração do Google Analytics
class GoogleAnalytics {
  private isEnabled: boolean;
  private trackingId: string;

  constructor() {
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID || '';
    this.isEnabled = !!this.trackingId && import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    
    if (this.isEnabled) {
      this.initialize();
    }
  }

  private initialize() {
    // Carregar Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.trackingId, {
      page_title: 'DuoPass',
      page_location: window.location.href,
      custom_map: {
        dimension1: 'user_type',
        dimension2: 'subscription_status'
      }
    });

    console.log('[Analytics] Google Analytics inicializado');
  }

  // Rastrear evento
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });

    console.log('[Analytics] Evento rastreado:', event);
  }

  // Rastrear página
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled) return;

    window.gtag('config', this.trackingId, {
      page_path: path,
      page_title: title || document.title
    });

    console.log('[Analytics] Página rastreada:', path);
  }

  // Rastrear conversão
  trackConversion(conversionId: string, value?: number) {
    if (!this.isEnabled) return;

    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: 'CHF'
    });

    console.log('[Analytics] Conversão rastreada:', conversionId);
  }

  // Definir propriedades do usuário
  setUserProperties(properties: Record<string, unknown>) {
    if (!this.isEnabled) return;

    window.gtag('config', this.trackingId, {
      custom_map: properties
    });

    console.log('[Analytics] Propriedades do usuário definidas:', properties);
  }
}

// Configuração do Sentry para Error Tracking
class ErrorTracking {
  private isEnabled: boolean;
  private sentryDsn: string;

  constructor() {
    this.sentryDsn = import.meta.env.VITE_SENTRY_DSN || '';
    this.isEnabled = !!this.sentryDsn && import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true';
    
    if (this.isEnabled) {
      this.initialize();
    }
  }

  private async initialize() {
    try {
      // Verificar se Sentry está disponível
      if (typeof window !== 'undefined' && (window as Record<string, unknown>).Sentry) {
        const Sentry = (window as Record<string, unknown>).Sentry;
        
        Sentry.init({
          dsn: this.sentryDsn,
          environment: import.meta.env.MODE,
          tracesSampleRate: 0.1,
          beforeSend(event: Record<string, unknown>) {
            // Filtrar erros irrelevantes
            if (event.exception) {
              const error = event.exception.values?.[0];
              if (error?.value?.includes('Non-Error promise rejection')) {
                return null;
              }
            }
            return event;
          }
        });

        console.log('[ErrorTracking] Sentry inicializado');
      } else {
        console.warn('[ErrorTracking] Sentry não disponível');
      }
    } catch (error) {
      console.warn('[ErrorTracking] Erro ao inicializar Sentry:', error);
    }
  }

  // Capturar erro
  captureError(error: Error, context?: Record<string, unknown>) {
    if (!this.isEnabled) {
      console.error('[ErrorTracking] Erro capturado:', error, context);
      return;
    }

    try {
      if (typeof window !== 'undefined' && (window as Record<string, unknown>).Sentry) {
        const Sentry = (window as Record<string, unknown>).Sentry as Record<string, unknown>;
        if (context) {
          (Sentry.withScope as (callback: (scope: Record<string, unknown>) => void) => void)((scope: Record<string, unknown>) => {
            Object.keys(context).forEach(key => {
              (scope.setContext as (key: string, value: unknown) => void)(key, context[key]);
            });
            (Sentry.captureException as (error: Error) => void)(error);
          });
        } else {
          (Sentry.captureException as (error: Error) => void)(error);
        }
      } else {
        console.error('[ErrorTracking] Erro capturado:', error, context);
      }
    } catch {
      console.error('[ErrorTracking] Erro capturado:', error, context);
    }
  }

  // Capturar mensagem
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (!this.isEnabled) {
      console.log(`[ErrorTracking] ${level.toUpperCase()}:`, message);
      return;
    }

    try {
      if (typeof window !== 'undefined' && (window as Record<string, unknown>).Sentry) {
        const Sentry = (window as Record<string, unknown>).Sentry as Record<string, unknown>;
        (Sentry.captureMessage as (message: string, level: string) => void)(message, level);
      } else {
        console.log(`[ErrorTracking] ${level.toUpperCase()}:`, message);
      }
    } catch {
      console.log(`[ErrorTracking] ${level.toUpperCase()}:`, message);
    }
  }

  // Definir contexto do usuário
  setUserContext(user: { id?: string; email?: string; type?: string }) {
    if (!this.isEnabled) return;

    try {
      if (typeof window !== 'undefined' && (window as Record<string, unknown>).Sentry) {
        const Sentry = (window as Record<string, unknown>).Sentry as Record<string, unknown>;
        (Sentry.setUser as (user: Record<string, unknown>) => void)(user);
      }
    } catch (error) {
      console.warn('[ErrorTracking] Erro ao definir contexto do usuário:', error);
    }
  }
}

// Instâncias globais
export const analytics = new GoogleAnalytics();
export const errorTracking = new ErrorTracking();

// Eventos pré-definidos para o DuoPass
export const trackingEvents = {
  // Autenticação
  signUp: (userType: string) => analytics.trackEvent({
    action: 'sign_up',
    category: 'authentication',
    label: userType
  }),
  
  signIn: (userType: string) => analytics.trackEvent({
    action: 'sign_in',
    category: 'authentication',
    label: userType
  }),
  
  emailConfirmation: (success: boolean) => analytics.trackEvent({
    action: 'email_confirmation',
    category: 'authentication',
    label: success ? 'success' : 'failed'
  }),
  
  // Ofertas
  viewOffer: (offerId: string) => analytics.trackEvent({
    action: 'view_offer',
    category: 'offers',
    label: offerId
  }),
  
  purchaseOffer: (offerId: string, value: number) => analytics.trackEvent({
    action: 'purchase',
    category: 'ecommerce',
    label: offerId,
    value: value
  }),
  
  // Navegação
  pageView: (path: string) => analytics.trackPageView(path),
  
  // Erros
  error: (error: Error, context?: Record<string, unknown>) => {
    errorTracking.captureError(error, context);
    analytics.trackEvent({
      action: 'error',
      category: 'technical',
      label: error.message
    });
  },
  
  // Performance
  performanceMetric: (metric: string, value: number) => analytics.trackEvent({
    action: 'performance_metric',
    category: 'performance',
    label: metric,
    value: value
  })
};

// Hook para React Router
export const useAnalytics = () => {
  const trackPageView = (path: string) => {
    analytics.trackPageView(path);
  };
  
  const trackEvent = (event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  };
  
  return { trackPageView, trackEvent };
};

// Monitoramento de Performance
export const performanceMonitoring = {
  // Medir tempo de carregamento
  measurePageLoad: () => {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      trackingEvents.performanceMetric('page_load_time', loadTime);
    });
  },
  
  // Medir Core Web Vitals (implementação simplificada)
  measureWebVitals: () => {
    try {
      // Usar PerformanceObserver nativo para métricas básicas
      if ('PerformanceObserver' in window) {
        // LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          trackingEvents.performanceMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // FID
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: PerformanceEventTiming) => {
            trackingEvents.performanceMetric('FID', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // CLS
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: LayoutShift) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              trackingEvents.performanceMetric('CLS', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    } catch (error) {
      console.warn('[Analytics] Erro ao medir Web Vitals:', error);
    }
  }
};

// Inicializar monitoramento de performance
if (typeof window !== 'undefined') {
  performanceMonitoring.measurePageLoad();
  performanceMonitoring.measureWebVitals();
}