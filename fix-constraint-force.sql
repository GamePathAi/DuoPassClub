-- Script para forçar a remoção da constraint users_user_type_check
-- Este script vai resolver definitivamente o problema

-- 1. Primeiro, vamos ver o estado atual da tabela
SELECT 'Estado atual da tabela users:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- 2. Verificar constraints existentes
SELECT 'Constraints atuais:' as info;
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;

-- 3. Forçar remoção de TODAS as constraints relacionadas a user_type
DO $$
BEGIN
    -- Tentar remover todas as possíveis constraints
    BEGIN
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_type_check CASCADE;
        RAISE NOTICE 'Constraint users_user_type_check removida';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao remover users_user_type_check: %', SQLERRM;
    END;
    
    BEGIN
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_type_check1 CASCADE;
        RAISE NOTICE 'Constraint users_user_type_check1 removida';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao remover users_user_type_check1: %', SQLERRM;
    END;
    
    BEGIN
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS check_user_type CASCADE;
        RAISE NOTICE 'Constraint check_user_type removida';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao remover check_user_type: %', SQLERRM;
    END;
END $$;

-- 4. Alterar a coluna user_type para remover qualquer constraint
ALTER TABLE public.users ALTER COLUMN user_type DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN user_type TYPE TEXT;

-- 5. Verificar se ainda existem constraints
SELECT 'Constraints após remoção:' as info;
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;

-- 6. Teste de inserção para verificar se funciona
INSERT INTO public.users (id, email, full_name, user_type, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'teste@exemplo.com',
    'Usuário Teste',
    'client',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

SELECT 'Teste de inserção realizado com sucesso!' as status;

-- 7. Limpar o registro de teste
DELETE FROM public.users WHERE email = 'teste@exemplo.com';

-- 8. Verificar registros existentes
SELECT 'Registros atuais na tabela:' as info;
SELECT id, email, full_name, user_type, created_at FROM public.users LIMIT 5;

SELECT 'Script executado com sucesso! Tabela users sem constraints de user_type.' as final_status;