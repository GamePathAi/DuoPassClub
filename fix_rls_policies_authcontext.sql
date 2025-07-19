-- 🔧 Correção de Políticas RLS para AuthContext - DuoPass
-- Execute este SQL no Supabase SQL Editor

-- 1. VERIFICAR POLÍTICAS RLS ATUAIS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- 2. VERIFICAR SE RLS ESTÁ HABILITADO
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- 3. REMOVER POLÍTICAS RESTRITIVAS (se existirem)
DROP POLICY IF EXISTS "Users can only view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can only update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- 4. CRIAR POLÍTICAS PERMISSIVAS PARA AUTHCONTEXT

-- Política para SELECT (visualização)
CREATE POLICY "Allow users to view own profile" ON public.users
    FOR SELECT 
    USING (auth.uid() = id OR auth.uid() IS NULL); -- Permitir também quando não autenticado (para login)

-- Política para UPDATE (atualização)
CREATE POLICY "Allow users to update own profile" ON public.users
    FOR UPDATE 
    USING (auth.uid() = id OR auth.uid() IS NULL) -- Permitir update mesmo sem auth (para sincronização Google)
    WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Política para INSERT (criação)
CREATE POLICY "Allow user creation" ON public.users
    FOR INSERT 
    WITH CHECK (true); -- Permitir criação de novos usuários

-- 5. POLÍTICA ESPECIAL PARA SISTEMA (mais permissiva)
CREATE POLICY "System can manage all users" ON public.users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. TESTAR UPDATE MANUAL DO USUÁRIO IGOR
UPDATE public.users 
SET 
    subscription_status = 'active',
    email_verified = true,
    updated_at = NOW()
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';

-- 7. VERIFICAR SE UPDATE FUNCIONOU
SELECT 
    id,
    email,
    subscription_status,
    email_verified,
    updated_at
FROM public.users 
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';

-- 8. VERIFICAR POLÍTICAS FINAIS
SELECT 
    'POLÍTICAS RLS ATUAIS' as status,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 9. ALTERNATIVA: DESABILITAR RLS TEMPORARIAMENTE (se necessário)
-- CUIDADO: Só use em desenvolvimento!
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 10. REABILITAR RLS (após teste)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 11. VERIFICAR PERMISSÕES DO USUÁRIO ANÔNIMO
SELECT 
    'PERMISSÕES ANÔNIMAS' as status,
    has_table_privilege('anon', 'public.users', 'SELECT') as can_select,
    has_table_privilege('anon', 'public.users', 'UPDATE') as can_update,
    has_table_privilege('anon', 'public.users', 'INSERT') as can_insert;

-- 12. VERIFICAR PERMISSÕES DO USUÁRIO AUTENTICADO
SELECT 
    'PERMISSÕES AUTENTICADAS' as status,
    has_table_privilege('authenticated', 'public.users', 'SELECT') as can_select,
    has_table_privilege('authenticated', 'public.users', 'UPDATE') as can_update,
    has_table_privilege('authenticated', 'public.users', 'INSERT') as can_insert;

-- 13. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON POLICY "Allow users to view own profile" ON public.users IS 'Permite usuários visualizarem próprio perfil + acesso não autenticado para login';
COMMENT ON POLICY "Allow users to update own profile" ON public.users IS 'Permite usuários atualizarem próprio perfil + sincronização Google';
COMMENT ON POLICY "Allow user creation" ON public.users IS 'Permite criação de novos usuários (registro e Google OAuth)';
COMMENT ON POLICY "System can manage all users" ON public.users IS 'Política permissiva para operações do sistema';