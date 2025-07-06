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