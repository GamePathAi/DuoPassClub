-- Criar tabela cultural_partners   
CREATE TABLE cultural_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  business_type text,
  cultural_category text,
  ambiance_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela cultural_experiences 
CREATE TABLE cultural_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  active boolean DEFAULT true,
  partner_id uuid REFERENCES cultural_partners(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS Policies básicas 
ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY; 
ALTER TABLE cultural_partners ENABLE ROW LEVEL SECURITY; 

-- Permitir leitura pública 
CREATE POLICY "Allow public read on cultural_experiences" ON cultural_experiences FOR SELECT TO anon, authenticated USING (true); 
CREATE POLICY "Allow public read on cultural_partners" ON cultural_partners FOR SELECT TO anon, authenticated USING (true);