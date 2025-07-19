-- Script simplificado para verificar problemas de UUID
-- Este script usa apenas operações básicas suportadas pelo cliente Supabase

-- 1. Verificar estrutura da tabela vouchers
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vouchers' 
  AND table_schema = 'public' 
ORDER BY ordinal_position;

-- 2. Buscar vouchers do usuário específico para análise
SELECT 
  id,
  user_id,
  code,
  status,
  created_at
FROM public.vouchers
WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';

-- 3. Buscar todos os vouchers para análise de padrão de IDs
SELECT 
  id,
  code,
  status
FROM public.vouchers
ORDER BY created_at DESC;