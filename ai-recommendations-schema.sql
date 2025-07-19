-- Tabela para armazenar recomendações de IA do DUO PASS
CREATE TABLE ai_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  context jsonb,
  recommendations jsonb,
  created_at timestamp DEFAULT now()
);

-- Índice para otimizar consultas por usuário
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);

-- Habilitar Row Level Security
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Política: usuários só veem suas próprias recomendações
CREATE POLICY "Users view own recommendations" ON ai_recommendations 
  FOR SELECT USING (auth.uid() = user_id);

-- Política: usuários só podem inserir suas próprias recomendações
CREATE POLICY "Users insert own recommendations" ON ai_recommendations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: usuários só podem atualizar suas próprias recomendações
CREATE POLICY "Users update own recommendations" ON ai_recommendations 
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: usuários só podem deletar suas próprias recomendações
CREATE POLICY "Users delete own recommendations" ON ai_recommendations 
  FOR DELETE USING (auth.uid() = user_id);