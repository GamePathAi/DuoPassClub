-- Script para atualizar a tabela offers com campos necessários
-- Execute este script no Supabase SQL Editor

-- Adicionar campos faltantes à tabela offers
ALTER TABLE public.offers 
ADD COLUMN IF NOT EXISTS original_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS terms_conditions TEXT;

-- Atualizar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_offers_category ON public.offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_location ON public.offers(location);
CREATE INDEX IF NOT EXISTS idx_offers_expires_at ON public.offers(expires_at);

-- Inserir dados demo para teste
INSERT INTO public.offers (
  title, 
  description, 
  original_value, 
  category, 
  location, 
  expires_at, 
  terms_conditions, 
  image_url,
  is_active
) VALUES 
(
  '🍕 Pizza Margherita 50% OFF',
  'Deliciosa pizza margherita tradicional com molho de tomate, mussarela e manjericão fresco. Massa artesanal preparada diariamente.',
  45.90,
  'Gastronomia',
  'Zürich',
  NOW() + INTERVAL '30 days',
  'Válido de segunda a quinta-feira. Não cumulativo com outras promoções.',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  true
),
(
  '💄 Maquiagem Completa - 50% OFF',
  'Transformação completa com maquiagem profissional para qualquer ocasião. Inclui limpeza de pele, base, contorno, olhos e batom.',
  120.00,
  'Beleza',
  'Genève',
  NOW() + INTERVAL '45 days',
  'Agendamento obrigatório. Válido até o final do mês.',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
  true
),
(
  '🎬 Cinema: 2 Ingressos por CHF 38',
  'Dois ingressos para qualquer sessão de cinema, incluindo filmes em cartaz e lançamentos. Pipoca grátis incluída!',
  38.00,
  'Lazer',
  'Basel',
  NOW() + INTERVAL '20 days',
  'Não válido para pré-estreias e sessões especiais.',
  'https://images.unsplash.com/photo-1489185078254-c3365d6e359f?w=400&h=300&fit=crop',
  true
),
(
  '🏋️ Academia: 3 Meses por CHF 180',
  'Acesso completo à academia por 3 meses, incluindo musculação, aulas coletivas e acompanhamento nutricional personalizado.',
  180.00,
  'Fitness',
  'Bern',
  NOW() + INTERVAL '60 days',
  'Válido apenas para novos alunos. Documentos obrigatórios.',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  true
),
(
  '📱 iPhone 15: 15% Cashback',
  'iPhone 15 com 15% de cashback. Todas as cores disponíveis, 128GB de armazenamento. Garantia oficial Apple.',
  1299.00,
  'Tecnologia',
  'Lausanne',
  NOW() + INTERVAL '15 days',
  'Cashback creditado em até 30 dias. Estoque limitado.',
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
  true
),
(
  '🧹 Limpeza Residencial Completa',
  'Serviço completo de limpeza residencial, incluindo todos os cômodos, janelas e áreas externas. Produtos ecológicos.',
  150.00,
  'Serviços',
  'Winterthur',
  NOW() + INTERVAL '40 days',
  'Agendamento com 48h de antecedência. Produtos inclusos.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  true
),
(
  '☕ Café Premium: Compre 2, Leve 3',
  'Promoção especial de café premium importado. Compre 2 pacotes de 500g e leve 3. Grãos selecionados.',
  89.90,
  'Gastronomia',
  'Lucerne',
  NOW() + INTERVAL '25 days',
  'Válido apenas para café em grãos. Não válido para café moído.',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
  true
),
(
  '🎵 Aulas de Música: 4 por CHF 200',
  'Pacote de 4 aulas individuais de música (violão, piano ou canto). Professor experiente e método personalizado.',
  200.00,
  'Educação',
  'St. Gallen',
  NOW() + INTERVAL '50 days',
  'Agendamento flexível. Válido por 3 meses após ativação.',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  true
)
ON CONFLICT DO NOTHING;

-- Verificar se os dados foram inseridos
SELECT COUNT(*) as total_offers FROM public.offers WHERE is_active = true;

COMMIT;