-- Script para corrigir schema da tabela vouchers
-- Adiciona coluna offer_id que está faltando
-- Execute este script no Supabase SQL Editor

-- Adicionar coluna offer_id à tabela vouchers
ALTER TABLE public.vouchers 
ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_vouchers_offer_id ON public.vouchers(offer_id);

-- Atualizar vouchers existentes com offer_id demo (se houver)
-- Isso é necessário para vouchers que já existem sem offer_id
UPDATE public.vouchers 
SET offer_id = (
  SELECT id FROM public.offers 
  WHERE merchant_id = vouchers.merchant_id 
  LIMIT 1
)
WHERE offer_id IS NULL;

-- Verificar se a coluna foi adicionada corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vouchers' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Comentário: Agora a tabela vouchers tem a coluna offer_id necessária
-- para relacionar vouchers com ofertas específicas