-- ====================================================================
-- SCRIPT DE MIGRAÇÃO PARA CORREÇÃO DE UUIDs NA TABELA vouchers
-- OBJETIVO: Corrigir IDs inválidos e fortalecer o esquema da tabela.
-- ATENÇÃO: FAÇA UM BACKUP DO SEU BANCO DE DADOS ANTES DE EXECUTAR.
-- ====================================================================

-- Passo 1: Atualizar todos os IDs que não são UUIDs para UUIDs válidos.
-- Esta query identifica todos os vouchers cujo ID não corresponde ao formato UUID
-- e atribui um novo UUID gerado aleatoriamente para cada um.
UPDATE public.vouchers
SET id = gen_random_uuid()::text
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Passo 2: Alterar o tipo da coluna 'id' para UUID.
-- Com todos os IDs agora em formato de UUID (como texto), podemos com segurança
-- converter a coluna para o tipo 'uuid', o que garantirá a integridade dos dados.
-- O 'USING id::uuid' faz a conversão.
ALTER TABLE public.vouchers
ALTER COLUMN id TYPE UUID USING id::uuid;

-- Passo 3: Definir o valor padrão da coluna 'id' para gerar UUIDs automaticamente.
-- Isso garante que qualquer novo voucher inserido sem um ID especificado
-- receberá automaticamente um UUID válido, prevenindo problemas futuros.
ALTER TABLE public.vouchers
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Passo 4: (Opcional, mas recomendado) Garantir que a coluna 'id' é a chave primária.
-- Se a sua tabela já tem uma chave primária diferente, você pode precisar removê-la primeiro.
-- Descomente a linha abaixo se precisar remover uma constraint existente.
-- ALTER TABLE public.vouchers DROP CONSTRAINT vouchers_pkey;
ALTER TABLE public.vouchers ADD CONSTRAINT vouchers_pkey PRIMARY KEY (id);


-- ====================================================================
-- VERIFICAÇÃO PÓS-MIGRAÇÃO (Execute manualmente para confirmar)
-- ====================================================================

-- 1. Verifique se não há mais IDs inválidos (deve retornar 0).
/*
SELECT COUNT(*) FROM public.vouchers 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
*/

-- 2. Verifique o tipo da coluna 'id' (deve ser 'uuid').
/*
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vouchers' AND column_name = 'id';
*/

-- ====================================================================