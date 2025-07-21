-- Drop table and policies to ensure a clean slate
DROP TABLE IF EXISTS partner_registrations CASCADE;

-- Tabela COMPLETA para teste de RLS
CREATE TABLE partner_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    address_street text,
    address_city text,
    address_postal_code text,
    address_country text,
    business_type text,
    founder_story text,
    cultural_mission text,
    experience_title text,
    experience_description text,
    experience_normal_price numeric,
    experience_duo_value text,
    status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE partner_registrations ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir inserção e seleção pública
DROP POLICY IF EXISTS "Allow public insert" ON partner_registrations;
CREATE POLICY "Allow public insert" 
ON partner_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select" ON partner_registrations;
CREATE POLICY "Allow public select"
ON partner_registrations
FOR SELECT
TO anon, authenticated
USING (true);