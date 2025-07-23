require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function populateCulturalData() {
  try {
    console.log('🎭 Populando dados culturais...');
    
    // Primeiro, criar alguns parceiros culturais
    const partners = [
      {
        business_name: 'Café das Letras',
        business_type: 'cafe_cultural',
        cultural_category: 'literatura_gastronomia',
        ambiance_description: 'Café literário acolhedor com eventos culturais e biblioteca comunitária.'
      },
      {
        business_name: 'Restaurante da Nonna',
        business_type: 'restaurante_familiar',
        cultural_category: 'gastronomia_tradicional',
        ambiance_description: 'Restaurante familiar com receitas tradicionais e música ao vivo.'
      },
      {
        business_name: 'Ateliê Terra & Alma',
        business_type: 'atelier_arte',
        cultural_category: 'artesanato_local',
        ambiance_description: 'Espaço criativo dedicado à cerâmica, bem-estar e conexão com a natureza.'
      }
    ];
    
    console.log('👥 Inserindo parceiros culturais...');
    const { data: partnersData, error: partnersError } = await supabase
      .from('cultural_partners')
      .insert(partners)
      .select();
    
    if (partnersError) {
      console.log('❌ Erro ao inserir parceiros:', partnersError.message);
      return;
    }
    
    console.log(`✅ ${partnersData.length} parceiros inseridos com sucesso!`);
    
    // Agora criar experiências culturais
    const experiences = [
      {
        title: 'Sarau Literário com Café Especial',
        description: 'Uma noite especial onde poesia e café se encontram, criando um ambiente mágico para conexões autênticas.',
        active: true,
        partner_id: partnersData[0].id
      },
      {
        title: 'Jantar à Luz de Velas com Música ao Vivo',
        description: 'Uma experiência gastronômica que celebra receitas familiares em um ambiente romântico e acolhedor.',
        active: true,
        partner_id: partnersData[1].id
      },
      {
        title: 'Oficina de Cerâmica e Chá da Tarde',
        description: 'Conecte-se com a arte milenar da cerâmica enquanto saboreiam chás especiais em um ambiente de tranquilidade.',
        active: true,
        partner_id: partnersData[2].id
      }
    ];
    
    console.log('🎨 Inserindo experiências culturais...');
    const { data: experiencesData, error: experiencesError } = await supabase
      .from('cultural_experiences')
      .insert(experiences)
      .select();
    
    if (experiencesError) {
      console.log('❌ Erro ao inserir experiências:', experiencesError.message);
      return;
    }
    
    console.log(`✅ ${experiencesData.length} experiências inseridas com sucesso!`);
    
    // Verificar se os dados foram inseridos corretamente
    console.log('\n🔍 Verificando dados inseridos...');
    const { data: allExperiences, error: checkError } = await supabase
      .from('cultural_experiences')
      .select('*')
      .eq('active', true);
    
    if (checkError) {
      console.log('❌ Erro ao verificar dados:', checkError.message);
    } else {
      console.log(`✅ Total de experiências ativas: ${allExperiences.length}`);
      allExperiences.forEach((exp, index) => {
        console.log(`${index + 1}. ${exp.title}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

populateCulturalData();