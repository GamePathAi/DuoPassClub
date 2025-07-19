// Otimizações de Performance para DuoPass
import React from 'react';

// Preload de recursos críticos
export const preloadCriticalResources = () => {
  const resources = [
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
    { href: '/images/logo.svg', as: 'image' },
    { href: '/images/hero-bg.webp', as: 'image' }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) {
      link.type = resource.type;
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

// Otimização de imagens
export const optimizeImage = (src: string, width?: number, quality = 80) => {
  // Para produção, usar um serviço de otimização de imagens
  if (import.meta.env.PROD && import.meta.env.VITE_IMAGE_CDN_URL) {
    const baseUrl = import.meta.env.VITE_IMAGE_CDN_URL;
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    params.append('q', quality.toString());
    params.append('f', 'webp');
    
    return `${baseUrl}${src}?${params.toString()}`;
  }
  
  return src;
};

// Debounce para otimizar eventos
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle para otimizar eventos de scroll
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Cache em memória para dados frequentemente acessados
class MemoryCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
  
  set(key: string, data: unknown, ttl = 300000) { // 5 minutos por padrão
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
}

export const memoryCache = new MemoryCache();

// Intersection Observer para lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver não suportado');
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Prefetch de rotas
export const prefetchRoute = (path: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
};

// Otimização de bundle splitting (removido para evitar problemas de build)
// export const loadChunk = async (chunkName: string) => {
//   // Funcionalidade removida para resolver problemas de rollup
//   console.warn('loadChunk function disabled for build compatibility');
//   return null;
// };

// Monitoramento de performance
export const performanceObserver = {
  observeLCP: (callback: (value: number) => void) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callback(lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      return observer;
    }
  },
  
  observeFID: (callback: (value: number) => void) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEventTiming) => {
          callback(entry.processingStart - entry.startTime);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      return observer;
    }
  },
  
  observeCLS: (callback: (value: number) => void) => {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: LayoutShift) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            callback(clsValue);
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      return observer;
    }
  }
};

// Otimização de recursos críticos
export const criticalResourceHints = () => {
  // DNS prefetch para domínios externos
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://js.stripe.com'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect para recursos críticos
  const criticalDomains = [
    'https://fonts.googleapis.com',
    'https://js.stripe.com'
  ];
  
  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão disponível
              console.log('Nova versão da aplicação disponível');
              // Aqui você pode mostrar uma notificação para o usuário
            }
          });
        }
      });
      
      console.log('Service Worker registrado com sucesso');
      return registration;
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }
};

// Inicialização das otimizações
export const initializePerformanceOptimizations = () => {
  // Executar apenas no cliente
  if (typeof window === 'undefined') return;
  
  // Resource hints
  criticalResourceHints();
  
  // Preload recursos críticos
  preloadCriticalResources();
  
  // Registrar Service Worker
  registerServiceWorker();
  
  // Observar métricas de performance
  performanceObserver.observeLCP((value) => {
    console.log('LCP:', value);
  });
  
  performanceObserver.observeFID((value) => {
    console.log('FID:', value);
  });
  
  performanceObserver.observeCLS((value) => {
    console.log('CLS:', value);
  });
};

// React import (assumindo que está disponível)
declare const React: typeof import('react');