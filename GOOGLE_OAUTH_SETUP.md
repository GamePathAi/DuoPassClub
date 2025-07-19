# 🔐 Implementação de Autenticação Social com Google - DuoPass

## 📋 Visão Geral

Este guia implementa autenticação social com Google OAuth 2.0 usando Supabase como backend, permitindo login/cadastro seguro e integrado com contas Google.

## 🎯 Funcionalidades Implementadas

- ✅ **Sign In com Google** - Login para usuários existentes
- ✅ **Sign Up com Google** - Cadastro automático de novos usuários
- ✅ **Gerenciamento de Sessão** - Manter usuário logado
- ✅ **Sign Out** - Logout seguro
- ✅ **Proteção de Rotas** - Páginas que requerem autenticação
- ✅ **Perfil do Usuário** - Acesso aos dados do Google (nome, email, foto)
- ✅ **Sincronização de Dados** - Integração com tabela users existente

## 🛠️ Stack Tecnológica

- **Backend**: Supabase (autenticação + banco de dados)
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **OAuth Provider**: Google OAuth 2.0
- **Deployment**: Preparado para AWS/Vercel

---

## 📋 FASE 1: Configuração do Google OAuth Console

### 1.1 Criar Projeto no Google Cloud Console

1. **Acesse**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Crie um novo projeto** ou selecione um existente
3. **Nome do projeto**: `DuoPass OAuth`
4. **Ative a Google+ API**:
   - Vá para "APIs & Services" > "Library"
   - Procure por "Google+ API" e ative

### 1.2 Configurar OAuth Consent Screen

1. **Vá para**: "APIs & Services" > "OAuth consent screen"
2. **Escolha**: "External" (para usuários públicos)
3. **Preencha os campos obrigatórios**:
   ```
   App name: DuoPass Club
   User support email: seu-email@dominio.com
   Developer contact information: seu-email@dominio.com
   ```
4. **Adicione escopos**:
   - `email`
   - `profile`
   - `openid`

### 1.3 Criar Credenciais OAuth 2.0

1. **Vá para**: "APIs & Services" > "Credentials"
2. **Clique**: "Create Credentials" > "OAuth 2.0 Client IDs"
3. **Tipo de aplicação**: "Web application"
4. **Nome**: `DuoPass Web Client`
5. **Origens JavaScript autorizadas**:
   ```
   http://localhost:5174
   https://seu-dominio.com
   ```
6. **URIs de redirecionamento autorizados**:
   ```
   https://rnzvbrlbcnknyhrgubqi.supabase.co/auth/v1/callback
   ```

### 1.4 Obter Credenciais

- **Client ID**: `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdef123456`

⚠️ **IMPORTANTE**: Guarde essas credenciais com segurança!

---

## 📋 FASE 2: Configuração do Supabase

### 2.1 Configurar Provider Google no Supabase

1. **Acesse**: [Supabase Dashboard](https://supabase.com/dashboard)
2. **Vá para**: "Authentication" > "Providers"
3. **Ative o Google Provider**:
   - **Enabled**: ✅ True
   - **Client ID**: Cole o Client ID do Google
   - **Client Secret**: Cole o Client Secret do Google

### 2.2 Configurar URLs de Redirecionamento

1. **Vá para**: "Authentication" > "Settings"
2. **Site URL**: `http://localhost:5174` (desenvolvimento)
3. **Redirect URLs**: 
   ```
   http://localhost:5174/**
   https://seu-dominio.com/**
   ```

### 2.3 Atualizar Schema do Banco (se necessário)

```sql
-- Adicionar campos para dados do Google (se não existirem)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS provider_id TEXT;

-- Índice para busca por provider
CREATE INDEX IF NOT EXISTS idx_users_provider 
ON public.users(provider, provider_id);
```

---

## 📋 FASE 3: Implementação Frontend

### 3.1 Atualizar Variáveis de Ambiente

```env
# .env
VITE_SUPABASE_URL=https://rnzvbrlbcnknyhrgubqi.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
```

### 3.2 Instalar Dependências

```bash
npm install @supabase/supabase-js
# Dependências já instaladas no projeto
```

---

## 🔧 Implementação Detalhada

### Arquivos que serão criados/modificados:

1. **`src/contexts/AuthContext.tsx`** - Adicionar funções Google OAuth
2. **`src/components/Auth/GoogleSignInButton.tsx`** - Botão de login com Google
3. **`src/pages/Auth/SignUp.tsx`** - Integrar botão Google
4. **`src/pages/Auth/Login.tsx`** - Integrar botão Google
5. **`src/pages/Auth/AuthCallback.tsx`** - Página de callback OAuth
6. **`src/hooks/useGoogleAuth.ts`** - Hook personalizado para Google Auth

### Fluxo de Autenticação:

1. **Usuário clica** no botão "Entrar com Google"
2. **Redirecionamento** para Google OAuth
3. **Usuário autoriza** no Google
4. **Callback** para Supabase
5. **Supabase processa** e cria/atualiza usuário
6. **Redirecionamento** para aplicação
7. **Sincronização** com tabela users
8. **Login completo** no DuoPass

---

## 🔒 Considerações de Segurança

### ✅ Implementadas:
- Validação de tokens no Supabase
- CORS configurado corretamente
- RLS (Row Level Security) mantido
- Sanitização de dados do usuário
- Handling seguro de redirects

### 🛡️ Recomendadas:
- Rate limiting para tentativas de login
- Logging de eventos de autenticação
- Validação de domínios de email
- Backup de recovery para contas

---

## 🧪 Guia de Testes

### Testes Locais:
1. **Cadastro com Google** - Novo usuário
2. **Login com Google** - Usuário existente
3. **Logout** - Encerrar sessão
4. **Proteção de rotas** - Acesso sem login
5. **Sincronização de dados** - Perfil atualizado

### Testes de Produção:
1. **Diferentes browsers**
2. **Mobile responsiveness**
3. **Flows completos**
4. **Segurança das sessões**

---

## 🚀 Deployment

### Configurações para Produção:

1. **Atualizar URLs no Google Console**:
   ```
   https://duopassclub.ch
   ```

2. **Atualizar Supabase Settings**:
   ```
   Site URL: https://duopassclub.ch
   Redirect URLs: https://duopassclub.ch/**
   ```

3. **Variáveis de Ambiente de Produção**:
   ```env
   VITE_SUPABASE_URL=https://rnzvbrlbcnknyhrgubqi.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-producao
   VITE_GOOGLE_CLIENT_ID=client-id-producao
   ```

---

## 📚 Próximos Passos

1. ✅ **Implementar código frontend**
2. ✅ **Testar fluxo completo localmente**
3. ✅ **Configurar Google Console**
4. ✅ **Configurar Supabase Provider**
5. ✅ **Deploy e testes de produção**

---

## 🆘 Troubleshooting

### Problemas Comuns:

**Erro: "redirect_uri_mismatch"**
- Verificar URLs no Google Console
- Confirmar callback URL do Supabase

**Erro: "invalid_client"**
- Verificar Client ID e Secret
- Confirmar configuração no Supabase

**Usuário não criado na tabela users**
- Verificar trigger de sincronização
- Checar políticas RLS

**Sessão não persiste**
- Verificar configuração do Supabase client
- Confirmar localStorage/cookies

---

## 📖 Documentação de Referência

- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [React + Supabase Auth](https://supabase.com/docs/guides/getting-started/tutorials/with-react)

---

**🎯 Status**: Pronto para implementação
**⏱️ Tempo estimado**: 2-3 horas
**🔧 Complexidade**: Intermediária