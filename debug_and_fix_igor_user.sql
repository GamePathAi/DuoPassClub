-- 🔍 Script de Debug e Correção para Usuário Igor - DuoPass
-- Execute este script no Supabase SQL Editor

-- 1. VERIFICAR ESTRUTURA DA TABELA USERS
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. VERIFICAR STATUS ATUAL DO USUÁRIO IGOR
SELECT 
    id,
    email,
    full_name,
    user_type,
    subscription_status,
    email_verified,
    created_at,
    updated_at
FROM public.users 
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57'
OR email = 'igor.bonafe@gmail.com';

-- 3. VERIFICAR SE EXISTEM MÚLTIPLOS REGISTROS PARA O MESMO EMAIL
SELECT 
    id,
    email,
    full_name,
    user_type,
    subscription_status,
    created_at
FROM public.users 
WHERE email = 'igor.bonafe@gmail.com'
ORDER BY created_at DESC;

-- 4. ATUALIZAR USUÁRIO IGOR COM TODOS OS CAMPOS NECESSÁRIOS
UPDATE public.users 
SET 
    subscription_status = 'active',
    user_type = 'client',
    email_verified = true,
    updated_at = NOW()
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';

-- 5. VERIFICAR SE A ATUALIZAÇÃO FOI APLICADA
SELECT 
    id,
    email,
    full_name,
    user_type,
    subscription_status,
    email_verified,
    updated_at
FROM public.users 
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';

-- 6. VERIFICAR SE EXISTE TABELA DE VOUCHERS
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'vouchers'
);

-- 7. SE VOUCHERS EXISTIR, CRIAR VOUCHERS DE TESTE
INSERT INTO public.vouchers (user_id, code, status, expires_at, created_at)
SELECT 
    'd97e1c42-3468-425a-8784-4d646b2c4a57',
    'IGOR00' || generate_series(1,3),
    'active',
    NOW() + INTERVAL '30 days',
    NOW()
WHERE EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'vouchers'
)
ON CONFLICT (code) DO NOTHING;

-- 8. VERIFICAR VOUCHERS CRIADOS
SELECT 
    id,
    user_id,
    code,
    status,
    expires_at,
    created_at
FROM public.vouchers 
WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57'
ORDER BY created_at DESC;

-- 9. VERIFICAR SE EXISTE TABELA AUTH.USERS (SUPABASE AUTH)
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at
FROM auth.users 
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57'
OR email = 'igor.bonafe@gmail.com';

-- 10. RESULTADO FINAL - RESUMO DO STATUS
SELECT 
    'USUÁRIO IGOR - STATUS FINAL' as verificacao,
    u.id,
    u.email,
    u.full_name,
    u.user_type,
    u.subscription_status,
    u.email_verified,
    au.email_confirmed_at as auth_email_confirmed,
    COUNT(v.id) as total_vouchers
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
LEFT JOIN public.vouchers v ON u.id = v.user_id AND v.status = 'active'
WHERE u.id = 'd97e1c42-3468-425a-8784-4d646b2c4a57'
GROUP BY u.id, u.email, u.full_name, u.user_type, u.subscription_status, u.email_verified, au.email_confirmed_at;

-- 11. VERIFICAR POLÍTICAS RLS (se estiverem bloqueando)
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