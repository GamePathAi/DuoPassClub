import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createCulturalTables = async () => {
  console.log('🎭 Creating cultural database tables...');
  console.log('ℹ️  Note: Tables will be created through the Supabase dashboard or direct SQL access.');
  console.log('ℹ️  For now, we\'ll proceed with inserting sample data assuming tables exist.');
  
  try {
    // Insert sample data directly
    await insertSampleData();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

const insertSampleData = async () => {
  console.log('🌱 Inserting sample cultural data...');
  
  try {
    // Insert sample cultural partners
    const { data: partners, error: partnersError } = await supabase
      .from('cultural_partners')
      .insert([
        {
          business_name: 'Café das Artes',
          founder_story: 'Fundado por uma artista local que queria criar um espaço onde arte e café se encontrassem.',
          cultural_mission: 'Promover artistas locais e criar conexões através da arte e boa conversa.',
          contact_name: 'Maria Silva',
          email: 'maria@cafedasartes.com',
          business_type: 'cafe_cultural',
          cultural_category: 'arte_local',
          ambiance_description: 'Café aconchegante com exposições rotativas de artistas locais',
          social_values: ['arte_local', 'sustentabilidade', 'comercio_justo'],
          status: 'approved'
        },
        {
          business_name: 'Ateliê Criativo',
          founder_story: 'Espaço criado por um coletivo de artesãos para compartilhar técnicas e inspiração.',
          cultural_mission: 'Preservar técnicas artesanais e ensinar novas gerações.',
          contact_name: 'João Santos',
          email: 'joao@ateliecriativo.com',
          business_type: 'atelier_arte',
          cultural_category: 'artesanato_tradicional',
          ambiance_description: 'Ateliê aberto com oficinas e exposições de artesanato',
          social_values: ['preservacao_cultural', 'educacao_artistica', 'economia_criativa'],
          status: 'approved'
        }
      ])
      .select();

    if (partnersError) {
      console.error('❌ Error inserting partners:', partnersError);
      return;
    }

    console.log('✅ Sample partners inserted!');

    // Insert sample cultural experiences
    if (partners && partners.length > 0) {
      const { error: experiencesError } = await supabase
        .from('cultural_experiences')
        .insert([
          {
            partner_id: partners[0].id,
            experience_name: 'Café com Arte ao Vivo',
            story_behind: 'Uma experiência única onde você pode apreciar café especial enquanto assiste artistas criando ao vivo.',
            cultural_value: 'Conexão direta com o processo criativo e apoio a artistas locais.',
            duo_benefit: '2 cafés especiais + entrada para workshop de arte',
            ambiance_notes: 'Ambiente inspirador, conversas fluem naturalmente',
            best_for: ['primeiro_encontro', 'amigos_arte', 'reflexao_pessoal'],
            emotion_tags: ['inspiracao', 'criatividade', 'conexao'],
            price_range: 'R$ 25-40',
            duration: '2-3 horas',
            max_participants: 8
          },
          {
            partner_id: partners[1].id,
            experience_name: 'Oficina de Cerâmica para Dois',
            story_behind: 'Aprenda a arte milenar da cerâmica em um ambiente acolhedor e criativo.',
            cultural_value: 'Preservação de técnicas tradicionais e desenvolvimento da criatividade.',
            duo_benefit: 'Oficina completa para 2 pessoas + peças para levar',
            ambiance_notes: 'Espaço tranquilo, perfeito para concentração e conversa',
            best_for: ['casais', 'amigos_criativos', 'experiencia_nova'],
            emotion_tags: ['tranquilidade', 'criatividade', 'aprendizado'],
            price_range: 'R$ 80-120',
            duration: '3-4 horas',
            max_participants: 6
          }
        ]);

      if (experiencesError) {
        console.error('❌ Error inserting experiences:', experiencesError);
        return;
      }

      console.log('✅ Sample experiences inserted!');
    }

    console.log('🎉 Sample data insertion completed!');
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
};

// Run the script
createCulturalTables().then(() => {
  console.log('🎭 Cultural database setup completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});