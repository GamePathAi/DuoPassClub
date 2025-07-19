const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function populateDatabase() {
  try {
    console.log('🚀 Inserindo ofertas diretamente...');
    
    // Inserir ofertas uma por uma para evitar problemas de RLS
    const offers = [
      {
        title: '🍕 Pizza Margherita 50% OFF',
        description: 'Deliciosa pizza margherita tradicional com molho de tomate, mussarela e manjericão fresco.',
        category: 'Gastronomia',
        city: 'Zürich',
        is_active: true
      },
      {
        title: '💄 Maquiagem Completa - 50% OFF',
        description: 'Transformação completa com maquiagem profissional para qualquer ocasião.',
        category: 'Beleza',
        city: 'Genève',
        is_active: true
      },
      {
        title: '🎬 Cinema: 2 Ingressos por CHF 38',
        description: 'Dois ingressos para qualquer sessão de cinema, incluindo filmes em cartaz.',
        category: 'Lazer',
        city: 'Basel',
        is_active: true
      },
      {
        title: '🏋️ Academia: 3 Meses por CHF 180',
        description: 'Acesso completo à academia por 3 meses, incluindo musculação e aulas.',
        category: 'Fitness',
        city: 'Bern',
        is_active: true
      },
      {
        title: '📱 iPhone 15: 15% Cashback',
        description: 'iPhone 15 com 15% de cashback. Todas as cores disponíveis.',
        category: 'Tecnologia',
        city: 'Lausanne',
        is_active: true
      }
    ];

    for (const offer of offers) {
      const { data, error } = await supabase
        .from('offers')
        .insert([offer])
        .select();
      
      if (error) {
        console.log('❌ Erro ao inserir oferta:', offer.title, error.message);
      } else {
        console.log('✅ Oferta inserida:', offer.title);
      }
    }

    // Verificar total de ofertas
    const { data: allOffers, error: countError } = await supabase
      .from('offers')
      .select('id, title')
      .eq('is_active', true);
    
    if (!countError) {
      console.log('\n📊 Total de ofertas ativas:', allOffers?.length);
    }
    
    console.log('\n🎉 Processo concluído!');
    
  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

populateDatabase();