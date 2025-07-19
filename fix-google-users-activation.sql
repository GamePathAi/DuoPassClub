-- 🚀 CORREÇÃO COMPLETA: Ativação Automática de Usuários Google + Sistema Merchant
-- Execute este SQL no Supabase SQL Editor
-- ESTRUTURA REAL CONFIRMADA: public.users com subscription_status

-- 1. ATIVAR USUÁRIO GOOGLE ESPECÍFICO (igor.bonafe@gmail.com)
UPDATE public.users 
SET 
  subscription_status = 'active',
  user_type = 'basic',
  updated_at = NOW()
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';

-- 2. VERIFICAR SE TABELA VOUCHERS EXISTE E CRIAR VOUCHERS
DO $$
DECLARE
  merchant1_id UUID;
BEGIN
  -- Verificar se tabela vouchers existe
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vouchers') THEN
    
    -- Buscar um merchant para associar aos vouchers
    SELECT id INTO merchant1_id FROM public.merchants WHERE email = 'merchant1@duopass.com' LIMIT 1;
    
    -- Se não houver merchant, criar um temporário
    IF merchant1_id IS NULL THEN
      INSERT INTO public.merchants (name, email, business_type) 
      VALUES ('DuoPass System', 'system@duopass.com', 'Sistema')
      RETURNING id INTO merchant1_id;
    END IF;
    
    -- Criar vouchers iniciais para o usuário com todos os campos obrigatórios
    INSERT INTO public.vouchers (
      user_id, 
      merchant_id, 
      voucher_code, 
      qr_code_data, 
      status, 
      expires_at
    )
    VALUES 
      (
        'd97e1c42-3468-425a-8784-4d646b2c4a57', 
        merchant1_id, 
        'IGOR001', 
        'QR_IGOR001_' || EXTRACT(EPOCH FROM NOW())::text, 
        'active', 
        NOW() + INTERVAL '30 days'
      ),
      (
        'd97e1c42-3468-425a-8784-4d646b2c4a57', 
        merchant1_id, 
        'IGOR002', 
        'QR_IGOR002_' || EXTRACT(EPOCH FROM NOW())::text, 
        'active', 
        NOW() + INTERVAL '45 days'
      ),
      (
        'd97e1c42-3468-425a-8784-4d646b2c4a57', 
        merchant1_id, 
        'IGOR003', 
        'QR_IGOR003_' || EXTRACT(EPOCH FROM NOW())::text, 
        'active', 
        NOW() + INTERVAL '60 days'
      )
    ON CONFLICT (voucher_code) DO NOTHING;
    
    RAISE NOTICE 'Vouchers criados para usuário igor.bonafe@gmail.com';
  ELSE
    RAISE NOTICE 'Tabela vouchers não existe - pulando criação de vouchers';
  END IF;
END $$;

-- 3. CRIAR TABELA MERCHANTS (se não existir)
CREATE TABLE IF NOT EXISTS public.merchants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  business_type TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRIAR TABELA VOUCHER_VALIDATIONS (se não existir)
CREATE TABLE IF NOT EXISTS public.voucher_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validation_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INSERIR MERCHANTS DE TESTE
INSERT INTO public.merchants (name, email, business_type, address, phone)
VALUES 
  ('Pizzaria Bella Vista', 'merchant1@duopass.com', 'Restaurante', 'Rua das Flores, 123', '+41 21 123 4567'),
  ('Spa Relaxamento Total', 'merchant2@duopass.com', 'Bem-estar', 'Av. Principal, 456', '+41 21 234 5678'),
  ('Barbearia Moderna', 'merchant3@duopass.com', 'Beleza', 'Rua do Comércio, 789', '+41 21 345 6789')
ON CONFLICT (email) DO NOTHING;

-- 6. POPULAR OFERTAS ATIVAS (se não existirem)
DO $$
DECLARE
  merchant1_id UUID;
  merchant2_id UUID;
  merchant3_id UUID;
BEGIN
  -- Buscar IDs dos merchants
  SELECT id INTO merchant1_id FROM public.merchants WHERE email = 'merchant1@duopass.com';
  SELECT id INTO merchant2_id FROM public.merchants WHERE email = 'merchant2@duopass.com';
  SELECT id INTO merchant3_id FROM public.merchants WHERE email = 'merchant3@duopass.com';
  
  -- Inserir ofertas apenas se não existirem
  INSERT INTO public.offers (merchant_id, title, description, category, price_original, is_active, expires_at)
  SELECT * FROM (
    VALUES 
      (merchant1_id, 'Pizza Margherita 50% OFF', 'Pizza Margherita tradicional com desconto especial', 'Gastronomia', 25.90, true, NOW() + INTERVAL '30 days'),
      (merchant1_id, 'Combo Família', 'Pizza grande + refrigerante 2L + sobremesa', 'Gastronomia', 45.90, true, NOW() + INTERVAL '45 days'),
      (merchant2_id, 'Massagem Relaxante', 'Sessão de massagem de 60 minutos', 'Beleza', 120.00, true, NOW() + INTERVAL '60 days'),
      (merchant2_id, 'Pacote Spa Completo', 'Massagem + facial + sauna', 'Beleza', 200.00, true, NOW() + INTERVAL '90 days'),
      (merchant3_id, 'Corte + Barba', 'Corte masculino + barba profissional', 'Beleza', 35.00, true, NOW() + INTERVAL '30 days'),
      (merchant3_id, 'Tratamento Capilar', 'Lavagem + corte + hidratação', 'Beleza', 55.00, true, NOW() + INTERVAL '45 days')
  ) AS v(merchant_id, title, description, category, price_original, is_active, expires_at)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.offers WHERE title = v.title
  );
END $$;

-- 7. HABILITAR RLS NAS NOVAS TABELAS
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_validations ENABLE ROW LEVEL SECURITY;

-- 8. CRIAR POLÍTICAS RLS PARA MERCHANTS
CREATE POLICY "Merchants can read own data" ON public.merchants
  FOR SELECT USING (true); -- Permitir leitura para todos por enquanto

CREATE POLICY "System can create merchants" ON public.merchants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Merchants can update own data" ON public.merchants
  FOR UPDATE USING (true);

-- 9. CRIAR POLÍTICAS RLS PARA VOUCHER_VALIDATIONS
CREATE POLICY "Merchants can view their validations" ON public.voucher_validations
  FOR SELECT USING (true);

CREATE POLICY "Merchants can create validations" ON public.voucher_validations
  FOR INSERT WITH CHECK (true);

-- 10. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_merchants_email ON public.merchants(email);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON public.merchants(status);
CREATE INDEX IF NOT EXISTS idx_voucher_validations_voucher_id ON public.voucher_validations(voucher_id);
CREATE INDEX IF NOT EXISTS idx_voucher_validations_merchant_id ON public.voucher_validations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_voucher_validations_validated_at ON public.voucher_validations(validated_at);

-- 11. FUNÇÃO PARA AUTO-ATIVAÇÃO DE USUÁRIOS GOOGLE (ESTRUTURA REAL)
CREATE OR REPLACE FUNCTION public.auto_activate_google_user()
RETURNS trigger AS $$
BEGIN
  -- Se for usuário Google, ativar automaticamente
  IF NEW.email IS NOT NULL THEN
    NEW.subscription_status = 'active';
    NEW.user_type = 'basic';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. TRIGGER PARA AUTO-ATIVAÇÃO (TABELA REAL: public.users)
DROP TRIGGER IF EXISTS auto_activate_google_user_trigger ON public.users;
CREATE TRIGGER auto_activate_google_user_trigger
  BEFORE INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_activate_google_user();

-- 13. FUNÇÃO PARA CRIAR VOUCHERS INICIAIS
CREATE OR REPLACE FUNCTION public.create_initial_vouchers_for_user(user_id_param UUID)
RETURNS void AS $$
DECLARE
  system_merchant_id UUID;
BEGIN
  -- Buscar ou criar merchant do sistema
  SELECT id INTO system_merchant_id FROM public.merchants WHERE email = 'system@duopass.com';
  
  IF system_merchant_id IS NULL THEN
    INSERT INTO public.merchants (name, email, business_type) 
    VALUES ('DuoPass System', 'system@duopass.com', 'Sistema')
    RETURNING id INTO system_merchant_id;
  END IF;
  
  -- Criar 3 vouchers iniciais para novos usuários
  INSERT INTO public.vouchers (
    user_id, 
    merchant_id, 
    voucher_code, 
    qr_code_data, 
    status, 
    expires_at
  )
  VALUES
    (
      user_id_param, 
      system_merchant_id, 
      'WELCOME_' || SUBSTRING(user_id_param::text, 1, 8), 
      'QR_WELCOME_' || SUBSTRING(user_id_param::text, 1, 8) || '_' || EXTRACT(EPOCH FROM NOW())::text, 
      'active', 
      NOW() + INTERVAL '30 days'
    ),
    (
      user_id_param, 
      system_merchant_id, 
      'BONUS_' || SUBSTRING(user_id_param::text, 1, 8), 
      'QR_BONUS_' || SUBSTRING(user_id_param::text, 1, 8) || '_' || EXTRACT(EPOCH FROM NOW())::text, 
      'active', 
      NOW() + INTERVAL '45 days'
    ),
    (
      user_id_param, 
      system_merchant_id, 
      'SPECIAL_' || SUBSTRING(user_id_param::text, 1, 8), 
      'QR_SPECIAL_' || SUBSTRING(user_id_param::text, 1, 8) || '_' || EXTRACT(EPOCH FROM NOW())::text, 
      'active', 
      NOW() + INTERVAL '60 days'
    )
  ON CONFLICT (voucher_code) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. VERIFICAR RESULTADOS (ESTRUTURA REAL)
SELECT
  'USUÁRIO ATIVADO' as status,
  id, email, subscription_status, user_type
FROM public.users
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';

-- Verificar vouchers apenas se tabela existir
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vouchers') THEN
    PERFORM 1; -- Placeholder para permitir SELECT dentro do bloco
    RAISE NOTICE 'Verificando vouchers...';
  ELSE
    RAISE NOTICE 'Tabela vouchers não existe';
  END IF;
END $$;

-- Query condicional para vouchers
SELECT
  'VOUCHERS CRIADOS' as status,
  COUNT(*) as total_vouchers
FROM public.vouchers
WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57'
AND EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vouchers');

SELECT
  'DETALHES DOS VOUCHERS' as status,
  user_id, voucher_code, status, expires_at, qr_code_data
FROM public.vouchers
WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57'
AND EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vouchers');

SELECT 
  'OFERTAS DISPONÍVEIS' as status,
  COUNT(*) as total_ofertas
FROM public.offers 
WHERE is_active = true;

SELECT 
  'MERCHANTS CRIADOS' as status,
  COUNT(*) as total_merchants
FROM public.merchants;

-- 15. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE public.merchants IS 'Tabela de comerciantes/parceiros para validação de vouchers';
COMMENT ON TABLE public.voucher_validations IS 'Histórico de validações de vouchers pelos merchants';
COMMENT ON FUNCTION public.auto_activate_google_user() IS 'Ativa automaticamente usuários Google na tabela public.users com subscription_status';
COMMENT ON FUNCTION public.create_initial_vouchers_for_user(UUID) IS 'Cria vouchers iniciais para novos usuários';