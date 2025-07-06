-- POLÍTICA SIMPLES E FUNCIONAL PARA O DUOPASS
-- Execute este SQL no Supabase > SQL Editor

-- 1. DESABILITAR RLS TEMPORARIAMENTE PARA TESTE
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers DISABLE ROW LEVEL SECURITY; 
ALTER TABLE public.activated_coupons DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "users_insert_policy_v2" ON public.users;
DROP POLICY IF EXISTS "users_select_policy_v2" ON public.users;
DROP POLICY IF EXISTS "users_update_policy_v2" ON public.users;
DROP POLICY IF EXISTS "offers_select_policy_v2" ON public.offers;
DROP POLICY IF EXISTS "offers_merchant_policy_v2" ON public.offers;
DROP POLICY IF EXISTS "coupons_select_policy_v2" ON public.activated_coupons;
DROP POLICY IF EXISTS "coupons_insert_policy_v2" ON public.activated_coupons;
DROP POLICY IF EXISTS "coupons_update_policy_v2" ON public.activated_coupons;

-- 3. REABILITAR RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activated_coupons ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS SUPER SIMPLES E FUNCIONAIS

-- USUÁRIOS: Permitir tudo para começar
CREATE POLICY "duopass_users_all" ON public.users
FOR ALL TO anon, authenticated
USING (true) WITH CHECK (true);

-- OFERTAS: Todos podem ver ofertas ativas
CREATE POLICY "duopass_offers_read" ON public.offers
FOR SELECT TO anon, authenticated
USING (is_active = true);

-- OFERTAS: Merchants podem gerenciar suas ofertas
CREATE POLICY "duopass_offers_merchant" ON public.offers
FOR ALL TO authenticated
USING (auth.uid() = merchant_id)
WITH CHECK (auth.uid() = merchant_id);

-- CUPONS: Usuários podem gerenciar seus próprios cupons
CREATE POLICY "duopass_coupons_user" ON public.activated_coupons
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- CATEGORIAS: Todos podem ler
CREATE POLICY "duopass_categories_read" ON public.categories
FOR SELECT TO anon, authenticated
USING (true);

-- 5. VERIFICAR SE FUNCIONOU
SELECT 'Políticas criadas com sucesso!' as status;