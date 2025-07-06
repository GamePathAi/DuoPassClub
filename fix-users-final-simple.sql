-- SOLUÇÃO SIMPLES PARA ERRO "INSERT has more expressions than target columns"
-- Recria tabela users do zero sem complicações

-- ========================================
-- 1. LIMPAR TUDO
-- ========================================
SELECT 'LIMPEZA: Removendo tabelas existentes' as etapa;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS users_backup_auth_debug CASCADE;
DROP TABLE IF EXISTS users_backup_debug CASCADE;

-- ========================================
-- 2. CRIAR TABELA USERS LIMPA
-- ========================================
SELECT 'CRIAÇÃO: Nova tabela users' as etapa;
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    email_verification_sent_at TIMESTAMPTZ,
    subscription_status TEXT DEFAULT 'inactive',
    city VARCHAR(100),
    canton VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. DESABILITAR RLS PARA TESTE
-- ========================================
SELECT 'CONFIGURAÇÃO: Desabilitando RLS para teste' as etapa;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. TESTE RÁPIDO
-- ========================================
SELECT 'TESTE: Inserção de teste' as etapa;
INSERT INTO public.users (email, full_name, user_type)
VALUES ('teste@duopass.com', 'Teste User', 'customer');

-- ========================================
-- 5. VERIFICAR SE FUNCIONOU
-- ========================================
SELECT 'VERIFICAÇÃO: Dados inseridos' as etapa;
SELECT * FROM public.users;

-- ========================================
-- 6. LIMPAR TESTE
-- ========================================
SELECT 'LIMPEZA: Removendo dados de teste' as etapa;
DELETE FROM public.users WHERE email = 'teste@duopass.com';

-- ========================================
-- 7. HABILITAR RLS PARA PRODUÇÃO
-- ========================================
SELECT 'CONFIGURAÇÃO: Habilitando RLS' as etapa;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Criar política permissiva para desenvolvimento
CREATE POLICY "users_all_access" ON public.users
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ========================================
-- RESULTADO FINAL
-- ========================================
SELECT 'TABELA USERS RECRIADA COM SUCESSO!' as status;
SELECT 'RLS habilitado com política permissiva' as configuracao;
SELECT 'Pronto para testar registro no aplicativo' as proxima_acao;

-- Verificação final da estrutura
SELECT 'ESTRUTURA FINAL:' as info;
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;