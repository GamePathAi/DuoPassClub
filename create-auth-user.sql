-- Criar usuário no sistema de autenticação do Supabase
-- IMPORTANTE: Este script deve ser executado no painel do Supabase SQL Editor

-- 1. Inserir na tabela auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'igor_bonafe@msn.com',
    crypt('123456', gen_salt('bf')), -- senha: 123456
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 2. Verificar se foi criado
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'igor_bonafe@msn.com';

-- 3. Atualizar a tabela users com o ID correto do auth.users
UPDATE public.users 
SET id = (SELECT id FROM auth.users WHERE email = 'igor_bonafe@msn.com')
WHERE email = 'igor_bonafe@msn.com';

-- 4. Verificar se tudo está sincronizado
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.email_verified,
    au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'igor_bonafe@msn.com';