-- DuoPass Database Schema for Supabase
-- Execute this SQL in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('client', 'merchant');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'inactive', 'trial');
CREATE TYPE voucher_status_enum AS ENUM ('active', 'used', 'expired');
CREATE TYPE coupon_status_enum AS ENUM ('active', 'used', 'expired');

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'merchant')),
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    email_verified BOOLEAN DEFAULT false,
    email_verification_sent_at TIMESTAMPTZ,
    city VARCHAR(100),
    canton VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO public.categories (name, slug, icon) VALUES
('Gastronomia', 'gastronomy', 'utensils'),
('Beleza', 'beauty', 'sparkles'),
('Lazer', 'leisure', 'gamepad-2'),
('Fitness', 'fitness', 'dumbbell'),
('Compras', 'shopping', 'shopping-bag'),
('Serviços', 'services', 'wrench')
ON CONFLICT (slug) DO NOTHING;

-- Tabela de ofertas
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_id UUID REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    canton VARCHAR(10),
    price_original DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de cupons ativados
CREATE TABLE IF NOT EXISTS public.activated_coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    offer_id UUID REFERENCES public.offers(id),
    status VARCHAR(20) DEFAULT 'active',
    activated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activated_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Anyone can read active offers" ON public.offers FOR SELECT TO authenticated, anon USING (is_active = true);

-- Vouchers table
CREATE TABLE public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  voucher_code VARCHAR(50) UNIQUE NOT NULL,
  qr_code_data TEXT NOT NULL,
  status voucher_status_enum DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  used_location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voucher usage tracking table
CREATE TABLE public.voucher_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location VARCHAR(255) NOT NULL,
  validated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX idx_offers_merchant_id ON public.offers(merchant_id);
CREATE INDEX idx_offers_is_active ON public.offers(is_active);
CREATE INDEX idx_offers_expires_at ON public.offers(expires_at);
CREATE INDEX idx_offers_category ON public.offers(category);
CREATE INDEX idx_activated_coupons_user_id ON public.activated_coupons(user_id);
CREATE INDEX idx_activated_coupons_offer_id ON public.activated_coupons(offer_id);
CREATE INDEX idx_activated_coupons_status ON public.activated_coupons(status);
CREATE INDEX idx_vouchers_user_id ON public.vouchers(user_id);
CREATE INDEX idx_vouchers_merchant_id ON public.vouchers(merchant_id);
CREATE INDEX idx_vouchers_status ON public.vouchers(status);
CREATE INDEX idx_vouchers_voucher_code ON public.vouchers(voucher_code);
CREATE INDEX idx_voucher_usage_voucher_id ON public.voucher_usage(voucher_id);
CREATE INDEX idx_voucher_usage_merchant_id ON public.voucher_usage(merchant_id);
CREATE INDEX idx_voucher_usage_used_at ON public.voucher_usage(used_at);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activated_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_usage ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas que podem estar conflitando
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view merchant profiles" ON public.users;
DROP POLICY IF EXISTS "Anyone can read active offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can view active offers" ON public.offers;
DROP POLICY IF EXISTS "Users can view their own activated coupons" ON public.activated_coupons;
DROP POLICY IF EXISTS "Users can create their own activated coupons" ON public.activated_coupons;
DROP POLICY IF EXISTS "Users can update their own activated coupons" ON public.activated_coupons;

-- Criar políticas corretas para cadastro
CREATE POLICY "Enable insert for authentication users only"
ON public.users FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Users can read own profile"
ON public.users FOR SELECT
USING (auth.uid() = id OR auth.role() = 'anon');

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Permitir leitura das ofertas para todos
CREATE POLICY "Enable read access for all users"
ON public.offers FOR SELECT
TO authenticated, anon
USING (is_active = true);

CREATE POLICY "Merchants can manage their own offers" ON public.offers
  FOR ALL USING (auth.uid() = merchant_id);

-- Políticas para cupons ativados
CREATE POLICY "Users can read own coupons"
ON public.activated_coupons FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coupons"
ON public.activated_coupons FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activated coupons" ON public.activated_coupons
  FOR UPDATE USING (auth.uid() = user_id);

-- Vouchers policies
CREATE POLICY "Users can view their own vouchers" ON public.vouchers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Merchants can view vouchers for their business" ON public.vouchers
  FOR SELECT USING (auth.uid() = merchant_id);

CREATE POLICY "System can create vouchers" ON public.vouchers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Merchants can update vouchers for their business" ON public.vouchers
  FOR UPDATE USING (auth.uid() = merchant_id);

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
  SELECT 
    COUNT(cc.id)
  INTO connection_count
  FROM cultural_connections cc
  JOIN experience_stories es ON cc.story_id = es.id
  JOIN cultural_experiences ce ON es.experience_id = ce.id
  WHERE ce.partner_id = partner_uuid
    AND cc.created_at >= NOW() - INTERVAL '30 days';
  
  RETURN connection_count;
END;
$$ LANGUAGE plpgsql;

-- Voucher usage policies
CREATE POLICY "Users can view their own voucher usage" ON public.voucher_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Merchants can view usage for their vouchers" ON public.voucher_usage
  FOR SELECT USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create usage records" ON public.voucher_usage
  FOR INSERT WITH CHECK (auth.uid() = merchant_id OR auth.uid() = validated_by);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vouchers_updated_at BEFORE UPDATE ON public.vouchers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, icon, slug) VALUES
  ('Restaurantes', '🍽️', 'restaurantes'),
  ('Beleza & Bem-estar', '💄', 'beleza-bem-estar'),
  ('Moda & Acessórios', '👗', 'moda-acessorios'),
  ('Tecnologia', '📱', 'tecnologia'),
  ('Casa & Decoração', '🏠', 'casa-decoracao'),
  ('Esportes & Lazer', '⚽', 'esportes-lazer'),
  ('Saúde', '🏥', 'saude'),
  ('Educação', '📚', 'educacao'),
  ('Viagens', '✈️', 'viagens'),
  ('Serviços', '🔧', 'servicos');

-- Function to automatically expire vouchers
CREATE OR REPLACE FUNCTION expire_old_vouchers()
RETURNS void AS $$
BEGIN
  UPDATE public.vouchers 
  SET status = 'expired'
  WHERE expires_at < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to automatically expire activated coupons
CREATE OR REPLACE FUNCTION expire_old_coupons()
RETURNS void AS $$
BEGIN
  UPDATE public.activated_coupons ac
  SET status = 'expired'
  FROM public.offers o
  WHERE ac.offer_id = o.id 
    AND o.expires_at < NOW() 
    AND ac.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, user_type)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''), 
          COALESCE(new.raw_user_meta_data->>'user_type', 'client'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.categories IS 'Product/service categories for offers';
COMMENT ON TABLE public.offers IS 'Merchant offers and promotions';
COMMENT ON TABLE public.activated_coupons IS 'User activated coupons from offers';
COMMENT ON TABLE public.vouchers IS 'Generated vouchers for merchant partnerships';
COMMENT ON TABLE public.voucher_usage IS 'Tracking of voucher usage and validation';