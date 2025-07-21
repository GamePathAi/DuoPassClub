-- Tabela para armazenar cadastros de parceiros
CREATE TABLE public.partner_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  metadata JSONB, -- Armazena todos os outros campos do formulário
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row-Level Security (RLS)
ALTER TABLE public.partner_registrations ENABLE ROW LEVEL SECURITY;

-- Índices para otimização de consultas
CREATE INDEX idx_partner_registrations_status ON public.partner_registrations(status);
CREATE INDEX idx_partner_registrations_email ON public.partner_registrations(email);

-- Políticas de RLS
-- 1. Permitir que qualquer pessoa (anônima) crie um novo registro de parceiro.
CREATE POLICY "Allow public insert for new partner registrations"
  ON public.partner_registrations FOR INSERT
  WITH CHECK (true);

-- 2. Permitir que administradores (com role 'admin') leiam todos os registros.
CREATE POLICY "Allow admin to read all partner registrations"
  ON public.partner_registrations FOR SELECT
  USING (get_my_claim('user_role') = 'admin');

-- 3. Permitir que usuários autenticados criem registros.
CREATE POLICY "Allow authenticated users to insert partner registrations"
  ON public.partner_registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Permitir que o usuário que criou o registro (se logado) leia seus próprios dados.
CREATE POLICY "Allow user to read their own partner registration"
  ON public.partner_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Permitir que administradores atualizem o status dos registros.
CREATE POLICY "Allow admin to update partner registrations"
  ON public.partner_registrations FOR UPDATE
  USING (get_my_claim('user_role') = 'admin')
  WITH CHECK (get_my_claim('user_role') = 'admin');

-- Função auxiliar para obter claims do JWT (se não existir)
CREATE OR REPLACE FUNCTION get_my_claim(claim TEXT) RETURNS JSONB AS $$
BEGIN
  RETURN (SELECT nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> claim);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;