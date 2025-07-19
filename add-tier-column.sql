-- Criar o tipo ENUM para os níveis de oferta
DO $$ 
BEGIN
  CREATE TYPE offer_tier AS ENUM ('Golden', 'Premium', 'Freemium');
EXCEPTION 
  WHEN duplicate_object THEN null;
END $$;

-- Adicionar a coluna 'tier' à tabela 'offers'
ALTER TABLE offers
ADD COLUMN IF NOT EXISTS tier offer_tier NOT NULL DEFAULT 'Freemium';

-- Atualizar ofertas existentes baseado nos critérios
UPDATE offers
SET tier = CASE
  WHEN LOWER(title) LIKE '%exclusivo%' OR LOWER(title) LIKE '%vip%' THEN 'Golden'::offer_tier
  WHEN LOWER(category) LIKE '%gourmet%' OR original_value > 100 THEN 'Premium'::offer_tier
  ELSE 'Freemium'::offer_tier
END;

-- Adicionar comentário explicativo à coluna
COMMENT ON COLUMN offers.tier IS 'Categoriza ofertas em diferentes níveis de acesso: Golden (exclusivo), Premium (alto valor) e Freemium (padrão).';