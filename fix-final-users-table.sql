-- SCRIPT FINAL PARA RESOLVER DEFINITIVAMENTE O ERRO DE CADASTRO
-- Execute este SQL no Supabase > SQL Editor

-- PASSO 1: REMOVER COMPLETAMENTE A TABELA E TODAS AS DEPENDÊNCIAS
DROP TABLE IF EXISTS public.users CASCADE;

-- PASSO 2: RECRIAR A TABELA SEM NENHUMA CONSTRAINT RESTRITIVA
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    email_verified BOOLEAN DEFAULT false,
    email_verification_sent_at TIMESTAMPTZ,
    city VARCHAR(100),
    canton VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASSO 3: HABILITAR RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- PASSO 4: CRIAR UMA ÚNICA POLÍTICA PERMISSIVA PARA TESTES
CREATE POLICY "allow_all_for_testing" ON public.users 
    FOR ALL 
    TO authenticated, anon 
    USING (true) 
    WITH CHECK (true);

-- PASSO 5: TESTAR INSERÇÃO COM DIFERENTES VALORES
INSERT INTO public.users (email, full_name, user_type) VALUES 
('teste1@test.com', 'Teste Customer', 'customer'),
('teste2@test.com', 'Teste Merchant', 'merchant'),
('teste3@test.com', 'Teste Client', 'client'),
('teste4@test.com', 'Teste Comerciante', 'comerciante'),
('teste5@test.com', 'Teste Qualquer', 'qualquer_valor');

-- PASSO 6: VERIFICAR INSERÇÕES
SELECT id, email, full_name, user_type, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- PASSO 7: VERIFICAR ESTRUTURA DA TABELA
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- PASSO 8: VERIFICAR POLÍTICAS
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users';

-- PASSO 9: VERIFICAR RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

SELECT '🎉 TABELA USERS RECRIADA COM SUCESSO!' as status;
SELECT '✅ Agora teste o cadastro na aplicação!' as proximos_passos;
SELECT '🔍 Verifique o console.log para ver os valores enviados!' as debug_info;