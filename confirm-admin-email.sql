-- Script SQL para confirmar email do usuário admin
-- Execute este script no SQL Editor do Supabase

-- 1. Confirmar email do usuário admin
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'admin@duopass.com';

-- 2. Verificar se o usuário foi confirmado
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'admin@duopass.com';

-- 3. Criar perfil do usuário na tabela users (se não existir)
INSERT INTO public.users (
  id,
  email,
  full_name,
  user_type,
  email_verified,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  'Administrador DuoPass',
  'admin',
  true,
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'admin@duopass.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = au.id
  );

-- 4. Atualizar tipo de usuário para admin (caso já exista)
UPDATE public.users 
SET 
  user_type = 'admin',
  email_verified = true,
  updated_at = NOW()
WHERE email = 'admin@duopass.com';

-- 5. Verificar resultado final
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.user_type,
  u.email_verified,
  au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@duopass.com';

-- 6. Mensagem de sucesso
SELECT 'Usuário admin configurado com sucesso!' as status,
       'Email: admin@duopass.com' as email,
       'Senha: admin123' as senha,
       'Tipo: admin' as tipo;