// Sistema de Monitoramento e Logs para DuoPass

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, string | number | boolean>;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  context?: Record<string, string | number | boolean>;
}

export interface UserAction {
  action: string;
  category: string;
  label?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, string | number | boolean>;
}

// Performance API type extensions
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

class Logger {
  private sessionId: string;
  private userId?: string;
  private isProduction: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;
  private flushInterval = 30000; // 30 segundos

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isProduction = import.meta.env.PROD;
    
    // Configurar flush automático
    if (this.isProduction) {
      setInterval(() => this.flushLogs(), this.flushInterval);
    }
    
    // Flush logs antes de sair da página
    window.addEventListener('beforeunload', () => this.flushLogs());
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private createLogEntry(level: LogEntry['level'], message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);
    
    // Manter buffer dentro do limite
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }
    
    // Console log em desenvolvimento
    if (!this.isProduction) {
      const style = this.getConsoleStyle(entry.level);
      console.log(`%c[${entry.level.toUpperCase()}] ${entry.message}`, style, entry.context);
    }
  }

  private getConsoleStyle(level: LogEntry['level']): string {
    const styles = {
      debug: 'color: #888',
      info: 'color: #2196F3',
      warn: 'color: #FF9800',
      error: 'color: #F44336; font-weight: bold'
    };
    return styles[level];
  }

  debug(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('debug', message, context);
    this.addToBuffer(entry);
  }

  info(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('info', message, context);
    this.addToBuffer(entry);
  }

  warn(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('warn', message, context);
    this.addToBuffer(entry);
  }

  error(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('error', message, context);
    this.addToBuffer(entry);
    
    // Enviar erros imediatamente em produção
    if (this.isProduction) {
      this.sendToRemoteLogging([entry]);
    }
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0) return;
    
    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];
    
    if (this.isProduction) {
      await this.sendToRemoteLogging(logsToSend);
    }
  }

  private async sendToRemoteLogging(logs: LogEntry[]) {
    try {
      const endpoint = import.meta.env.VITE_LOGGING_ENDPOINT;
      if (!endpoint) return;
      
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs,
          source: 'duopass-frontend',
          version: import.meta.env.VITE_APP_VERSION || '1.0.0'
        })
      });
    } catch (error) {
      console.error('Erro ao enviar logs:', error);
    }
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observer para Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime, 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
          this.recordMetric('FID', fid, 'ms');
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const layoutShiftEntry = entry as LayoutShift;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
            this.recordMetric('CLS', clsValue, 'score');
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }

    // Métricas de navegação
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.recordMetric('TTFB', navigation.responseStart - navigation.fetchStart, 'ms');
        this.recordMetric('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms');
        this.recordMetric('LoadComplete', navigation.loadEventEnd - navigation.fetchStart, 'ms');
      }, 0);
    });
  }

  recordMetric(name: string, value: number, unit: string, context?: Record<string, unknown>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      context
    };
    
    this.metrics.push(metric);
    
    // Log métrica
    logger.info(`Performance: ${name} = ${value}${unit}`, { metric });
    
    // Enviar para analytics se configurado
    if (import.meta.env.VITE_GA_TRACKING_ID) {
      (window as Record<string, unknown>).gtag?.('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        metric_unit: unit
      });
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics() {
    this.metrics = [];
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

class UserActionTracker {
  private actions: UserAction[] = [];
  private sessionId: string;
  private userId?: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.initializeTracking();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private initializeTracking() {
    // TEMPORARIAMENTE DESABILITADO - CAUSANDO LOOP INFINITO DE NAVEGAÇÃO
    // TODO: Reabilitar após corrigir conflitos com React Router
    
    // Rastrear cliques - DESABILITADO
    /*
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      
      this.trackAction('click', 'interaction', {
        element: tagName,
        className,
        id,
        text: target.textContent?.slice(0, 50)
      });
    });
    */

    // Rastrear mudanças de página - DESABILITADO
    /*
    let currentPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        this.trackAction('page_change', 'navigation', {
          from: currentPath,
          to: window.location.pathname
        });
        currentPath = window.location.pathname;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    */

    // Rastrear tempo na página
    const pageStartTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - pageStartTime;
      this.trackAction('page_exit', 'engagement', {
        timeOnPage,
        path: window.location.pathname
      });
    });
  }

  trackAction(action: string, category: string, metadata?: Record<string, unknown>) {
    const userAction: UserAction = {
      action,
      category,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      metadata
    };
    
    this.actions.push(userAction);
    
    // Log ação
    logger.debug(`User Action: ${category}/${action}`, { userAction });
    
    // Enviar para analytics se configurado
    if (import.meta.env.VITE_GA_TRACKING_ID) {
      (window as Record<string, unknown>).gtag?.('event', action, {
        event_category: category,
        custom_parameters: metadata
      });
    }
  }

  getActions(): UserAction[] {
    return [...this.actions];
  }

  clearActions() {
    this.actions = [];
  }
}

// Instâncias globais
export const logger = new Logger();
export const performanceMonitor = new PerformanceMonitor();
export const userActionTracker = new UserActionTracker(logger['sessionId']);

// Configurar rastreamento de erros globais
window.addEventListener('error', (event) => {
  logger.error('JavaScript Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', {
    reason: event.reason,
    stack: event.reason?.stack
  });
});

// Monitoramento de conectividade
window.addEventListener('online', () => {
  logger.info('Connection restored');
  userActionTracker.trackAction('connection_restored', 'system');
});

window.addEventListener('offline', () => {
  logger.warn('Connection lost');
  userActionTracker.trackAction('connection_lost', 'system');
});

// Monitoramento de visibilidade da página
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    userActionTracker.trackAction('page_hidden', 'engagement');
  } else {
    userActionTracker.trackAction('page_visible', 'engagement');
  }
});

// Funções utilitárias
export const monitoring = {
  // Configurar ID do usuário
  setUserId: (userId: string) => {
    logger.setUserId(userId);
    userActionTracker.setUserId(userId);
  },
  
  // Rastrear evento customizado
  trackEvent: (action: string, category: string, metadata?: Record<string, unknown>) => {
    userActionTracker.trackAction(action, category, metadata);
  },
  
  // Medir performance de função
  measureFunction: async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      performanceMonitor.recordMetric(`function_${name}`, duration, 'ms');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.recordMetric(`function_${name}_error`, duration, 'ms');
      logger.error(`Function ${name} failed`, { error, duration });
      throw error;
    }
  },
  
  // Obter relatório de monitoramento
  getReport: () => {
    return {
      metrics: performanceMonitor.getMetrics(),
      actions: userActionTracker.getActions(),
      timestamp: new Date().toISOString()
    };
  },
  
  // Limpar dados de monitoramento
  clearData: () => {
    performanceMonitor.clearMetrics();
    userActionTracker.clearActions();
  }
};

// Inicialização
logger.info('Monitoring system initialized', {
  sessionId: logger['sessionId'],
  userAgent: navigator.userAgent,
  url: window.location.href
});