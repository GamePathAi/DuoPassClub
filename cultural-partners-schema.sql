-- 🎭 DUO PASS CLUB: ESTRUTURA CULTURAL
-- Transformando marketplace em plataforma cultural autêntica

-- =====================================================
-- PARCEIROS CULTURAIS (não apenas "merchants")
-- =====================================================
CREATE TABLE cultural_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  founder_story TEXT, -- A história por trás do lugar
  cultural_mission TEXT, -- Qual o propósito cultural
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  business_type TEXT NOT NULL, -- cafe_cultural, atelier_arte, restaurante_familia
  cultural_category TEXT NOT NULL, -- gastronomia_autoral, arte_local, bem_estar_holistico
  address JSONB NOT NULL,
  ambiance_description TEXT, -- "Café com livros e música ao vivo"
  social_values TEXT[], -- sustentabilidade, arte_local, comercio_justo
  instagram_handle TEXT,
  website_url TEXT,
  opening_hours JSONB,
  capacity_info TEXT, -- "Ambiente íntimo para 20 pessoas"
  accessibility_features TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approval_notes TEXT,
  curator_notes TEXT, -- Notas da curadoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- EXPERIÊNCIAS CULTURAIS (não apenas "ofertas")
-- =====================================================
CREATE TABLE cultural_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES cultural_partners(id) ON DELETE CASCADE,
  experience_name TEXT NOT NULL, -- "Jantar à luz de velas com música ao vivo"
  story_behind TEXT, -- Por que essa experiência é especial
  cultural_value TEXT, -- Que valor cultural oferece
  duo_benefit TEXT NOT NULL, -- "2 por 1 em experiência gastronômica autoral"
  original_price DECIMAL(10,2) NOT NULL,
  duo_price DECIMAL(10,2) NOT NULL,
  ambiance_notes TEXT, -- "Ambiente íntimo, conversas fluem naturalmente"
  best_for TEXT[], -- "primeiro_encontro", "amigos_arte", "reflexao_pessoal"
  duration_minutes INTEGER, -- Duração estimada da experiência
  max_participants INTEGER DEFAULT 2, -- Máximo de pessoas por voucher
  available_days TEXT[], -- dias da semana disponíveis
  available_times TEXT[], -- horários disponíveis
  special_requirements TEXT, -- "Reserva com 24h de antecedência"
  cultural_tags TEXT[], -- arte, musica, gastronomia, bem_estar, natureza
  emotion_tags TEXT[], -- romance, amizade, descoberta, reflexao, celebracao
  images TEXT[], -- URLs das imagens
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false, -- Experiência em destaque
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- HISTÓRIAS E MEMÓRIAS (não apenas "reviews")
-- =====================================================
CREATE TABLE experience_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES cultural_experiences(id) ON DELETE CASCADE,
  voucher_id UUID REFERENCES vouchers(id),
  story_title TEXT, -- "Uma tarde que mudou tudo"
  story_text TEXT NOT NULL, -- "Conheci minha melhor amiga neste café"
  emotion_tags TEXT[], -- "gratidao", "descoberta", "conexao"
  shared_with TEXT, -- "minha irmã", "colega de trabalho"
  memorable_moment TEXT, -- O que tornou especial
  would_recommend BOOLEAN DEFAULT true,
  cultural_impact_rating INTEGER CHECK (cultural_impact_rating BETWEEN 1 AND 5),
  ambiance_rating INTEGER CHECK (ambiance_rating BETWEEN 1 AND 5),
  connection_rating INTEGER CHECK (connection_rating BETWEEN 1 AND 5),
  photos TEXT[], -- Fotos da experiência
  is_public BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CONEXÕES CRIADAS
-- =====================================================
CREATE TABLE cultural_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES experience_stories(id),
  connection_type TEXT NOT NULL, -- "nova_amizade", "relacionamento", "networking", "familia"
  connection_description TEXT, -- Como a conexão aconteceu
  still_connected BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CURADORIA E APROVAÇÃO
-- =====================================================
CREATE TABLE curation_process (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES cultural_partners(id),
  curator_id UUID REFERENCES auth.users(id),
  visit_type TEXT CHECK (visit_type IN ('presencial', 'virtual', 'pendente')),
  visit_date TIMESTAMP,
  cultural_alignment_score INTEGER CHECK (cultural_alignment_score BETWEEN 1 AND 10),
  authenticity_score INTEGER CHECK (authenticity_score BETWEEN 1 AND 10),
  community_fit_score INTEGER CHECK (community_fit_score BETWEEN 1 AND 10),
  curator_notes TEXT,
  recommendation TEXT CHECK (recommendation IN ('approve', 'reject', 'needs_improvement')),
  improvement_suggestions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- MÉTRICAS CULTURAIS
-- =====================================================
CREATE TABLE cultural_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES cultural_partners(id),
  metric_date DATE DEFAULT CURRENT_DATE,
  connections_created INTEGER DEFAULT 0,
  stories_shared INTEGER DEFAULT 0,
  cultural_impact_avg DECIMAL(3,2),
  community_engagement_score DECIMAL(3,2),
  authentic_experiences_count INTEGER DEFAULT 0,
  repeat_visitors INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX idx_cultural_partners_status ON cultural_partners(status);
CREATE INDEX idx_cultural_partners_category ON cultural_partners(cultural_category);
CREATE INDEX idx_cultural_experiences_active ON cultural_experiences(active);
CREATE INDEX idx_cultural_experiences_featured ON cultural_experiences(featured);
CREATE INDEX idx_cultural_experiences_tags ON cultural_experiences USING GIN(cultural_tags);
CREATE INDEX idx_experience_stories_public ON experience_stories(is_public);
CREATE INDEX idx_experience_stories_featured ON experience_stories(featured);

-- =====================================================
-- RLS (ROW LEVEL SECURITY)
-- =====================================================
ALTER TABLE cultural_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE curation_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas para parceiros culturais
CREATE POLICY "Parceiros podem ver seus próprios dados" ON cultural_partners
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM user_profiles WHERE id = cultural_partners.id
  ));

CREATE POLICY "Parceiros aprovados são públicos" ON cultural_partners
  FOR SELECT USING (status = 'approved');

-- Políticas para experiências culturais
CREATE POLICY "Experiências ativas são públicas" ON cultural_experiences
  FOR SELECT USING (active = true AND EXISTS (
    SELECT 1 FROM cultural_partners 
    WHERE id = cultural_experiences.partner_id AND status = 'approved'
  ));

-- Políticas para histórias
CREATE POLICY "Histórias públicas são visíveis" ON experience_stories
  FOR SELECT USING (is_public = true);

CREATE POLICY "Usuários podem ver suas histórias" ON experience_stories
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para calcular impacto cultural
CREATE OR REPLACE FUNCTION calculate_cultural_impact(partner_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  impact_score DECIMAL(3,2);
BEGIN
  SELECT 
    COALESCE(AVG(
      (cultural_impact_rating + ambiance_rating + connection_rating) / 3.0
    ), 0)
  INTO impact_score
  FROM experience_stories es
  JOIN cultural_experiences ce ON es.experience_id = ce.id
  WHERE ce.partner_id = partner_uuid
    AND es.created_at >= NOW() - INTERVAL '30 days';
  
  RETURN impact_score;
END;
$$ LANGUAGE plpgsql;

-- Função para contar conexões criadas
CREATE OR REPLACE FUNCTION count_connections_created(partner_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  connection_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO connection_count
  FROM cultural_connections cc
  JOIN experience_stories es ON cc.story_id = es.id
  JOIN cultural_experiences ce ON es.experience_id = ce.id
  WHERE ce.partner_id = partner_uuid
    AND cc.created_at >= NOW() - INTERVAL '30 days';
  
  RETURN connection_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cultural_partners_updated_at
  BEFORE UPDATE ON cultural_partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cultural_experiences_updated_at
  BEFORE UPDATE ON cultural_experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS DE EXEMPLO
-- =====================================================

-- Categorias culturais padrão
INSERT INTO cultural_partners (
  business_name, founder_story, cultural_mission, contact_name, email,
  business_type, cultural_category, address, ambiance_description, social_values
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
  ARRAY['sustentabilidade', 'arte_local', 'comercio_justo']
);

-- Comentários finais
-- Esta estrutura transforma o DUO PASS de um marketplace comum
-- em uma verdadeira plataforma cultural que:
-- 1. Valoriza histórias e propósitos
-- 2. Mede impacto cultural, não apenas vendas
-- 3. Cria conexões humanas autênticas
-- 4. Apoia negócios com alma e missão
-- 5. Constrói comunidade baseada em valores compartilhados