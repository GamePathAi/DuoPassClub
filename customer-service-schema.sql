-- CUSTOMER SERVICE AGENT - SCHEMA SUPABASE
-- Tabela para armazenar interações do chat de atendimento

CREATE TABLE customer_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  user_message text NOT NULL,
  ai_response text,
  interaction_type text CHECK (interaction_type IN ('question', 'complaint', 'booking', 'cancellation', 'technical')),
  channel text DEFAULT 'app',
  created_at timestamp DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_customer_interactions_user_id ON customer_interactions(user_id);
CREATE INDEX idx_customer_interactions_type ON customer_interactions(interaction_type);
CREATE INDEX idx_customer_interactions_created_at ON customer_interactions(created_at);

-- Row Level Security
ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own interactions" 
  ON customer_interactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" 
  ON customer_interactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" 
  ON customer_interactions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" 
  ON customer_interactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Comentários
COMMENT ON TABLE customer_interactions IS 'Armazena interações do chat de atendimento ao cliente';
COMMENT ON COLUMN customer_interactions.interaction_type IS 'Tipo de interação: question, complaint, booking, cancellation, technical';
COMMENT ON COLUMN customer_interactions.channel IS 'Canal de origem: app, web, mobile';