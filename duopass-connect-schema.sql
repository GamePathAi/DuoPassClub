-- DUO PASS Connect - Schema Simples e Exclusivo
-- Sistema focado em conectar membros pagos através de afinidades culturais

-- Tabela de afinidades culturais (questionário inicial)
CREATE TABLE IF NOT EXISTS cultural_affinities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Respostas do questionário (10 perguntas simples)
  preferred_time VARCHAR(20) CHECK (preferred_time IN ('morning', 'afternoon', 'evening', 'weekend')),
  cultural_frequency VARCHAR(20) CHECK (cultural_frequency IN ('weekly', 'monthly', 'occasionally', 'rarely')),
  budget_range VARCHAR(20) CHECK (budget_range IN ('low', 'medium', 'high', 'no_limit')),
  group_size_preference VARCHAR(20) CHECK (group_size_preference IN ('solo', 'couple', 'small_group', 'large_group')),
  discovery_style VARCHAR(20) CHECK (discovery_style IN ('planned', 'spontaneous', 'mixed')),
  
  -- Interesses principais (máximo 3)
  primary_interests TEXT[] DEFAULT '{}',
  
  -- Localização preferida
  preferred_location VARCHAR(100),
  
  -- Disponibilidade
  available_days TEXT[] DEFAULT '{}', -- ['monday', 'tuesday', etc.]
  
  -- Perfil social
  social_style VARCHAR(20) CHECK (social_style IN ('introvert', 'extrovert', 'ambivert')),
  experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Tabela de comunidades culturais (5 comunidades fixas)
CREATE TABLE IF NOT EXISTS cultural_communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon_emoji VARCHAR(10) NOT NULL,
  color_theme VARCHAR(20) NOT NULL,
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de membros das comunidades
CREATE TABLE IF NOT EXISTS community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES cultural_communities(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(user_id, community_id)
);

-- Tabela de conexões entre membros (mensagens diretas)
CREATE TABLE IF NOT EXISTS member_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  community_context UUID REFERENCES cultural_communities(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evitar auto-mensagens
  CHECK (sender_id != receiver_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cultural_affinities_user_id ON cultural_affinities(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_member_connections_sender ON member_connections(sender_id);
CREATE INDEX IF NOT EXISTS idx_member_connections_receiver ON member_connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_member_connections_created_at ON member_connections(created_at DESC);

-- Trigger para atualizar contador de membros
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE cultural_communities 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE cultural_communities 
    SET member_count = GREATEST(0, member_count - 1) 
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_member_count
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cultural_affinities_updated_at
  BEFORE UPDATE ON cultural_affinities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir as 5 comunidades fixas
INSERT INTO cultural_communities (name, description, category, icon_emoji, color_theme) VALUES
('Arte & Criatividade', 'Explore galerias, exposições e ateliês. Conecte-se com outros amantes da arte contemporânea e clássica.', 'arte', '🎨', 'purple'),
('Gastronomia & Vinhos', 'Descubra novos sabores, restaurantes exclusivos e experiências culinárias únicas na cidade.', 'gastronomia', '🍷', 'red'),
('Música & Shows', 'De concertos clássicos a shows indie. Encontre companhia para viver a música ao vivo.', 'musica', '🎵', 'blue'),
('Bem-estar & Mindfulness', 'Yoga, meditação, spas e retiros. Cuide do corpo e mente com pessoas que compartilham os mesmos valores.', 'bem-estar', '🧘', 'green'),
('Cultura & História', 'Museus, teatros, palestras e eventos culturais. Para quem ama aprender e se inspirar.', 'cultura', '🏛️', 'amber')
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) Policies
ALTER TABLE cultural_affinities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_connections ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança

-- cultural_affinities: usuários só podem ver/editar seus próprios dados
CREATE POLICY "Users can view own affinities" ON cultural_affinities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affinities" ON cultural_affinities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affinities" ON cultural_affinities
  FOR UPDATE USING (auth.uid() = user_id);

-- community_members: usuários podem ver membros das comunidades que participam
CREATE POLICY "Users can view community members" ON community_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM community_members cm2 
      WHERE cm2.community_id = community_members.community_id
    )
  );

CREATE POLICY "Users can join communities" ON community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities" ON community_members
  FOR DELETE USING (auth.uid() = user_id);

-- member_connections: usuários podem ver mensagens enviadas/recebidas
CREATE POLICY "Users can view own connections" ON member_connections
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send connections" ON member_connections
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- cultural_communities é pública para leitura
ALTER TABLE cultural_communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities are publicly readable" ON cultural_communities
  FOR SELECT USING (true);

-- Comentários para documentação
COMMENT ON TABLE cultural_affinities IS 'Armazena as respostas do questionário de afinidades culturais de cada usuário';
COMMENT ON TABLE cultural_communities IS 'As 5 comunidades fixas do DUO PASS Connect';
COMMENT ON TABLE community_members IS 'Relaciona usuários com as comunidades que participam';
COMMENT ON TABLE member_connections IS 'Mensagens diretas entre membros do DUO PASS Connect';