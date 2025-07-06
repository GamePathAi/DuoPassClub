-- Script para resolver o erro de chave duplicada (users_pkey)
-- Este erro acontece quando o ID já existe na tabela

-- 1. Verificar o estado atual da tabela users
SELECT 'Estado atual da tabela users:' as info;
SELECT COUNT(*) as total_registros FROM public.users;
SELECT id, email, full_name, user_type, created_at FROM public.users ORDER BY created_at DESC LIMIT 10;

-- 2. Verificar se existe algum problema com a sequência de IDs (se estiver usando SERIAL)
SELECT 'Informações sobre a coluna ID:' as info;
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'id';

-- 3. Verificar constraints da tabela
SELECT 'Constraints da tabela users:' as info;
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;

-- 4. Limpar registros duplicados ou problemáticos (se existirem)
-- Primeiro, vamos ver se há emails duplicados
SELECT 'Verificando emails duplicados:' as info;
SELECT email, COUNT(*) as count 
FROM public.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 5. Se a coluna ID for UUID, vamos garantir que está usando gen_random_uuid()
-- Se for SERIAL, vamos resetar a sequência
DO $$
BEGIN
    -- Verificar se a coluna ID é UUID
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public' 
        AND column_name = 'id' 
        AND data_type = 'uuid'
    ) THEN
        RAISE NOTICE 'Coluna ID é UUID - verificando se está usando gen_random_uuid()';
        
        -- Garantir que a coluna ID tem default gen_random_uuid()
        ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
        RAISE NOTICE 'Default gen_random_uuid() definido para coluna ID';
        
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public' 
        AND column_name = 'id' 
        AND data_type IN ('integer', 'bigint')
    ) THEN
        RAISE NOTICE 'Coluna ID é SERIAL - resetando sequência';
        
        -- Resetar a sequência se for SERIAL
        PERFORM setval(pg_get_serial_sequence('public.users', 'id'), 
                      COALESCE(MAX(id), 1), true) 
        FROM public.users;
        RAISE NOTICE 'Sequência resetada';
    END IF;
END $$;

-- 6. Teste de inserção para verificar se o problema foi resolvido
INSERT INTO public.users (email, full_name, user_type, created_at, updated_at)
VALUES (
    'teste-fix@exemplo.com',
    'Usuário Teste Fix',
    'client',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

SELECT 'Teste de inserção realizado!' as status;

-- 7. Verificar se o registro foi inserido
SELECT 'Verificando inserção:' as info;
SELECT id, email, full_name, user_type FROM public.users WHERE email = 'teste-fix@exemplo.com';

-- 8. Limpar o registro de teste
DELETE FROM public.users WHERE email = 'teste-fix@exemplo.com';

-- 9. Verificar estado final
SELECT 'Estado final da tabela:' as info;
SELECT COUNT(*) as total_registros FROM public.users;

SELECT 'Script de correção de chave duplicada executado com sucesso!' as final_status;