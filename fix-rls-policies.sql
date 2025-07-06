-- CORREÇÃO ESPECÍFICA PARA ERRO DE POLÍTICA RLS
-- Execute este SQL no Supabase > SQL Editor

-- Remover TODAS as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view merchant profiles" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authentication users only" ON public.users;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Remover políticas de ofertas
DROP POLICY IF EXISTS "Anyone can read active offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can view active offers" ON public.offers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.offers;

-- Remover políticas de cupons
DROP POLICY IF EXISTS "Users can view their own activated coupons" ON public.activated_coupons;
DROP POLICY IF EXISTS "Users can create their own activated coupons" ON public.activated_coupons;
DROP POLICY IF EXISTS "Users can update their own activated coupons" ON public.activated_coupons;
DROP POLICY IF EXISTS "Users can read own coupons" ON public.activated_coupons;
DROP POLICY IF EXISTS "Users can insert own coupons" ON public.activated_coupons;

-- CRIAR POLÍTICAS CORRETAS E ESPECÍFICAS

-- Política para inserção de usuários (permite cadastro)
CREATE POLICY "allow_user_registration" ON public.users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para leitura de usuários (próprio perfil)
CREATE POLICY "allow_user_read_own" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para atualização de usuários (próprio perfil)
CREATE POLICY "allow_user_update_own" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para leitura de ofertas (todas as ativas)
CREATE POLICY "allow_offers_read_all" ON public.offers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Política para gerenciamento de ofertas pelos merchants
CREATE POLICY "allow_merchant_manage_offers" ON public.offers
  FOR ALL
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- Políticas para cupons ativados
CREATE POLICY "allow_user_read_own_coupons" ON public.activated_coupons
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "allow_user_insert_own_coupons" ON public.activated_coupons
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow_user_update_own_coupons" ON public.activated_coupons
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'offers', 'activated_coupons')
ORDER BY tablename, policyname;