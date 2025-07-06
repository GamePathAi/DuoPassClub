# 🏗️ Plano de Arquitetura - DuoPass

## 📋 Análise dos Problemas Atuais

### 🔴 Problemas Identificados:
1. **Navegação Limitada**: O "bonequinho" (ícone User) não tem dropdown/menu
2. **Rotas Desprotegidas**: Não há proteção de rotas baseada em autenticação
3. **Páginas Faltando**: History mencionada no Header mas não existe
4. **Menu Mobile**: Botão existe mas não funciona
5. **Redirecionamento Inconsistente**: Dashboards não redirecionam corretamente por tipo de usuário
6. **Navegação Confusa**: Merchant vê "dashboard" mas deveria ver "merchant/dashboard"

## 🎯 Arquitetura Proposta

### 1. **Sistema de Rotas Protegidas**
```
📁 components/
├── ProtectedRoute.tsx     # Componente para proteger rotas
├── RoleBasedRoute.tsx     # Rota baseada em tipo de usuário
└── RedirectHandler.tsx    # Gerencia redirecionamentos
```

### 2. **Navegação Aprimorada**
```
📁 components/Layout/
├── Header.tsx             # Header com dropdown funcional
├── MobileMenu.tsx         # Menu mobile responsivo
├── UserDropdown.tsx       # Dropdown do perfil do usuário
└── NavigationMenu.tsx     # Menu de navegação principal
```

### 3. **Páginas Completas**
```
📁 pages/
├── History/
│   ├── CustomerHistory.tsx    # Histórico do cliente
│   └── MerchantHistory.tsx    # Histórico do comerciante
├── Profile/
│   ├── UserProfile.tsx        # Perfil do usuário
│   └── EditProfile.tsx        # Editar perfil
├── Settings/
│   └── UserSettings.tsx       # Configurações
└── NotFound.tsx               # Página 404
```

### 4. **Hooks Customizados**
```
📁 hooks/
├── useProtectedRoute.ts   # Hook para proteção de rotas
├── useUserRole.ts         # Hook para gerenciar roles
├── useNavigation.ts       # Hook para navegação
└── useMobileMenu.ts       # Hook para menu mobile
```

### 5. **Utilitários de Rota**
```
📁 utils/
├── routeConfig.ts         # Configuração de rotas
├── rolePermissions.ts     # Permissões por role
└── navigationHelpers.ts   # Helpers de navegação
```

## 🚀 Implementação Sugerida

### **Fase 1: Fundação (Prioridade Alta)**
1. ✅ Criar sistema de rotas protegidas
2. ✅ Implementar redirecionamento baseado em role
3. ✅ Corrigir navegação do Header
4. ✅ Adicionar dropdown do usuário

### **Fase 2: Páginas Essenciais (Prioridade Alta)**
1. ✅ Criar página de History
2. ✅ Implementar página de Profile
3. ✅ Adicionar página de Settings
4. ✅ Criar página 404

### **Fase 3: UX/UI (Prioridade Média)**
1. ✅ Implementar menu mobile funcional
2. ✅ Melhorar responsividade
3. ✅ Adicionar loading states
4. ✅ Implementar breadcrumbs

### **Fase 4: Funcionalidades Avançadas (Prioridade Baixa)**
1. ✅ Sistema de notificações
2. ✅ Busca global
3. ✅ Filtros avançados
4. ✅ Analytics do usuário

## 🔧 Estrutura de Rotas Proposta

```typescript
// Rotas Públicas
/                          # Home
/offers                    # Ofertas públicas
/login                     # Login
/signup                    # Cadastro
/confirm-email             # Confirmação de email

// Rotas Protegidas - Cliente
/dashboard                 # Dashboard do cliente
/vouchers                  # Meus vouchers
/history                   # Histórico de compras
/profile                   # Perfil do usuário
/settings                  # Configurações

// Rotas Protegidas - Comerciante
/merchant/dashboard        # Dashboard do comerciante
/merchant/offers           # Gerenciar ofertas
/merchant/vouchers         # Vouchers emitidos
/merchant/analytics        # Analytics
/merchant/profile          # Perfil do comerciante
/merchant/settings         # Configurações

// Rotas de Sistema
/404                       # Página não encontrada
/unauthorized              # Acesso negado
```

## 🎨 Melhorias de UX/UI

### **Header Inteligente**
- Dropdown do usuário com avatar
- Menu contextual baseado no role
- Indicadores de notificação
- Busca global (futura)

### **Navegação Responsiva**
- Menu mobile com slide-out
- Navegação por gestos
- Breadcrumbs contextuais
- Atalhos de teclado

### **Estados de Loading**
- Skeleton screens
- Loading spinners contextuais
- Feedback visual de ações
- Error boundaries

## 🔒 Segurança e Permissões

### **Sistema de Roles**
```typescript
type UserRole = 'customer' | 'merchant' | 'admin';

interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete')[];
}
```

### **Proteção de Rotas**
- Verificação de autenticação
- Validação de permissões
- Redirecionamento automático
- Fallback para páginas de erro

## 📱 Responsividade

### **Breakpoints**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### **Componentes Adaptativos**
- Header responsivo
- Menu mobile/desktop
- Cards adaptativos
- Formulários responsivos

## 🚀 Próximos Passos

1. **Implementar rotas protegidas** (30 min)
2. **Criar dropdown do usuário** (20 min)
3. **Adicionar página History** (25 min)
4. **Implementar menu mobile** (35 min)
5. **Melhorar redirecionamentos** (15 min)

**Tempo total estimado: ~2 horas**

---

*Este plano visa transformar o DuoPass em uma aplicação robusta, escalável e com excelente experiência do usuário.*