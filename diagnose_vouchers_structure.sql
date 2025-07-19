-- 1. Analisar estrutura atual de vouchers e tipo de dados da coluna ID
SELECT 
  id, 
  user_id, 
  code, 
  status, 
  created_at, 
  pg_typeof(id) as id_type, 
  length(id::text) as id_length 
FROM public.vouchers 
WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57' 
LIMIT 10;

-- 2. Verificar a definição da tabela vouchers
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vouchers' AND table_schema = 'public' 
ORDER BY ordinal_position;

-- 3. Verificar quantos vouchers têm IDs inválidos
SELECT 
  COUNT(*) as total_vouchers, 
  COUNT(CASE WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as valid_uuids, 
  COUNT(CASE WHEN id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as invalid_uuids 
FROM public.vouchers;

-- 4. Listar vouchers com IDs problemáticos
SELECT id, code, status 
FROM public.vouchers 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';