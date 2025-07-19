-- Verificar estrutura atual da tabela vouchers
-- Execute este SQL no Supabase para ver todos os campos e suas restrições

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'vouchers'
ORDER BY ordinal_position;

-- Verificar restrições NOT NULL
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
  AND tc.table_name = 'vouchers'
  AND tc.constraint_type = 'CHECK';

-- Verificar se tabela vouchers existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name = 'vouchers'
) as tabela_existe;