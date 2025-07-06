-- DuoPass Database Seeds
-- Execute este script após o schema principal para popular dados iniciais

-- Inserir categorias adicionais se necessário
INSERT INTO public.categories (name, icon, slug) VALUES
  ('Farmácia', '💊', 'farmacia'),
  ('Petshop', '🐕', 'petshop'),
  ('Livraria', '📖', 'livraria'),
  ('Flores & Plantas', '🌸', 'flores-plantas'),
  ('Automóveis', '🚗', 'automoveis')
ON CONFLICT (slug) DO NOTHING;

-- Função para criar usuários de teste
CREATE OR REPLACE FUNCTION create_test_users()
RETURNS void AS $$
DECLARE
  customer_id UUID;
  merchant_id UUID;
  merchant2_id UUID;
BEGIN
  -- Criar usuário cliente de teste
  INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at,
    raw_user_meta_data
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'cliente@duopass.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Cliente Teste", "user_type": "customer"}'
  ) RETURNING id INTO customer_id;

  -- Criar perfil do cliente
  INSERT INTO public.users (id, email, full_name, user_type, subscription_status)
  VALUES (customer_id, 'cliente@duopass.com', 'Cliente Teste', 'customer', 'active');

  -- Criar primeiro comerciante de teste
  INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at,
    raw_user_meta_data
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'pizzaria@duopass.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Pizzaria Bella Vista", "user_type": "merchant"}'
  ) RETURNING id INTO merchant_id;

  -- Criar perfil do comerciante
  INSERT INTO public.users (id, email, full_name, user_type, business_name, contact_info)
  VALUES (
    merchant_id, 
    'pizzaria@duopass.com', 
    'Mario Silva', 
    'merchant', 
    'Pizzaria Bella Vista',
    'Rua das Flores, 123 - Centro | (11) 99999-9999'
  );

  -- Criar segundo comerciante de teste
  INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at,
    raw_user_meta_data
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'salao@duopass.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Salão Beleza Pura", "user_type": "merchant"}'
  ) RETURNING id INTO merchant2_id;

  -- Criar perfil do segundo comerciante
  INSERT INTO public.users (id, email, full_name, user_type, business_name, contact_info)
  VALUES (
    merchant2_id, 
    'salao@duopass.com', 
    'Ana Costa', 
    'merchant', 
    'Salão Beleza Pura',
    'Av. Principal, 456 - Jardins | (11) 88888-8888'
  );

  -- Criar ofertas de teste para a pizzaria
  INSERT INTO public.offers (merchant_id, title, description, original_value, category, location, expires_at, terms_conditions, image_url)
  VALUES 
    (
      merchant_id,
      'Pizza Margherita 50% OFF',
      'Deliciosa pizza margherita tradicional com molho de tomate, mussarela e manjericão fresco. Massa artesanal preparada diariamente.',
      32.90,
      'Restaurantes',
      'Centro, São Paulo - SP',
      NOW() + INTERVAL '30 days',
      'Válido apenas para consumo no local. Não cumulativo com outras promoções. Válido de segunda a quinta-feira.',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
    ),
    (
      merchant_id,
      'Combo Família - 2 Pizzas Grandes',
      'Duas pizzas grandes à sua escolha + 2 refrigerantes de 2L. Perfeito para compartilhar em família!',
      89.90,
      'Restaurantes',
      'Centro, São Paulo - SP',
      NOW() + INTERVAL '45 days',
      'Válido para delivery e balcão. Escolha entre as pizzas do cardápio tradicional. Refrigerantes sujeitos à disponibilidade.',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
    );

  -- Criar ofertas de teste para o salão
  INSERT INTO public.offers (merchant_id, title, description, original_value, category, location, expires_at, terms_conditions, image_url)
  VALUES 
    (
      merchant2_id,
      'Corte + Escova + Hidratação',
      'Pacote completo de beleza: corte personalizado, escova modeladora e hidratação profunda. Inclui produtos premium.',
      120.00,
      'Beleza & Bem-estar',
      'Jardins, São Paulo - SP',
      NOW() + INTERVAL '60 days',
      'Agendamento obrigatório. Válido de terça a sábado. Produtos sujeitos à disponibilidade.',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'
    ),
    (
      merchant2_id,
      'Manicure + Pedicure Completa',
      'Serviço completo de manicure e pedicure com esmaltação, cutilagem e hidratação. Ambiente relaxante e profissionais qualificados.',
      65.00,
      'Beleza & Bem-estar',
      'Jardins, São Paulo - SP',
      NOW() + INTERVAL '30 days',
      'Agendamento com 24h de antecedência. Esmaltes especiais têm custo adicional.',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
    );

  -- Criar alguns cupons ativados de exemplo
  INSERT INTO public.activated_coupons (user_id, offer_id, status)
  SELECT 
    customer_id,
    o.id,
    'active'
  FROM public.offers o
  WHERE o.merchant_id = merchant_id
  LIMIT 1;

  -- Criar voucher de exemplo
  INSERT INTO public.vouchers (
    user_id, 
    merchant_id, 
    voucher_code, 
    qr_code_data, 
    expires_at
  ) VALUES (
    customer_id,
    merchant_id,
    'DUOPASS-' || UPPER(substring(gen_random_uuid()::text from 1 for 8)),
    '{"voucherId": "' || gen_random_uuid() || '", "userId": "' || customer_id || '", "merchantId": "' || merchant_id || '", "code": "DUOPASS-TEST"}',
    NOW() + INTERVAL '7 days'
  );

END;
$$ LANGUAGE plpgsql;

-- Função para limpar dados de teste
CREATE OR REPLACE FUNCTION clean_test_data()
RETURNS void AS $$
BEGIN
  -- Deletar dados de teste
  DELETE FROM public.voucher_usage WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@duopass.com'
  );
  
  DELETE FROM public.vouchers WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@duopass.com'
  );
  
  DELETE FROM public.activated_coupons WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@duopass.com'
  );
  
  DELETE FROM public.offers WHERE merchant_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@duopass.com'
  );
  
  DELETE FROM public.users WHERE email LIKE '%@duopass.com';
  
  DELETE FROM auth.users WHERE email LIKE '%@duopass.com';
END;
$$ LANGUAGE plpgsql;

-- Função para estatísticas do sistema
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_customers BIGINT,
  total_merchants BIGINT,
  total_offers BIGINT,
  active_offers BIGINT,
  total_vouchers BIGINT,
  used_vouchers BIGINT,
  total_categories BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.users WHERE user_type = 'customer') as total_customers,
    (SELECT COUNT(*) FROM public.users WHERE user_type = 'merchant') as total_merchants,
    (SELECT COUNT(*) FROM public.offers) as total_offers,
    (SELECT COUNT(*) FROM public.offers WHERE is_active = true AND expires_at > NOW()) as active_offers,
    (SELECT COUNT(*) FROM public.vouchers) as total_vouchers,
    (SELECT COUNT(*) FROM public.vouchers WHERE status = 'used') as used_vouchers,
    (SELECT COUNT(*) FROM public.categories) as total_categories;
END;
$$ LANGUAGE plpgsql;

-- Função para relatório de uso mensal
CREATE OR REPLACE FUNCTION get_monthly_usage_report(target_month DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  month_year TEXT,
  vouchers_generated BIGINT,
  vouchers_used BIGINT,
  unique_customers BIGINT,
  active_merchants BIGINT,
  usage_rate NUMERIC
) AS $$
DECLARE
  start_date DATE;
  end_date DATE;
BEGIN
  start_date := DATE_TRUNC('month', target_month);
  end_date := start_date + INTERVAL '1 month' - INTERVAL '1 day';
  
  RETURN QUERY
  SELECT 
    TO_CHAR(start_date, 'MM/YYYY') as month_year,
    (SELECT COUNT(*) FROM public.vouchers WHERE created_at::date BETWEEN start_date AND end_date) as vouchers_generated,
    (SELECT COUNT(*) FROM public.vouchers WHERE used_at::date BETWEEN start_date AND end_date) as vouchers_used,
    (SELECT COUNT(DISTINCT user_id) FROM public.vouchers WHERE created_at::date BETWEEN start_date AND end_date) as unique_customers,
    (SELECT COUNT(DISTINCT merchant_id) FROM public.vouchers WHERE created_at::date BETWEEN start_date AND end_date) as active_merchants,
    CASE 
      WHEN (SELECT COUNT(*) FROM public.vouchers WHERE created_at::date BETWEEN start_date AND end_date) > 0
      THEN ROUND(
        (SELECT COUNT(*) FROM public.vouchers WHERE used_at::date BETWEEN start_date AND end_date)::NUMERIC * 100.0 /
        (SELECT COUNT(*) FROM public.vouchers WHERE created_at::date BETWEEN start_date AND end_date)::NUMERIC,
        2
      )
      ELSE 0
    END as usage_rate;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON FUNCTION create_test_users() IS 'Cria usuários de teste para desenvolvimento';
COMMENT ON FUNCTION clean_test_data() IS 'Remove todos os dados de teste do sistema';
COMMENT ON FUNCTION get_system_stats() IS 'Retorna estatísticas gerais do sistema';
COMMENT ON FUNCTION get_monthly_usage_report(DATE) IS 'Gera relatório de uso mensal do sistema';

-- Executar criação de dados de teste (descomente se necessário)
-- SELECT create_test_users();

-- Exemplo de uso das funções:
-- SELECT * FROM get_system_stats();
-- SELECT * FROM get_monthly_usage_report();
-- SELECT * FROM get_monthly_usage_report('2024-01-01'::DATE);