// Script para popular o banco Supabase com ofertas demo
// Execute: node populate-offers.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rnzvbrlbcnknyhrgubqi.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuenZicmxiY25rbnlocmd1YnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTc0ODksImV4cCI6MjA2NjU5MzQ4OX0.fjMnzy1PCCqkGucrGp-1jkaJtwBuo9qNB1rk6OOw3zk';

console.log('🔧 Configuração Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para popular banco com dados demo
const populateOffersDatabase = async () => {
  try {
    console.log('🚀 Iniciando população do banco de dados...');
    
    // Primeiro, inserir usuários merchants se não existirem
    console.log('📊 Inserindo merchants (usuários)...');
    const { data: merchantsData, error: merchantsError } = await supabase
      .from('users')
      .upsert([
        { 
          id: '11111111-1111-1111-1111-111111111111',
          email: 'pizzaria@bellavista.ch',
          full_name: 'Pizzaria Bella Vista', 
          user_type: 'merchant',
          city: 'Zürich',
          canton: 'ZH',
          subscription_status: 'active'
        },
        { 
          id: '22222222-2222-2222-2222-222222222222',
          email: 'contato@studioglamour.ch',
          full_name: 'Studio Glamour', 
          user_type: 'merchant',
          city: 'Genève',
          canton: 'GE',
          subscription_status: 'active'
        },
        { 
          id: '33333333-3333-3333-3333-333333333333',
          email: 'info@cinemaxplaza.ch',
          full_name: 'CineMax Plaza', 
          user_type: 'merchant',
          city: 'Basel',
          canton: 'BS',
          subscription_status: 'active'
        },
        { 
          id: '44444444-4444-4444-4444-444444444444',
          email: 'contato@powergym.ch',
          full_name: 'PowerGym Elite', 
          user_type: 'merchant',
          city: 'Bern',
          canton: 'BE',
          subscription_status: 'active'
        },
        { 
          id: '55555555-5555-5555-5555-555555555555',
          email: 'vendas@techworld.ch',
          full_name: 'TechWorld', 
          user_type: 'merchant',
          city: 'Lausanne',
          canton: 'VD',
          subscription_status: 'active'
        },
        { 
          id: '66666666-6666-6666-6666-666666666666',
          email: 'servicos@cleanpro.ch',
          full_name: 'CleanPro Services', 
          user_type: 'merchant',
          city: 'Winterthur',
          canton: 'ZH',
          subscription_status: 'active'
        },
        { 
          id: '77777777-7777-7777-7777-777777777777',
          email: 'cafe@premium.ch',
          full_name: 'Café Premium', 
          user_type: 'merchant',
          city: 'Lucerne',
          canton: 'LU',
          subscription_status: 'active'
        },
        { 
          id: '88888888-8888-8888-8888-888888888888',
          email: 'aulas@musicacademy.ch',
          full_name: 'Music Academy', 
          user_type: 'merchant',
          city: 'St. Gallen',
          canton: 'SG',
          subscription_status: 'active'
        }
      ], {
        onConflict: 'id'
      })
      .select();
    
    if (merchantsError) {
      console.error('❌ Erro ao inserir merchants:', merchantsError);
      throw merchantsError;
    }
    
    console.log('✅ Merchants inseridos:', merchantsData?.length);
    
    // Depois, inserir ofertas
    console.log('🎯 Inserindo ofertas...');
    const { data: offersData, error: offersError } = await supabase
      .from('offers')
      .upsert([
        {
          id: '11111111-1111-1111-1111-111111111111',
          merchant_id: '11111111-1111-1111-1111-111111111111',
          title: '🍕 Pizza Margherita 50% OFF',
          description: 'Deliciosa pizza margherita tradicional com molho de tomate, mussarela e manjericão fresco. Massa artesanal preparada diariamente.',
          original_value: 45.90,
          category: 'Gastronomia',
          city: 'Zürich',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
          is_active: true
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          merchant_id: '22222222-2222-2222-2222-222222222222',
          title: '💄 Maquiagem Completa - 50% OFF',
          description: 'Transformação completa com maquiagem profissional para qualquer ocasião. Inclui limpeza de pele, base, contorno, olhos e batom.',
          original_value: 120.00,
          category: 'Beleza',
          city: 'Genève',
          expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 dias
          is_active: true
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          merchant_id: '33333333-3333-3333-3333-333333333333',
          title: '🎬 Cinema: 2 Ingressos por CHF 38',
          description: 'Dois ingressos para qualquer sessão de cinema, incluindo filmes em cartaz e lançamentos. Pipoca grátis incluída!',
          original_value: 38.00,
          category: 'Lazer',
          city: 'Basel',
          expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 dias
          is_active: true
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          merchant_id: '44444444-4444-4444-4444-444444444444',
          title: '🏋️ Academia: 3 Meses por CHF 180',
          description: 'Acesso completo à academia por 3 meses, incluindo musculação, aulas coletivas e acompanhamento nutricional personalizado.',
          original_value: 180.00,
          category: 'Fitness',
          city: 'Bern',
          expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 dias
          is_active: true
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          merchant_id: '55555555-5555-5555-5555-555555555555',
          title: '📱 iPhone 15: 15% Cashback',
          description: 'iPhone 15 com 15% de cashback. Todas as cores disponíveis, 128GB de armazenamento. Garantia oficial Apple.',
          original_value: 1299.00,
          category: 'Tecnologia',
          city: 'Lausanne',
          expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias
          is_active: true
        },
        {
          id: '66666666-6666-6666-6666-666666666666',
          merchant_id: '66666666-6666-6666-6666-666666666666',
          title: '🧹 Limpeza Residencial Completa',
          description: 'Serviço completo de limpeza residencial, incluindo todos os cômodos, janelas e áreas externas. Produtos ecológicos.',
          original_value: 150.00,
          category: 'Serviços',
          city: 'Winterthur',
          expires_at: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 dias
          is_active: true
        },
        {
          id: '77777777-7777-7777-7777-777777777777',
          merchant_id: '77777777-7777-7777-7777-777777777777',
          title: '☕ Café Premium: Compre 2, Leve 3',
          description: 'Promoção especial de café premium importado. Compre 2 pacotes de 500g e leve 3. Grãos selecionados.',
          original_value: 89.90,
          category: 'Gastronomia',
          city: 'Lucerne',
          expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 dias
          is_active: true
        },
        {
          id: '88888888-8888-8888-8888-888888888888',
          merchant_id: '88888888-8888-8888-8888-888888888888',
          title: '🎵 Aulas de Música: 4 por CHF 200',
          description: 'Pacote de 4 aulas individuais de música (violão, piano ou canto). Professor experiente e método personalizado.',
          original_value: 200.00,
          category: 'Educação',
          city: 'St. Gallen',
          expires_at: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(), // 50 dias
          is_active: true
        }
      ], {
        onConflict: 'id'
      })
      .select();
    
    if (offersError) {
      console.error('❌ Erro ao inserir ofertas:', offersError);
      throw offersError;
    }
    
    console.log('✅ Ofertas inseridas:', offersData?.length);
    
    // Verificar dados inseridos
    console.log('🔍 Verificando dados inseridos...');
    const { data: verifyOffers, error: verifyError } = await supabase
      .from('offers')
      .select('id, title, category, is_active')
      .eq('is_active', true);
    
    if (verifyError) {
      console.error('❌ Erro ao verificar ofertas:', verifyError);
    } else {
      console.log('📊 Total de ofertas ativas no banco:', verifyOffers?.length);
      console.log('📋 Ofertas cadastradas:');
      verifyOffers?.forEach((offer, index) => {
        console.log(`   ${index + 1}. ${offer.title} (${offer.category})`);
      });
    }
    
    console.log('\n🎉 População do banco concluída com sucesso!');
    console.log('✅ Agora os usuários Google devem ver ofertas disponíveis');
    console.log('🔄 Reinicie o servidor (npm run dev) para ver as mudanças');
    
  } catch (error) {
    console.error('💥 Erro durante a população do banco:', error);
    process.exit(1);
  }
};

// Executar o script
populateOffersDatabase();