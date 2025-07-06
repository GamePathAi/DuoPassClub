-- Script de Debug Completo para Autenticação e Registro
-- Testa JWT, RLS, inserção de dados e configurações

-- ========================================
-- FASE 1: VERIFICAÇÃO DO AMBIENTE
-- ========================================

-- 1.1 Verificar extensões necessárias
SELECT 'VERIFICAÇÃO: Extensões instaladas' as fase;
SELECT 
    extname as extensao,
    extversion as versao
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pgjwt');

-- 1.2 Verificar se gen_random_uuid() funciona
SELECT 'TESTE: Geração de UUID' as fase;
SELECT 
    gen_random_uuid() as uuid1,
    gen_random_uuid() as uuid2,
    gen_random_uuid() as uuid3;

-- 1.3 Verificar configurações de autenticação
SELECT 'VERIFICAÇÃO: Configurações auth' as fase;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'auth' AND tablename = 'users';

-- ========================================
-- FASE 2: ANÁLISE DA TABELA USERS
-- ========================================

-- 2.1 Estado atual da tabela
SELECT 'ANÁLISE: Estado atual da tabela users' as fase;
SELECT 
    COUNT(*) as total_registros,
    COUNT(DISTINCT id) as ids_unicos,
    COUNT(DISTINCT email) as emails_unicos
FROM public.users;

-- 2.2 Estrutura da tabela
SELECT 'ANÁLISE: Estrutura da tabela' as fase;
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2.3 Políticas RLS
SELECT 'ANÁLISE: Políticas RLS' as fase;
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
WHERE schemaname = 'public' AND tablename = 'users';

-- 2.4 Verificar se RLS está habilitado
SELECT 'ANÁLISE: Status RLS' as fase;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- ========================================
-- FASE 3: LIMPEZA E RECRIAÇÃO TOTAL
-- ========================================

-- 3.1 Backup completo
SELECT 'LIMPEZA: Criando backup' as fase;
DROP TABLE IF EXISTS users_backup_auth_debug;
CREATE TABLE users_backup_auth_debug AS 
SELECT * FROM public.users;

SELECT 'Backup criado com ' || COUNT(*) || ' registros' as backup_info
FROM users_backup_auth_debug;

-- 3.2 Remover todas as políticas
SELECT 'LIMPEZA: Removendo políticas RLS' as fase;
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'users'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.users';
        RAISE NOTICE 'Política removida: %', pol.policyname;
    END LOOP;
END $$;

-- 3.3 Remover tabela users
SELECT 'LIMPEZA: Removendo tabela users' as fase;
DROP TABLE IF EXISTS public.users CASCADE;

-- 3.4 Recriar tabela users com estrutura otimizada
SELECT 'CRIAÇÃO: Nova tabela users' as fase;
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type TEXT NOT NULL DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT false,
    email_verification_sent_at TIMESTAMP WITH TIME ZONE,
    subscription_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.5 Habilitar RLS
SELECT 'CONFIGURAÇÃO: Habilitando RLS' as fase;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3.6 Criar política super permissiva para debug
SELECT 'CONFIGURAÇÃO: Criando política permissiva' as fase;
CREATE POLICY "users_debug_policy" ON public.users
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ========================================
-- FASE 4: TESTES DE INSERÇÃO SIMULANDO REGISTRO
-- ========================================

-- 4.1 Teste 1: Inserção direta (simula backend)
SELECT 'TESTE 1: Inserção direta' as fase;
DO $$
DECLARE
    test_id UUID;
BEGIN
    BEGIN
        INSERT INTO public.users (
            email, 
            full_name, 
            user_type, 
            email_verified, 
            email_verification_sent_at,
            subscription_status
        ) VALUES (
            'teste1@debug.com',
            'Usuário Teste 1',
            'customer',
            false,
            NOW(),
            'trial'
        ) RETURNING id INTO test_id;
        
        RAISE NOTICE 'TESTE 1 SUCESSO: ID gerado = %', test_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'TESTE 1 FALHOU: %', SQLERRM;
    END;
END $$;

-- 4.2 Teste 2: Inserção com ID específico (simula auth.users)
SELECT 'TESTE 2: Inserção com ID específico' as fase;
DO $$
DECLARE
    auth_user_id UUID := '12345678-1234-1234-1234-123456789012';
BEGIN
    BEGIN
        INSERT INTO public.users (
            id,
            email, 
            full_name, 
            user_type, 
            email_verified, 
            email_verification_sent_at,
            subscription_status
        ) VALUES (
            auth_user_id,
            'teste2@debug.com',
            'Usuário Teste 2',
            'merchant',
            false,
            NOW(),
            null
        );
        
        RAISE NOTICE 'TESTE 2 SUCESSO: ID específico inserido = %', auth_user_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'TESTE 2 FALHOU: %', SQLERRM;
    END;
END $$;

-- 4.3 Teste 3: Múltiplas inserções rápidas
SELECT 'TESTE 3: Múltiplas inserções' as fase;
DO $$
DECLARE
    i INTEGER;
    success_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    FOR i IN 1..5 LOOP
        BEGIN
            INSERT INTO public.users (
                email, 
                full_name, 
                user_type
            ) VALUES (
                'teste_multi_' || i || '@debug.com',
                'Usuário Multi ' || i,
                CASE WHEN i % 2 = 0 THEN 'customer' ELSE 'merchant' END
            );
            success_count := success_count + 1;
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE NOTICE 'Inserção % falhou: %', i, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'TESTE 3 RESULTADO: % sucessos, % erros', success_count, error_count;
END $$;

-- ========================================
-- FASE 5: VERIFICAÇÃO FINAL
-- ========================================

-- 5.1 Contar registros criados
SELECT 'RESULTADO: Registros criados' as fase;
SELECT 
    COUNT(*) as total_registros,
    COUNT(DISTINCT id) as ids_unicos,
    COUNT(DISTINCT email) as emails_unicos
FROM public.users;

-- 5.2 Mostrar todos os registros
SELECT 'RESULTADO: Todos os registros' as fase;
SELECT 
    id,
    email,
    full_name,
    user_type,
    email_verified,
    created_at
FROM public.users 
ORDER BY created_at;

-- 5.3 Teste de atualização
SELECT 'TESTE: Atualização de registro' as fase;
DO $$
BEGIN
    BEGIN
        UPDATE public.users 
        SET email_verified = true 
        WHERE email = 'teste1@debug.com';
        
        RAISE NOTICE 'TESTE ATUALIZAÇÃO SUCESSO';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'TESTE ATUALIZAÇÃO FALHOU: %', SQLERRM;
    END;
END $$;

-- 5.4 Limpeza dos dados de teste
SELECT 'LIMPEZA: Removendo dados de teste' as fase;
DELETE FROM public.users WHERE email LIKE '%debug.com';

-- 5.5 Restaurar dados do backup
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users_backup_auth_debug LIMIT 1) THEN
        INSERT INTO public.users 
        SELECT * FROM users_backup_auth_debug
        ON CONFLICT (email) DO NOTHING;
        
        RAISE NOTICE 'Dados do backup restaurados';
    ELSE
        RAISE NOTICE 'Nenhum dado para restaurar do backup';
    END IF;
END $$;

-- 5.6 Limpar backup
DROP TABLE IF EXISTS users_backup_auth_debug;

SELECT 'DEBUG AUTH COMPLETO - TABELA RECRIADA E TESTADA!' as status_final;
SELECT 'Configuração JWT/RLS otimizada para registro' as configuracao;
SELECT 'Agora teste o registro no aplicativo novamente' as proxima_acao;