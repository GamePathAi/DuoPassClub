# 🗺️ DIAGRAMA DE FLUXO - ARQUITETURA DUOPASS

## 🎯 VISÃO GERAL DO SISTEMA

```mermaid
graph TB
    %% Usuários
    U1[👤 Cliente] 
    U2[🏪 Comerciante]
    U3[🎭 Parceiro Cultural]
    U4[👑 Admin]
    
    %% Pontos de Entrada
    U1 --> HOME[🏠 Home Page]
    U2 --> MERCHANT[🏪 Merchant Portal]
    U3 --> PARTNER[🎭 Partner Landing]
    U4 --> LOGIN[🔐 Login]
    
    %% Autenticação
    HOME --> AUTH{🔐 Auth}
    MERCHANT --> AUTH
    PARTNER --> AUTH
    LOGIN --> AUTH
    
    AUTH -->|Google OAuth| GOOGLE[📱 Google Login]
    AUTH -->|Email/Password| EMAIL[📧 Email Login]
    
    %% Dashboards
    GOOGLE --> DASH{📊 Dashboard Router}
    EMAIL --> DASH
    
    DASH -->|customer| CD[📱 Customer Dashboard]
    DASH -->|merchant| MD[🏪 Merchant Dashboard]
    DASH -->|partner| PD[🎭 Partner Dashboard]
    DASH -->|admin| AD[👑 Admin Dashboard]
    
    %% Funcionalidades
    CD --> VOUCHERS[🎫 Meus Vouchers]
    CD --> OFFERS[🏷️ Ofertas]
    CD --> HISTORY[📜 Histórico]
    
    MD --> MANAGE_OFFERS[📝 Gerenciar Ofertas]
    MD --> QR_SCANNER[📱 Scanner QR]
    MD --> REPORTS[📊 Relatórios]
    
    PD --> EXPERIENCES[🎨 Experiências]
    PD --> ANALYTICS[📈 Analytics]
    
    AD --> SYSTEM[⚙️ Sistema]
    AD --> USERS[👥 Usuários]
    AD --> FULL_ANALYTICS[📊 Analytics Completo]
```

---

## 🏗️ ARQUITETURA DE COMPONENTES

```mermaid
graph LR
    %% Camada de Apresentação
    subgraph "🎨 PRESENTATION LAYER"
        PAGES[📄 Pages]
        COMPONENTS[🧩 Components]
        LAYOUT[📐 Layout]
    end
    
    %% Camada de Lógica
    subgraph "🧠 BUSINESS LOGIC"
        HOOKS[🪝 Custom Hooks]
        CONTEXTS[🌐 Contexts]
        SERVICES[⚙️ Services]
    end
    
    %% Camada de Dados
    subgraph "💾 DATA LAYER"
        SUPABASE[(🗄️ Supabase)]
        CACHE[💨 Cache]
        TYPES[📝 TypeScript Types]
    end
    
    %% Fluxo de Dados
    PAGES --> HOOKS
    COMPONENTS --> HOOKS
    LAYOUT --> CONTEXTS
    
    HOOKS --> SERVICES
    CONTEXTS --> SERVICES
    
    SERVICES --> SUPABASE
    SERVICES --> CACHE
    
    TYPES --> HOOKS
    TYPES --> SERVICES
```

---

## 🔄 FLUXO DE AUTENTICAÇÃO

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant A as 🔐 AuthContext
    participant G as 📱 Google OAuth
    participant S as 🗄️ Supabase
    participant D as 📊 Dashboard
    
    U->>A: Clica "Login com Google"
    A->>G: Inicia OAuth Flow
    G->>U: Redireciona para Google
    U->>G: Autoriza aplicação
    G->>A: Retorna com token
    A->>S: Valida token
    S->>A: Retorna dados do usuário
    A->>S: Busca/Cria perfil em users
    S->>A: Retorna perfil completo
    A->>D: Redireciona para dashboard
    D->>U: Exibe interface personalizada
```

---

## 📊 FLUXO DE DADOS - DASHBOARDS

```mermaid
graph TD
    %% Entrada
    USER[👤 Usuário Logado] --> ROUTER{🛣️ Router}
    
    %% Roteamento
    ROUTER -->|customer| CD[📱 CustomerDashboard]
    ROUTER -->|merchant| MD[🏪 MerchantDashboard]
    ROUTER -->|partner| PD[🎭 PartnerDashboard]
    ROUTER -->|admin| AD[👑 AdminDashboard]
    
    %% Hooks de Dados
    CD --> HOOKS1[🪝 useVouchers<br/>useOffers<br/>useAnalytics]
    MD --> HOOKS2[🪝 useOffers<br/>useVouchers<br/>useReports]
    PD --> HOOKS3[🪝 useExperiences<br/>useAnalytics]
    AD --> HOOKS4[🪝 useUsers<br/>useSystem<br/>useFullAnalytics]
    
    %% Serviços
    HOOKS1 --> SERVICES1[⚙️ membershipService<br/>analyticsService]
    HOOKS2 --> SERVICES2[⚙️ notificationService<br/>analyticsService]
    HOOKS3 --> SERVICES3[⚙️ partnerService<br/>analyticsService]
    HOOKS4 --> SERVICES4[⚙️ crmService<br/>analyticsService<br/>automationService]
    
    %% Banco de Dados
    SERVICES1 --> DB[(🗄️ Supabase<br/>vouchers, offers)]
    SERVICES2 --> DB
    SERVICES3 --> DB
    SERVICES4 --> DB
    
    %% Cache
    DB --> CACHE[💨 Cache Layer]
    CACHE --> HOOKS1
    CACHE --> HOOKS2
    CACHE --> HOOKS3
    CACHE --> HOOKS4
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string full_name
        enum user_type
        enum subscription_status
        string city
        string canton
        timestamp created_at
        timestamp updated_at
    }
    
    OFFERS {
        uuid id PK
        uuid merchant_id FK
        string title
        text description
        decimal original_value
        string category
        string city
        timestamp expires_at
        boolean is_active
        string image_url
        timestamp created_at
    }
    
    VOUCHERS {
        uuid id PK
        uuid user_id FK
        uuid merchant_id FK
        string voucher_code
        string qr_code_data
        enum status
        timestamp expires_at
        timestamp used_at
        string used_location
        timestamp created_at
    }
    
    ACTIVATED_COUPONS {
        uuid id PK
        uuid user_id FK
        uuid offer_id FK
        enum status
        timestamp activated_at
        timestamp used_at
    }
    
    CATEGORIES {
        uuid id PK
        string name
        string icon
        string slug
    }
    
    VOUCHER_USAGE {
        uuid id PK
        uuid voucher_id FK
        uuid merchant_id FK
        uuid user_id FK
        timestamp used_at
        string location
        string validated_by
    }
    
    %% Relacionamentos
    USERS ||--o{ OFFERS : "merchant_id"
    USERS ||--o{ VOUCHERS : "user_id"
    USERS ||--o{ VOUCHERS : "merchant_id"
    USERS ||--o{ ACTIVATED_COUPONS : "user_id"
    OFFERS ||--o{ ACTIVATED_COUPONS : "offer_id"
    VOUCHERS ||--o{ VOUCHER_USAGE : "voucher_id"
    USERS ||--o{ VOUCHER_USAGE : "merchant_id"
    USERS ||--o{ VOUCHER_USAGE : "user_id"
```

---

## 🔄 FLUXO DE VOUCHER (CICLO COMPLETO)

```mermaid
stateDiagram-v2
    [*] --> OfferCreated : Comerciante cria oferta
    
    OfferCreated --> OfferPublished : Oferta ativada
    OfferPublished --> OfferViewed : Cliente visualiza
    
    OfferViewed --> CouponActivated : Cliente ativa cupom
    CouponActivated --> VoucherGenerated : Sistema gera voucher
    
    VoucherGenerated --> VoucherActive : Voucher ativo
    VoucherActive --> VoucherUsed : Cliente usa voucher
    VoucherActive --> VoucherExpired : Voucher expira
    
    VoucherUsed --> UsageRecorded : Uso registrado
    UsageRecorded --> [*]
    
    VoucherExpired --> [*]
    
    note right of CouponActivated
        Tabela: activated_coupons
        Status: active
    end note
    
    note right of VoucherGenerated
        Tabela: vouchers
        QR Code gerado
    end note
    
    note right of UsageRecorded
        Tabela: voucher_usage
        Histórico completo
    end note
```

---

## 🧩 MAPA DE COMPONENTES DUPLICADOS

```mermaid
graph TB
    %% Componentes Base
    subgraph "🎯 COMPONENTES ALVO PARA UNIFICAÇÃO"
        BASE_DASHBOARD[📊 BaseDashboard]
        BASE_CARD[🃏 BaseCard]
        BASE_FORM[📝 BaseForm]
        BASE_TABLE[📋 BaseTable]
    end
    
    %% Dashboards Atuais
    subgraph "📊 DASHBOARDS ATUAIS (DUPLICADOS)"
        CD2[📱 CustomerDashboard]
        MD2[🏪 MerchantDashboard]
        PD2[🎭 PartnerDashboard]
        AD2[👑 AdminDashboard]
        COMM[📢 CommunicationDashboard]
    end
    
    %% Cards Atuais
    subgraph "🃏 CARDS ATUAIS (SIMILARES)"
        OFFER_CARD[🏷️ OfferCard]
        VOUCHER_CARD[🎫 VoucherCard]
        EXPERIENCE_CARD[🎨 ExperienceCard]
        USER_CARD[👤 UserCard]
    end
    
    %% Formulários Atuais
    subgraph "📝 FORMS ATUAIS (REPETITIVOS)"
        OFFER_FORM[📝 OfferForm]
        VOUCHER_FORM[📝 VoucherForm]
        USER_FORM[📝 UserForm]
        CONTACT_FORM[📝 ContactForm]
    end
    
    %% Unificação
    BASE_DASHBOARD -.->|substitui| CD2
    BASE_DASHBOARD -.->|substitui| MD2
    BASE_DASHBOARD -.->|substitui| PD2
    BASE_DASHBOARD -.->|substitui| AD2
    BASE_DASHBOARD -.->|substitui| COMM
    
    BASE_CARD -.->|substitui| OFFER_CARD
    BASE_CARD -.->|substitui| VOUCHER_CARD
    BASE_CARD -.->|substitui| EXPERIENCE_CARD
    BASE_CARD -.->|substitui| USER_CARD
    
    BASE_FORM -.->|substitui| OFFER_FORM
    BASE_FORM -.->|substitui| VOUCHER_FORM
    BASE_FORM -.->|substitui| USER_FORM
    BASE_FORM -.->|substitui| CONTACT_FORM
```

---

## 🚀 ROADMAP DE REFATORAÇÃO

```mermaid
gantt
    title 📅 Cronograma de Refatoração DuoPass
    dateFormat  YYYY-MM-DD
    section 🏗️ Fundação
    Criar DashboardBase           :active, foundation1, 2024-12-15, 7d
    Sistema de Cache              :foundation2, after foundation1, 5d
    Centralizar Consultas         :foundation3, after foundation2, 5d
    
    section 🧩 Componentes
    Unificar Cards                :components1, after foundation3, 7d
    FormBuilder Genérico          :components2, after components1, 5d
    Error Boundaries              :components3, after components2, 3d
    
    section 🧪 Qualidade
    Testes Unitários              :quality1, after components3, 7d
    Testes Integração             :quality2, after quality1, 5d
    Otimização Performance        :quality3, after quality2, 5d
    
    section 📚 Documentação
    Guia de Componentes           :docs1, after quality3, 5d
    Documentar APIs               :docs2, after docs1, 3d
    Guia de Deployment            :docs3, after docs2, 3d
```

---

## 📊 MÉTRICAS DE IMPACTO

```mermaid
xychart-beta
    title "📈 Impacto Esperado da Refatoração"
    x-axis ["Antes", "Depois"]
    y-axis "Percentual" 0 --> 100
    bar [30, 10] %% Duplicação de Código
    bar [0, 80]  %% Cobertura de Testes
    bar [60, 90] %% Manutenibilidade
    bar [70, 95] %% Performance
```

---

## 🎯 CONCLUSÃO VISUAL

### ✅ Estado Atual
```
🏗️ ARQUITETURA: Sólida mas com duplicações
📊 DASHBOARDS: 5 componentes similares
🔄 FLUXOS: Bem definidos
🗄️ BANCO: Estrutura robusta
📝 DOCS: Abrangente
```

### 🚀 Estado Futuro (Pós-Refatoração)
```
🏗️ ARQUITETURA: Otimizada e DRY
📊 DASHBOARDS: 1 componente base + configs
🔄 FLUXOS: Mantidos e otimizados
🗄️ BANCO: Inalterado
📝 DOCS: Expandida com guias técnicos
```

---

**📝 Diagramas gerados em:** Dezembro 2024  
**🔄 Próxima atualização:** Após refatoração  
**👨‍💻 Responsável:** Agente DuoPass AI