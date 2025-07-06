// Script para popular o banco Supabase com ofertas demo
// Execute: npx tsx populate-offers.ts

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para popular banco com dados demo
const populateOffersDatabase = async () => {
  try {
    console.log('🚀 Iniciando população do banco de dados...');
    
    // Primeiro, inserir merchants se não existirem
    console.log('📊 Inserindo merchants...');
    const { data: merchantsData, error: merchantsError } = await supabase
      .from('merchants')
      .upsert([
        { 
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Pizzaria Bella Vista', 
          logo: '🍕', 
          address: 'Rua Augusta, 123, Zürich', 
          rating: 4.8 
        },
        { 
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Studio Glamour', 
          logo: '💄', 
          address: 'Av. Paulista, 456, Genève', 
          rating: 4.9 
        },
        { 
          id: '33333333-3333-3333-3333-333333333333',
          name: 'CineMax Plaza', 
          logo: '🎬', 
          address: 'Shopping Center, Piso 3, Basel', 
          rating: 4.6 
        },
        { 
          id: '44444444-4444-4444-4444-444444444444',
          name: 'PowerGym Elite', 
          logo: '🏋️', 
          address: 'Av. do Esporte, 789, Bern', 
          rating: 4.7 
        },
        { 
          id: '55555555-5555-5555-5555-555555555555',
          name: 'TechWorld', 
          logo: '📱', 
          address: 'Rua da Tecnologia, 321, Lausanne', 
          rating: 4.8 
        },
        { 
          id: '66666666-6666-6666-6666-666666666666',
          name: 'CleanPro Services', 
          logo: '🧹', 
          address: 'Rua da Limpeza, 654, Winterthur', 
          rating: 4.9 
        },
        { 
          id: '77777777-7777-7777-7777-777777777777',
          name: 'Café Premium', 
          logo: '☕', 
          address: 'Praça Central, 45, Lucerne', 
          rating: 4.5 
        },
        { 
          id: '88888888-8888-8888-8888-888888888888',
          name: 'Music Academy', 
          logo: '🎵', 
          address: 'Rua das Artes, 100, St. Gallen', 
          rating: 4.8 
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
          id: 'offer-1',
          merchant_id: '11111111-1111-1111-1111-111111111111',
          title: '🍕 Pizza Margherita 50% OFF',
          description: 'Deliciosa pizza margherita tradicional com molho de tomate, mussarela e manjericão fresco. Massa artesanal preparada diariamente.',
          original_value: 45.90,
          category: 'Gastronomia',
          location: 'Zürich',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
          terms_conditions: 'Válido de segunda a quinta-feira. Não cumulativo com outras promoções.',
          image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          is_active: true
        },
        {
          id: 'offer-2',
          merchant_id: '22222222-2222-2222-2222-222222222222',
          title: '💄 Maquiagem Completa - 50% OFF',
          description: 'Transformação completa com maquiagem profissional para qualquer ocasião. Inclui limpeza de pele, base, contorno, olhos e batom.',
          original_value: 120.00,
          category: 'Beleza',
          location: 'Genève',
          expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 dias
          terms_conditions: 'Agendamento obrigatório. Válido até o final do mês.',
          image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
          is_active: true
        },
        {
          id: 'offer-3',
          merchant_id: '33333333-3333-3333-3333-333333333333',
          title: '🎬 Cinema: 2 Ingressos por CHF 38',
          description: 'Dois ingressos para qualquer sessão de cinema, incluindo filmes em cartaz e lançamentos. Pipoca grátis incluída!',
          original_value: 38.00,
          category: 'Lazer',
          location: 'Basel',
          expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 dias
          terms_conditions: 'Não válido para pré-estreias e sessões especiais.',
          image_url: 'https://images.unsplash.com/photo-1489185078254-c3365d6e359f?w=400&h=300&fit=crop',
          is_active: true
        },
        {
          id: 'offer-4',
          merchant_id: '44444444-4444-4444-4444-444444444444',
          title: '🏋️ Academia: 3 Meses por CHF 180',
          description: 'Acesso completo à academia por 3 meses, incluindo musculação, aulas coletivas e acompanhamento nutricional personalizado.',
          original_value: 180.00,
          category: 'Fitness',
          location: 'Bern',
          expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 dias
          terms_conditions: 'Válido apenas para novos alunos. Documentos obrigatórios.',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          is_active: true
        },
        {
          id: 'offer-5',
          merchant_id: '55555555-5555-5555-5555-555555555555',
          title: '📱 iPhone 15: 15% Cashback',
          description: 'iPhone 15 com 15% de cashback. Todas as cores disponíveis, 128GB de armazenamento. Garantia oficial Apple.',
          original_value: 1299.00,
          category: 'Tecnologia',
          location: 'Lausanne',
          expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias
          terms_conditions: 'Cashback creditado em até 30 dias. Estoque limitado.',
          image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
          is_active: true
        },
        {
          id: 'offer-6',
          merchant_id: '66666666-6666-6666-6666-666666666666',
          title: '🧹 Limpeza Residencial Completa',
          description: 'Serviço completo de limpeza residencial, incluindo todos os cômodos, janelas e áreas externas. Produtos ecológicos.',
          original_value: 150.00,
          category: 'Serviços',
          location: 'Winterthur',
          expires_at: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 dias
          terms_conditions: 'Agendamento com 48h de antecedência. Produtos inclusos.',
          image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          is_active: true
        },
        {
          id: 'offer-7',
          merchant_id: '77777777-7777-7777-7777-777777777777',
          title: '☕ Café Premium: Compre 2, Leve 3',
          description: 'Promoção especial de café premium importado. Compre 2 pacotes de 500g e leve 3. Grãos selecionados.',
          original_value: 89.90,
          category: 'Gastronomia',
          location: 'Lucerne',
          expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 dias
          terms_conditions: 'Válido apenas para café em grãos. Não válido para café moído.',
          image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
          is_active: true
        },
        {
          id: 'offer-8',
          merchant_id: '88888888-8888-8888-8888-888888888888',
          title: '🎵 Aulas de Música: 4 por CHF 200',
          description: 'Pacote de 4 aulas individuais de música (violão, piano ou canto). Professor experiente e método personalizado.',
          original_value: 200.00,
          category: 'Educação',
          location: 'St. Gallen',
          expires_at: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(), // 50 dias
          terms_conditions: 'Agendamento flexível. Válido por 3 meses após ativação.',
          image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
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
    const { data: totalOffers, error: countError } = await supabase
      .from('offers')
      .select('*', { count: 'exact' })
      .eq('is_active', true);
    
    if (countError) {
      console.error('❌ Erro ao contar ofertas:', countError);
    } else {
      console.log('📊 Total de ofertas ativas no banco:', totalOffers?.length);
    }
    
    console.log('🎉 Banco populado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
};

// Executar script
if (require.main === module) {
  populateOffersDatabase()
    .then(() => {
      console.log('✅ Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na execução:', error);
      process.exit(1);
    });
}

export { populateOffersDatabase };