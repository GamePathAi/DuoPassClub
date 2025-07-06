# 🔧 CONFIGURAÇÃO COMPLETA SUPABASE - RESOLVER ERRO "relation public.categories does not exist"

## ⚠️ PROBLEMA IDENTIFICADO
O erro `relation public.categories does not exist` indica que as tabelas não foram criadas no banco de dados Supabase.

## 📋 SOLUÇÃO COMPLETA - SIGA TODOS OS PASSOS

### PASSO 1 - CRIAR TABELAS NO SUPABASE

1. **Acesse o painel Supabase:**
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Faça login na sua conta
   - Selecione seu projeto

2. **Abra o SQL Editor:**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New query"**

3. **Execute este SQL completo de uma vez:**

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('client', 'merchant');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'inactive', 'trial');
CREATE TYPE voucher_status_enum AS ENUM ('active', 'used', 'expired');
CREATE TYPE coupon_status_enum AS ENUM ('active', 'used', 'expired');

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'merchant')),
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    email_verified BOOLEAN DEFAULT false,
    email_verification_sent_at TIMESTAMPTZ,
    city VARCHAR(100),
    canton VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO public.categories (name, slug, icon) VALUES
('Gastronomia', 'gastronomy', 'utensils'),
('Beleza', 'beauty', 'sparkles'),
('Lazer', 'leisure', 'gamepad-2'),
('Fitness', 'fitness', 'dumbbell'),
('Compras', 'shopping', 'shopping-bag'),
('Serviços', 'services', 'wrench')
ON CONFLICT (slug) DO NOTHING;

-- Tabela de ofertas
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_id UUID REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    canton VARCHAR(10),
    price_original DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de cupons ativados
CREATE TABLE IF NOT EXISTS public.activated_coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    offer_id UUID REFERENCES public.offers(id),
    status VARCHAR(20) DEFAULT 'active',
    activated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### PASSO 2 - CONFIGURAR RLS (Row Level Security)

**Execute este SQL separadamente:**

```sql
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activated_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Anyone can read active offers" ON public.offers FOR SELECT TO authenticated, anon USING (is_active = true);
```

### PASSO 3 - CONFIGURAR AUTHENTICATION

1. **Vá para Authentication > Settings**
2. **Configure as URLs:**
   - **Site URL:** `http://localhost:5173`
   - **Redirect URLs:** `http://localhost:5173/confirm-email`
3. **Habilite confirmação por email:**
   - **Enable email confirmations:** ON

### PASSO 4 - VERIFICAR .ENV

**Confirme que o arquivo `.env` contém:**
```env
VITE_SUPABASE_URL=https://[seu-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[sua-anon-key]
```

**✅ Suas configurações atuais estão corretas:**
- URL: `https://rnzvbrlbcnknyhrgubqi.supabase.co`
- Chave configurada corretamente

### PASSO 5 - VERIFICAR TABELAS CRIADAS

1. **No painel Supabase, vá para "Table Editor"**
2. **Verifique se estas tabelas existem:**
   - ✅ `users`
   - ✅ `categories` (deve ter 6 categorias)
   - ✅ `offers`
   - ✅ `activated_coupons`

### PASSO 6 - TESTAR CONEXÃO

**O App.tsx já foi configurado com um teste automático.**

1. **Abra o console do navegador (F12)**
2. **Procure por estas mensagens:**
   - 🔍 "Testando conexão com Supabase..."
   - ✅ "Conexão com Supabase OK! Categorias encontradas:"
   - ❌ Se aparecer erro, execute novamente os passos 1 e 2

## 🚀 APÓS EXECUTAR TODOS OS PASSOS

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Teste as funcionalidades:**
   - Cadastro de usuário
   - Login
   - Navegação entre páginas
   - Carregamento de ofertas

## ❗ TROUBLESHOOTING

**Se ainda houver erros:**

1. **Verifique se todas as tabelas foram criadas**
2. **Confirme se as políticas RLS foram aplicadas**
3. **Teste a conexão no console do navegador**
4. **Verifique se não há erros de sintaxe no SQL**

**Mensagens de sucesso esperadas:**
- ✅ Tabelas criadas com sucesso
- ✅ Políticas RLS aplicadas
- ✅ Categorias inseridas (6 itens)
- ✅ Conexão testada no console

## 📞 SUPORTE

Se o problema persistir após seguir todos os passos:
1. Verifique os logs do console do navegador
2. Confirme se o projeto Supabase está ativo
3. Teste a conexão diretamente no SQL Editor do Supabase