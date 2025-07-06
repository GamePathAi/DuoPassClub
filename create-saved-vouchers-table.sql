-- Criar tabela para vouchers salvos
CREATE TABLE IF NOT EXISTS saved_vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voucher_id UUID NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, voucher_id)
);

-- Habilitar RLS
ALTER TABLE saved_vouchers ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios vouchers salvos
CREATE POLICY "Users can view their own saved vouchers" ON saved_vouchers
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem seus próprios vouchers salvos
CREATE POLICY "Users can insert their own saved vouchers" ON saved_vouchers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários removerem seus próprios vouchers salvos
CREATE POLICY "Users can delete their own saved vouchers" ON saved_vouchers
  FOR DELETE USING (auth.uid() = user_id);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_saved_vouchers_user_id ON saved_vouchers(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_vouchers_voucher_id ON saved_vouchers(voucher_id);
CREATE INDEX IF NOT EXISTS idx_saved_vouchers_created_at ON saved_vouchers(created_at);

-- Adicionar campos necessários na tabela vouchers se não existirem
ALTER TABLE vouchers 
ADD COLUMN IF NOT EXISTS redeem_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS redeemed_at TIMESTAMP WITH TIME ZONE;

-- Criar índice para o código de resgate
CREATE INDEX IF NOT EXISTS idx_vouchers_redeem_code ON vouchers(redeem_code) WHERE redeem_code IS NOT NULL;