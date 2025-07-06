-- Tabela para armazenar mensagens de contato
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  business VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('gastronomy', 'art', 'wellbeing', 'other')),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_type ON contact_messages(type);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- Comentários para documentação
COMMENT ON TABLE contact_messages IS 'Armazena mensagens de contato enviadas através do modal "Falar com Nossa Equipe"';
COMMENT ON COLUMN contact_messages.name IS 'Nome completo da pessoa que entrou em contato';
COMMENT ON COLUMN contact_messages.email IS 'Email de contato';
COMMENT ON COLUMN contact_messages.business IS 'Nome do negócio/estabelecimento';
COMMENT ON COLUMN contact_messages.type IS 'Tipo de negócio: gastronomy, art, wellbeing, other';
COMMENT ON COLUMN contact_messages.description IS 'Descrição breve do negócio e interesse';
COMMENT ON COLUMN contact_messages.status IS 'Status do contato: new, contacted, closed';
COMMENT ON COLUMN contact_messages.admin_notes IS 'Notas internas da equipe administrativa';

-- RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (formulário de contato)
CREATE POLICY "Allow public insert on contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Política para admins visualizarem todas as mensagens
CREATE POLICY "Allow admin read on contact_messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Política para admins atualizarem mensagens
CREATE POLICY "Allow admin update on contact_messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar automaticamente updated_at
CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON contact_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de exemplo (opcional)
-- INSERT INTO contact_messages (name, email, business, type, description) VALUES
-- ('João Silva', 'joao@exemplo.com', 'Café Cultural', 'gastronomy', 'Interessado em ser parceiro do DuoPass. Temos um café com foco em cultura local.'),
-- ('Maria Santos', 'maria@galeria.com', 'Galeria Arte Viva', 'art', 'Gostaríamos de participar da plataforma com nossa galeria de arte contemporânea.');

-- Verificar se a tabela foi criada corretamente
-- SELECT * FROM contact_messages LIMIT 5;