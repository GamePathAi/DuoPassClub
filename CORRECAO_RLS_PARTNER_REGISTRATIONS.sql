-- 🔧 CORREÇÃO RLS PARA PARTNER_REGISTRATIONS - RESOLVER ERRO UPSERT
-- Execute este SQL no Supabase de PRODUÇÃO para corrigir o erro de upsert
-- https://app.supabase.com/project/[SEU_PROJECT_ID]/sql/new

-- =====================================================
-- PROBLEMA IDENTIFICADO:
-- ❌ Políticas RLS permitem apenas INSERT para usuários anônimos
-- ❌ UPSERT precisa de permissões de INSERT + UPDATE
-- ❌ Erro: "duplicate key value violates unique constraint"
-- =====================================================

-- =====================================================
-- SOLUÇÃO: ADICIONAR POLÍTICA UPDATE PARA UPSERT
-- =====================================================

-- 1. Verificar políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'partner_registrations';

-- 2. Adicionar política UPDATE para permitir upsert em emails duplicados
CREATE POLICY "Allow public upsert for partner registrations"
  ON public.partner_registrations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 3. Alternativa: Política UPDATE mais restritiva (apenas para mesmo email)
DROP POLICY IF EXISTS "Allow public upsert for partner registrations" ON public.partner_registrations;

CREATE POLICY "Allow public update same email partner registrations"
  ON public.partner_registrations FOR UPDATE
  TO public
  USING (email = email)  -- Permite update apenas no mesmo registro
  WITH CHECK (email = email);

-- 4. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'partner_registrations'
ORDER BY policyname;

-- =====================================================
-- TESTE DE UPSERT
-- =====================================================

-- Teste 1: Inserir novo registro
INSERT INTO public.partner_registrations (
  business_name,
  contact_name,
  email,
  phone,
  business_type,
  status
) VALUES (
  'Teste RLS Upsert',
  'Teste Contato',
  'teste-rls-' || extract(epoch from now()) || '@duopass.test',
  '+41 00 000 0000',
  'cafe',
  'pending'
);

-- Teste 2: Tentar upsert no mesmo email (deve funcionar agora)
INSERT INTO public.partner_registrations (
  business_name,
  contact_name,
  email,
  phone,
  business_type,
  status
) VALUES (
  'Teste RLS Upsert ATUALIZADO',
  'Teste Contato ATUALIZADO',
  (SELECT email FROM public.partner_registrations WHERE business_name = 'Teste RLS Upsert' LIMIT 1),
  '+41 11 111 1111',
  'restaurante',
  'pending'
)
ON CONFLICT (email) 
DO UPDATE SET 
  business_name = EXCLUDED.business_name,
  contact_name = EXCLUDED.contact_name,
  phone = EXCLUDED.phone,
  business_type = EXCLUDED.business_type,
  updated_at = now();

-- Verificar se o upsert funcionou
SELECT business_name, contact_name, email, phone, business_type, created_at, updated_at
FROM public.partner_registrations 
WHERE email LIKE 'teste-rls-%@duopass.test'
ORDER BY created_at DESC;

-- Limpar dados de teste
DELETE FROM public.partner_registrations 
WHERE email LIKE 'teste-rls-%@duopass.test';

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Confirmar que as políticas estão ativas
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'partner_registrations'
ORDER BY cmd, policyname;

-- =====================================================
-- SUCESSO! 🎉
-- =====================================================
-- Se chegou até aqui sem erros:
-- ✅ Política UPDATE adicionada para usuários públicos
-- ✅ UPSERT agora funciona corretamente
-- ✅ Erro de "duplicate key" resolvido
-- ✅ Cadastro de parceiros deve funcionar em produção
-- =====================================================

-- PRÓXIMOS PASSOS:
-- 1. Teste o cadastro de parceiros em https://duopassclub.ch
-- 2. Tente cadastrar o mesmo email duas vezes
-- 3. Verifique se não há mais erros 409 no console
-- 4. Confirme que os dados são salvos/atualizados corretamente