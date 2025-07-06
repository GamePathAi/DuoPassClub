-- Script TDD para debug completo do erro de chave duplicada
-- Test-Driven Development com logs detalhados

-- ========================================
-- FASE 1: DIAGNÓSTICO COMPLETO
-- ========================================

-- 1.1 Verificar estrutura atual da tabela
SELECT 'DIAGNÓSTICO: Estrutura da tabela users' as fase;
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 1.2 Verificar todos os registros existentes
SELECT 'DIAGNÓSTICO: Registros existentes' as fase;
SELECT 
    id,
    email,
    full_name,
    user_type,
    created_at,
    updated_at
FROM public.users 
ORDER BY created_at DESC;

-- 1.3 Verificar constraints e índices
SELECT 'DIAGNÓSTICO: Constraints' as fase;
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;

-- 1.4 Verificar índices
SELECT 'DIAGNÓSTICO: Índices' as fase;
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users' AND schemaname = 'public';

-- 1.5 Verificar sequências (se existirem)
SELECT 'DIAGNÓSTICO: Sequências' as fase;
SELECT 
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment,
    cycle_option
FROM information_schema.sequences 
WHERE sequence_schema = 'public' AND sequence_name LIKE '%users%';

-- ========================================
-- FASE 2: TESTES DE INSERÇÃO CONTROLADOS
-- ========================================

-- 2.1 Teste 1: Inserção com ID explícito (deve falhar se ID já existe)
SELECT 'TESTE 1: Inserção com ID explícito' as fase;
DO $$
BEGIN
    BEGIN
        INSERT INTO public.users (id, email, full_name, user_type, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000001',
            'teste1@debug.com',
            'Teste Debug 1',
            'client',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'TESTE 1 SUCESSO: Inserção com ID explícito funcionou';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'TESTE 1 FALHOU: ID já existe - %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'TESTE 1 ERRO: %', SQLERRM;
    END;
END $$;

-- 2.2 Teste 2: Inserção sem ID (deixar o default gerar)
SELECT 'TESTE 2: Inserção sem ID (default)' as fase;
DO $$
BEGIN
    BEGIN
        INSERT INTO public.users (email, full_name, user_type, created_at, updated_at)
        VALUES (
            'teste2@debug.com',
            'Teste Debug 2',
            'client',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'TESTE 2 SUCESSO: Inserção sem ID funcionou';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'TESTE 2 FALHOU: Violação de chave única - %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'TESTE 2 ERRO: %', SQLERRM;
    END;
END $$;

-- 2.3 Teste 3: Verificar se gen_random_uuid() está funcionando
SELECT 'TESTE 3: Verificando gen_random_uuid()' as fase;
SELECT gen_random_uuid() as uuid_gerado_1;
SELECT gen_random_uuid() as uuid_gerado_2;
SELECT gen_random_uuid() as uuid_gerado_3;

-- ========================================
-- FASE 3: LIMPEZA E RECRIAÇÃO FORÇADA
-- ========================================

-- 3.1 Backup dos dados existentes
SELECT 'FASE 3: Backup dos dados' as fase;
CREATE TABLE IF NOT EXISTS users_backup_debug AS 
SELECT * FROM public.users;

SELECT 'Backup criado com ' || COUNT(*) || ' registros' as backup_status
FROM users_backup_debug;

-- 3.2 Remover tabela users completamente
SELECT 'FASE 3: Removendo tabela users' as fase;
DROP TABLE IF EXISTS public.users CASCADE;

-- 3.3 Recriar tabela users do zero
SELECT 'FASE 3: Recriando tabela users' as fase;
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.4 Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3.5 Criar política permissiva
CREATE POLICY "users_insert_policy_debug" ON public.users
FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- FASE 4: TESTES FINAIS
-- ========================================

-- 4.1 Teste de inserção múltipla
SELECT 'TESTE FINAL: Inserções múltiplas' as fase;
DO $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 1..5 LOOP
        BEGIN
            INSERT INTO public.users (email, full_name, user_type, created_at, updated_at)
            VALUES (
                'teste_final_' || i || '@debug.com',
                'Teste Final ' || i,
                CASE 
                    WHEN i % 2 = 0 THEN 'client'
                    ELSE 'professional'
                END,
                NOW(),
                NOW()
            );
            RAISE NOTICE 'Inserção % SUCESSO', i;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Inserção % FALHOU: %', i, SQLERRM;
        END;
    END LOOP;
END $$;

-- 4.2 Verificar resultado final
SELECT 'RESULTADO FINAL' as fase;
SELECT 
    COUNT(*) as total_registros,
    COUNT(DISTINCT id) as ids_unicos,
    COUNT(DISTINCT email) as emails_unicos
FROM public.users;

-- 4.3 Mostrar todos os registros criados
SELECT 
    id,
    email,
    full_name,
    user_type,
    created_at
FROM public.users 
ORDER BY created_at;

-- 4.4 Limpar registros de teste
DELETE FROM public.users WHERE email LIKE '%debug.com';
DELETE FROM public.users WHERE email LIKE '%teste_final_%';

-- 4.5 Restaurar dados do backup (se existirem)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users_backup_debug) THEN
        INSERT INTO public.users (email, full_name, user_type, created_at, updated_at)
        SELECT email, full_name, user_type, created_at, updated_at
        FROM users_backup_debug
        ON CONFLICT (email) DO NOTHING;
        
        RAISE NOTICE 'Dados do backup restaurados';
    ELSE
        RAISE NOTICE 'Nenhum dado para restaurar';
    END IF;
END $$;

-- 4.6 Limpar backup
DROP TABLE IF EXISTS users_backup_debug;

SELECT 'SCRIPT TDD COMPLETO - TABELA USERS RECRIADA E TESTADA!' as status_final;
SELECT 'Agora teste o registro no aplicativo' as proxima_acao;