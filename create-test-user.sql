-- Criar usuário de teste para debug do login
INSERT INTO public.users (
    email,
    full_name,
    user_type,
    email_verified
) VALUES (
    'igor_bonafe@msn.com',
    'Igor Teste',
    'customer',
    true
);

-- Verificar se foi criado
SELECT * FROM public.users WHERE email = 'igor_bonafe@msn.com';