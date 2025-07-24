-- 🎭 DUOPASS - CRIAÇÃO COMPLETA DAS TABELAS CULTURAIS
-- Execute este SQL completo no Supabase SQL Editor
-- https://app.supabase.com/project/[SEU_PROJECT_ID]/sql/new

-- =====================================================
-- PASSO 1: CRIAR FUNÇÃO EXEC_SQL (NECESSÁRIA)
-- =====================================================
CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS TABLE(result json)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY EXECUTE 'SELECT to_json(t) FROM (' || query || ') t';
END;
$$;

-- =====================================================
-- PASSO 2: CRIAR TABELAS CULTURAIS
-- =====================================================

-- Tabela de Parceiros Culturais
CREATE TABLE IF NOT EXISTS cultural_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  founder_story TEXT,
  cultural_mission TEXT,
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  business_type TEXT NOT NULL,
  cultural_category TEXT NOT NULL,
  address JSONB NOT NULL,
  ambiance_description TEXT,
  social_values TEXT[],
  instagram_handle TEXT,
  website_url TEXT,
  opening_hours JSONB,
  capacity_info TEXT,
  accessibility_features TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approval_notes TEXT,
  curator_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by UUID
);

-- Tabela de Experiências Culturais
CREATE TABLE IF NOT EXISTS cultural_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES cultural_partners(id) ON DELETE CASCADE,
  experience_name TEXT NOT NULL,
  story_behind TEXT,
  cultural_value TEXT,
  duo_benefit TEXT NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  duo_price DECIMAL(10,2) NOT NULL,
  ambiance_notes TEXT,
  best_for TEXT[],
  duration_minutes INTEGER,
  max_participants INTEGER DEFAULT 2,
  available_days TEXT[],
  available_times TEXT[],
  special_requirements TEXT,
  cultural_tags TEXT[],
  emotion_tags TEXT[],
  images TEXT[],
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Histórias e Memórias
CREATE TABLE IF NOT EXISTS experience_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  experience_id UUID REFERENCES cultural_experiences(id) ON DELETE CASCADE,
  story_title TEXT,
  story_text TEXT NOT NULL,
  emotion_tags TEXT[],
  shared_with TEXT,
  memorable_moment TEXT,
  would_recommend BOOLEAN DEFAULT true,
  cultural_impact_rating INTEGER CHECK (cultural_impact_rating BETWEEN 1 AND 5),
  ambiance_rating INTEGER CHECK (ambiance_rating BETWEEN 1 AND 5),
  connection_rating INTEGER CHECK (connection_rating BETWEEN 1 AND 5),
  photos TEXT[],
  is_public BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Conexões Criadas
CREATE TABLE IF NOT EXISTS cultural_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES experience_stories(id),
  connection_type TEXT NOT NULL,
  connection_description TEXT,
  still_connected BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- PASSO 3: CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_cultural_partners_status ON cultural_partners(status);
CREATE INDEX IF NOT EXISTS idx_cultural_partners_category ON cultural_partners(cultural_category);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_active ON cultural_experiences(active);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_featured ON cultural_experiences(featured);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_tags ON cultural_experiences USING GIN(cultural_tags);
CREATE INDEX IF NOT EXISTS idx_experience_stories_public ON experience_stories(is_public);
CREATE INDEX IF NOT EXISTS idx_experience_stories_featured ON experience_stories(featured);

-- =====================================================
-- PASSO 4: CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE cultural_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_connections ENABLE ROW LEVEL SECURITY;

-- Políticas para parceiros culturais
DROP POLICY IF EXISTS "Parceiros aprovados são públicos" ON cultural_partners;
CREATE POLICY "Parceiros aprovados são públicos" ON cultural_partners
  FOR SELECT USING (status = 'approved');

-- Políticas para experiências culturais
DROP POLICY IF EXISTS "Experiências ativas são públicas" ON cultural_experiences;
CREATE POLICY "Experiências ativas são públicas" ON cultural_experiences
  FOR SELECT USING (active = true AND EXISTS (
    SELECT 1 FROM cultural_partners 
    WHERE id = cultural_experiences.partner_id AND status = 'approved'
  ));

-- Políticas para histórias
DROP POLICY IF EXISTS "Histórias públicas são visíveis" ON experience_stories;
CREATE POLICY "Histórias públicas são visíveis" ON experience_stories
  FOR SELECT USING (is_public = true);

-- =====================================================
-- PASSO 5: INSERIR DADOS DE EXEMPLO
-- =====================================================

-- Inserir parceiro de exemplo
INSERT INTO cultural_partners (
  business_name, founder_story, cultural_mission, contact_name, email,
  business_type, cultural_category, address, ambiance_description, social_values,
  instagram_handle, website_url, capacity_info, accessibility_features, status
) VALUES (
  'Café das Letras',
  'Fundado por uma professora aposentada que queria criar um espaço onde literatura e café se encontrassem.',
  'Promover o amor pela leitura através de experiências gastronômicas únicas.',
  'Maria Silva',
  'contato@cafedasletras.com',
  'cafe_cultural',
  'gastronomia_autoral',
  '{"street": "Rua das Flores, 123", "city": "São Paulo", "state": "SP", "zipcode": "01234-567"}',
  'Ambiente acolhedor com estantes repletas de livros, música suave e aroma de café especial.',
  ARRAY['sustentabilidade', 'arte_local', 'comercio_justo'],
  '@cafedasletras',
  'https://cafedasletras.com',
  'Ambiente íntimo para 30 pessoas',
  ARRAY['rampa_acesso', 'banheiro_adaptado'],
  'approved'
) ON CONFLICT (email) DO NOTHING;

-- Inserir experiência de exemplo
INSERT INTO cultural_experiences (
  partner_id, experience_name, story_behind, cultural_value, duo_benefit,
  original_price, duo_price, ambiance_notes, best_for, duration_minutes,
  max_participants, available_days, available_times, special_requirements,
  cultural_tags, emotion_tags, images, active, featured
) 
SELECT 
  cp.id,
  'Café Literário com Música ao Vivo',
  'Uma experiência única que combina literatura, café especial e música brasileira.',
  'Valorização da cultura literária e musical brasileira em ambiente acolhedor.',
  '2 cafés especiais + 2 fatias de bolo artesanal + sarau literário',
  80.00,
  40.00,
  'Ambiente íntimo com iluminação suave, perfeito para conversas profundas.',
  ARRAY['primeiro_encontro', 'amigos_arte', 'reflexao_pessoal'],
  120,
  2,
  ARRAY['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  ARRAY['14:00', '16:00', '18:00'],
  'Reserva com 24h de antecedência',
  ARRAY['literatura', 'musica', 'gastronomia'],
  ARRAY['descoberta', 'conexao', 'reflexao'],
  ARRAY['https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800'],
  true,
  true
FROM cultural_partners cp 
WHERE cp.email = 'contato@cafedasletras.com'
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 'cultural_partners' as tabela, COUNT(*) as registros FROM cultural_partners
UNION ALL
SELECT 'cultural_experiences' as tabela, COUNT(*) as registros FROM cultural_experiences
UNION ALL
SELECT 'experience_stories' as tabela, COUNT(*) as registros FROM experience_stories
UNION ALL
SELECT 'cultural_connections' as tabela, COUNT(*) as registros FROM cultural_connections;

-- =====================================================
-- SUCESSO! 🎉
-- =====================================================
-- Se chegou até aqui sem erros, as tabelas culturais
-- foram criadas com sucesso no seu Supabase!
-- 
-- Próximos passos:
-- 1. Volte para o terminal e execute: npm run dev
-- 2. Teste a aplicação em http://localhost:5174
-- 3. As experiências culturais agora funcionarão!
-- =====================================================