# 🚀 PLANO DE IMPLEMENTAÇÃO - REFATORAÇÃO DUOPASS

## 📋 RESUMO EXECUTIVO

**Objetivo:** Eliminar duplicações e otimizar arquitetura mantendo funcionalidades  
**Prazo:** 4-6 semanas  
**Impacto:** Redução de 70% na duplicação de código  
**Risco:** Baixo (refatoração incremental)  

---

## 🎯 FASE 1: FUNDAÇÃO (Semana 1-2)

### 1.1 Criar DashboardBase Component

```typescript
// src/components/base/DashboardBase.tsx
interface DashboardBaseProps {
  userType: 'customer' | 'merchant' | 'partner' | 'admin';
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
}

export const DashboardBase: React.FC<DashboardBaseProps> = ({
  userType,
  title,
  subtitle,
  actions,
  sidebar,
  children,
  loading,
  error
}) => {
  return (
    <div className={`dashboard dashboard--${userType}`}>
      <Header title={title} subtitle={subtitle} actions={actions} />
      <div className="dashboard__content">
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <main className="dashboard__main">
          {loading && <LoadingSpinner />}
          {error && <ErrorBoundary error={error} />}
          {!loading && !error && children}
        </main>
      </div>
    </div>
  );
};
```

### 1.2 Refatorar CustomerDashboard

```typescript
// src/pages/CustomerDashboard.tsx - ANTES
export const CustomerDashboard = () => {
  // 200+ linhas de código duplicado
};

// src/pages/CustomerDashboard.tsx - DEPOIS
export const CustomerDashboard = () => {
  const { vouchers, offers, loading, error } = useCustomerData();
  
  return (
    <DashboardBase
      userType="customer"
      title="Meu DuoPass"
      subtitle="Seus vouchers e ofertas"
      loading={loading}
      error={error}
    >
      <CustomerContent vouchers={vouchers} offers={offers} />
    </DashboardBase>
  );
};
```

### 1.3 Sistema de Cache Centralizado

```typescript
// src/lib/cache/CacheManager.ts
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 300000) { // 5min default
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
  
  invalidate(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();
```

---

## 🧩 FASE 2: COMPONENTES (Semana 2-3)

### 2.1 CardBase Unificado

```typescript
// src/components/base/CardBase.tsx
interface CardBaseProps {
  variant: 'offer' | 'voucher' | 'experience' | 'user';
  title: string;
  subtitle?: string;
  image?: string;
  status?: string;
  actions?: React.ReactNode;
  metadata?: Record<string, any>;
  onClick?: () => void;
  className?: string;
}

export const CardBase: React.FC<CardBaseProps> = ({
  variant,
  title,
  subtitle,
  image,
  status,
  actions,
  metadata,
  onClick,
  className
}) => {
  const cardConfig = getCardConfig(variant);
  
  return (
    <div 
      className={`card card--${variant} ${className || ''}`}
      onClick={onClick}
    >
      {image && (
        <div className="card__image">
          <img src={image} alt={title} loading="lazy" />
        </div>
      )}
      
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        
        {status && (
          <span className={`card__status card__status--${status}`}>
            {cardConfig.statusLabels[status]}
          </span>
        )}
        
        {metadata && (
          <div className="card__metadata">
            {cardConfig.renderMetadata(metadata)}
          </div>
        )}
      </div>
      
      {actions && (
        <div className="card__actions">
          {actions}
        </div>
      )}
    </div>
  );
};
```

### 2.2 FormBuilder Genérico

```typescript
// src/components/base/FormBuilder.tsx
interface FormField {
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'date' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: { value: string; label: string }[];
}

interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  submitLabel?: string;
  loading?: boolean;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onSubmit,
  initialData = {},
  submitLabel = 'Salvar',
  loading = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} é obrigatório`;
      }
      
      if (field.validation && formData[field.name]) {
        const error = field.validation(formData[field.name]);
        if (error) newErrors[field.name] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="form-builder">
      {fields.map(field => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name] || ''}
          error={errors[field.name]}
          onChange={(value) => {
            setFormData(prev => ({ ...prev, [field.name]: value }));
            if (errors[field.name]) {
              setErrors(prev => ({ ...prev, [field.name]: '' }));
            }
          }}
        />
      ))}
      
      <button 
        type="submit" 
        disabled={loading}
        className="form-builder__submit"
      >
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
};
```

---

## 🔄 FASE 3: HOOKS E SERVIÇOS (Semana 3-4)

### 3.1 Hook Unificado de Dados

```typescript
// src/hooks/useEntityData.ts
interface UseEntityDataOptions {
  entity: 'vouchers' | 'offers' | 'users' | 'experiences';
  filters?: Record<string, any>;
  userId?: string;
  merchantId?: string;
  realtime?: boolean;
  cache?: boolean;
}

export const useEntityData = (options: UseEntityDataOptions) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cacheKey = `${options.entity}-${JSON.stringify(options.filters)}`;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar cache primeiro
        if (options.cache) {
          const cached = cacheManager.get(cacheKey);
          if (cached) {
            setData(cached);
            setLoading(false);
            return;
          }
        }
        
        // Buscar dados
        const service = getServiceForEntity(options.entity);
        const result = await service.getAll(options.filters);
        
        setData(result);
        
        // Salvar no cache
        if (options.cache) {
          cacheManager.set(cacheKey, result);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Configurar realtime se necessário
    if (options.realtime) {
      const subscription = setupRealtimeSubscription(
        options.entity,
        options.filters,
        (newData) => {
          setData(newData);
          if (options.cache) {
            cacheManager.set(cacheKey, newData);
          }
        }
      );
      
      return () => subscription.unsubscribe();
    }
  }, [cacheKey, options]);
  
  const refresh = useCallback(() => {
    if (options.cache) {
      cacheManager.invalidate(options.entity);
    }
    // Re-fetch será disparado pelo useEffect
  }, [options.entity, options.cache]);
  
  return { data, loading, error, refresh };
};
```

### 3.2 Service Factory

```typescript
// src/services/ServiceFactory.ts
class ServiceFactory {
  private services = new Map();
  
  register(entity: string, service: any) {
    this.services.set(entity, service);
  }
  
  get(entity: string) {
    const service = this.services.get(entity);
    if (!service) {
      throw new Error(`Service for entity '${entity}' not found`);
    }
    return service;
  }
}

export const serviceFactory = new ServiceFactory();

// Registrar serviços
serviceFactory.register('vouchers', voucherService);
serviceFactory.register('offers', offerService);
serviceFactory.register('users', userService);
serviceFactory.register('experiences', experienceService);

export const getServiceForEntity = (entity: string) => {
  return serviceFactory.get(entity);
};
```

---

## 🧪 FASE 4: QUALIDADE (Semana 4-5)

### 4.1 Error Boundaries

```typescript
// src/components/base/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Enviar erro para serviço de monitoramento
    analyticsService.trackError(error, {
      component: 'ErrorBoundary',
      errorInfo
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Algo deu errado</h2>
          <p>Ocorreu um erro inesperado. Nossa equipe foi notificada.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="error-boundary__retry"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 4.2 Testes Unitários

```typescript
// src/components/base/__tests__/DashboardBase.test.tsx
import { render, screen } from '@testing-library/react';
import { DashboardBase } from '../DashboardBase';

describe('DashboardBase', () => {
  it('renders customer dashboard correctly', () => {
    render(
      <DashboardBase
        userType="customer"
        title="Test Dashboard"
        subtitle="Test Subtitle"
      >
        <div>Test Content</div>
      </DashboardBase>
    );
    
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('shows loading state', () => {
    render(
      <DashboardBase
        userType="customer"
        title="Test Dashboard"
        loading={true}
      >
        <div>Test Content</div>
      </DashboardBase>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });
  
  it('shows error state', () => {
    render(
      <DashboardBase
        userType="customer"
        title="Test Dashboard"
        error="Test error message"
      >
        <div>Test Content</div>
      </DashboardBase>
    );
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });
});
```

---

## 📊 FASE 5: OTIMIZAÇÃO (Semana 5-6)

### 5.1 Lazy Loading

```typescript
// src/pages/index.ts
import { lazy } from 'react';

// Lazy load dos dashboards
export const CustomerDashboard = lazy(() => import('./CustomerDashboard'));
export const MerchantDashboard = lazy(() => import('./MerchantDashboard'));
export const PartnerDashboard = lazy(() => import('./PartnerDashboard'));
export const AdminDashboard = lazy(() => import('./AdminDashboard'));

// Lazy load de páginas grandes
export const OfferDetails = lazy(() => import('./OfferDetails'));
export const VoucherHistory = lazy(() => import('./VoucherHistory'));
```

### 5.2 Performance Monitoring

```typescript
// src/lib/performance/PerformanceMonitor.ts
class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  
  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }
  
  endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      this.recordMetric(name, measure.duration);
    }
  }
  
  private recordMetric(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metrics = this.metrics.get(name)!;
    metrics.push(duration);
    
    // Manter apenas os últimos 100 registros
    if (metrics.length > 100) {
      metrics.shift();
    }
    
    // Enviar para analytics se duração for alta
    if (duration > 1000) { // > 1 segundo
      analyticsService.trackPerformance(name, duration);
    }
  }
  
  getAverageTime(name: string): number {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return 0;
    
    return metrics.reduce((sum, time) => sum + time, 0) / metrics.length;
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ Semana 1
- [ ] Criar DashboardBase component
- [ ] Implementar CacheManager
- [ ] Refatorar CustomerDashboard
- [ ] Refatorar MerchantDashboard
- [ ] Testes básicos

### ✅ Semana 2
- [ ] Criar CardBase component
- [ ] Implementar FormBuilder
- [ ] Refatorar todos os cards existentes
- [ ] Refatorar formulários principais
- [ ] Testes de componentes

### ✅ Semana 3
- [ ] Implementar useEntityData hook
- [ ] Criar ServiceFactory
- [ ] Refatorar hooks existentes
- [ ] Implementar cache em todos os serviços
- [ ] Testes de hooks

### ✅ Semana 4
- [ ] Implementar ErrorBoundary
- [ ] Adicionar testes unitários completos
- [ ] Implementar testes de integração
- [ ] Code review completo
- [ ] Documentação de componentes

### ✅ Semana 5
- [ ] Implementar lazy loading
- [ ] Otimizar performance
- [ ] Implementar monitoring
- [ ] Testes de performance
- [ ] Deploy em staging

### ✅ Semana 6
- [ ] Testes finais
- [ ] Documentação completa
- [ ] Deploy em produção
- [ ] Monitoramento pós-deploy
- [ ] Retrospectiva

---

## 🚨 RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|----------|
| Breaking changes | Média | Alto | Testes abrangentes + deploy incremental |
| Performance degradation | Baixa | Médio | Monitoring + rollback plan |
| User experience issues | Baixa | Alto | Testes de usabilidade + feedback |
| Timeline delays | Média | Médio | Buffer de 1 semana + priorização |

---

## 📈 MÉTRICAS DE SUCESSO

### Antes da Refatoração
- **Duplicação de código:** ~30%
- **Tempo de build:** ~45s
- **Bundle size:** ~2.1MB
- **Cobertura de testes:** ~40%
- **Tempo de carregamento:** ~3.2s

### Após Refatoração (Meta)
- **Duplicação de código:** <10%
- **Tempo de build:** <30s
- **Bundle size:** <1.8MB
- **Cobertura de testes:** >80%
- **Tempo de carregamento:** <2.5s

---

## 🎯 PRÓXIMOS PASSOS

1. **Aprovação do plano** - Revisar e aprovar estratégia
2. **Setup do ambiente** - Configurar branch de refatoração
3. **Início da Fase 1** - Implementar DashboardBase
4. **Monitoramento contínuo** - Acompanhar métricas
5. **Ajustes conforme necessário** - Adaptar plano baseado em feedback

---

**📝 Documento criado em:** Dezembro 2024  
**🔄 Última atualização:** Dezembro 2024  
**👨‍💻 Responsável:** Agente DuoPass AI  
**📊 Status:** Pronto para implementação