-- CORREÇÃO FORÇADA PARA ERRO DE POLÍTICA RLS EXISTENTE
-- Execute este SQL no Supabase > SQL Editor

-- FORÇAR REMOÇÃO DE TODAS AS POLÍTICAS (mesmo se não existirem)
DO $$
BEGIN
    -- Remover políticas de users
    DROP POLICY IF EXISTS "allow_user_registration" ON public.users;
    DROP POLICY IF EXISTS "allow_user_read_own" ON public.users;
    DROP POLICY IF EXISTS "allow_user_update_own" ON public.users;
    DROP POLICY IF EXISTS "Users can read own data" ON public.users;
    DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
    DROP POLICY IF EXISTS "Users can update own data" ON public.users;
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
    DROP POLICY IF EXISTS "Anyone can view merchant profiles" ON public.users;
    DROP POLICY IF EXISTS "Enable insert for authentication users only" ON public.users;
    DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
    
    -- Remover políticas de offers
    DROP POLICY IF EXISTS "allow_offers_read_all" ON public.offers;
    DROP POLICY IF EXISTS "allow_merchant_manage_offers" ON public.offers;
    DROP POLICY IF EXISTS "Anyone can read active offers" ON public.offers;
    DROP POLICY IF EXISTS "Anyone can view active offers" ON public.offers;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.offers;
    
    -- Remover políticas de activated_coupons
    DROP POLICY IF EXISTS "allow_user_read_own_coupons" ON public.activated_coupons;
    DROP POLICY IF EXISTS "allow_user_insert_own_coupons" ON public.activated_coupons;
    DROP POLICY IF EXISTS "allow_user_update_own_coupons" ON public.activated_coupons;
    DROP POLICY IF EXISTS "Users can view their own activated coupons" ON public.activated_coupons;
    DROP POLICY IF EXISTS "Users can create their own activated coupons" ON public.activated_coupons;
    DROP POLICY IF EXISTS "Users can update their own activated coupons" ON public.activated_coupons;
    DROP POLICY IF EXISTS "Users can read own coupons" ON public.activated_coupons;
    DROP POLICY IF EXISTS "Users can insert own coupons" ON public.activated_coupons;
END $$;

-- AGUARDAR UM MOMENTO PARA GARANTIR QUE AS POLÍTICAS FORAM REMOVIDAS
SELECT pg_sleep(1);

-- CRIAR POLÍTICAS NOVAS COM NOMES ÚNICOS

-- Política para inserção de usuários (permite cadastro)
CREATE POLICY "users_insert_policy_v2" ON public.users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para leitura de usuários (próprio perfil)
CREATE POLICY "users_select_policy_v2" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para atualização de usuários (próprio perfil)
CREATE POLICY "users_update_policy_v2" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para leitura de ofertas (todas as ativas)
CREATE POLICY "offers_select_policy_v2" ON public.offers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Política para gerenciamento de ofertas pelos merchants
CREATE POLICY "offers_merchant_policy_v2" ON public.offers
  FOR ALL
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- Políticas para cupons ativados
CREATE POLICY "coupons_select_policy_v2" ON public.activated_coupons
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "coupons_insert_policy_v2" ON public.activated_coupons
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "coupons_update_policy_v2" ON public.activated_coupons
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verificar políticas criadas
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'offers', 'activated_coupons')
ORDER BY tablename, policyname;

-- Verificar se as tabelas têm RLS habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'offers', 'activated_coupons');