-- 🔧 CORREÇÃO URGENTE: PARTNER_REGISTRATIONS PRODUÇÃO
-- Execute este SQL no Supabase de PRODUÇÃO para corrigir o erro
-- https://app.supabase.com/project/[SEU_PROJECT_ID]/sql/new

-- =====================================================
-- PROBLEMA IDENTIFICADO:
-- ❌ Coluna 'privacy_accepted' não existe na tabela 'partner_registrations'
-- ❌ Outras colunas podem estar faltando também
-- =====================================================

-- =====================================================
-- PASSO 1: VERIFICAR ESTRUTURA ATUAL
-- =====================================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'partner_registrations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- PASSO 2: ADICIONAR COLUNAS FALTANTES
-- =====================================================

-- Adicionar coluna terms_accepted se não existir
ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false;

-- Adicionar coluna privacy_accepted se não existir (CRÍTICA)
ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT false;

-- Adicionar coluna updated_at se não existir
ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Adicionar outras colunas que podem estar faltantes
ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS business_name TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS contact_name TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS business_type TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS address_street TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS address_city TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS address_postal_code TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS address_country TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS website_url TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS instagram_handle TEXT;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS description TEXT;

-- =====================================================
-- PASSO 3: CRIAR ÍNDICES SE NÃO EXISTIREM
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_partner_registrations_status ON public.partner_registrations(status);
CREATE INDEX IF NOT EXISTS idx_partner_registrations_email ON public.partner_registrations(email);
CREATE INDEX IF NOT EXISTS idx_partner_registrations_created_at ON public.partner_registrations(created_at);

-- =====================================================
-- PASSO 4: VERIFICAR ESTRUTURA FINAL
-- =====================================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'partner_registrations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- PASSO 5: TESTAR INSERÇÃO
-- =====================================================
-- Teste rápido para verificar se todas as colunas estão funcionando
INSERT INTO public.partner_registrations (
  business_name,
  contact_name,
  email,
  phone,
  business_type,
  address_street,
  address_city,
  address_postal_code,
  address_country,
  website_url,
  instagram_handle,
  description,
  terms_accepted,
  privacy_accepted,
  status
) VALUES (
  'Teste Correção',
  'Admin Teste',
  'teste-correcao-' || extract(epoch from now()) || '@duopass.test',
  '+41 00 000 0000',
  'cafe_cultural',
  'Rua Teste, 123',
  'Zurich',
  '8000',
  'Switzerland',
  'https://teste.com',
  '@teste',
  'Teste de correção do esquema',
  true,
  true,
  'pending'
);

-- Verificar se o teste foi inserido
SELECT COUNT(*) as total_registros, 
       COUNT(CASE WHEN privacy_accepted IS NOT NULL THEN 1 END) as com_privacy_accepted
FROM public.partner_registrations;

-- Remover registro de teste
DELETE FROM public.partner_registrations 
WHERE email LIKE 'teste-correcao-%@duopass.test';

-- =====================================================
-- SUCESSO! 🎉
-- =====================================================
-- Se chegou até aqui sem erros:
-- ✅ Tabela partner_registrations corrigida
-- ✅ Coluna privacy_accepted adicionada
-- ✅ Outras colunas necessárias adicionadas
-- ✅ Índices criados para performance
-- 
-- Agora o cadastro de parceiros deve funcionar!
-- =====================================================

-- PRÓXIMOS PASSOS:
-- 1. Teste o cadastro de parceiros em https://duopassclub.ch
-- 2. Verifique se não há mais erros no console
-- 3. Se ainda houver problemas, execute o build sync completo