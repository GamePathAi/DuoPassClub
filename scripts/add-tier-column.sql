-- Adiciona a coluna tier na tabela offers
ALTER TABLE offers
ADD COLUMN tier text CHECK (tier IN ('Golden', 'Premium', 'Freemium'));

-- Define o valor padrão como 'Freemium' para registros existentes
UPDATE offers SET tier = 'Freemium';

-- Torna a coluna não nula após definir os valores padrão
ALTER TABLE offers
ALTER COLUMN tier SET NOT NULL;