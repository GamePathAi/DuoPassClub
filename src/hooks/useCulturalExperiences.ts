import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface CulturalExperience {
  id: string;
  experience_name?: string;
  title?: string;
  story_behind?: string;
  description?: string;
  duo_price?: number;
  price?: number;
  cultural_partners?: {
    business_name?: string;
  };
}

export function useCulturalExperiences() {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCulturalExperiences() {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from database first
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('cultural_experiences')
          .select('*');

        if (experiencesError) {
          console.warn('⚠️ Tabelas culturais não encontradas, usando dados mock:', experiencesError.message);
          // Use mock data immediately if tables don't exist
          setExperiences(mockCulturalExperiences);
          setLoading(false);
          return;
        }

        const { data: partnersData, error: partnersError } = await supabase
          .from('cultural_partners')
          .select('*');

        if (partnersError) {
          console.warn('⚠️ Tabela de parceiros não encontrada, usando dados mock:', partnersError.message);
          setExperiences(mockCulturalExperiences);
          setLoading(false);
          return;
        }

        // If we have real data, use it
        if (experiencesData && experiencesData.length > 0) {
          const combinedData = experiencesData.map(exp => {
            const partner = partnersData?.find(p => p.id === exp.partner_id);
            return {
              ...exp,
              cultural_partners: partner ? { business_name: partner.business_name } : undefined
            };
          });
          setExperiences(combinedData);
        } else {
          // No data in database, use mock data
          console.info('ℹ️ Nenhum dado encontrado no banco, usando dados mock');
          setExperiences(mockCulturalExperiences);
        }
      } catch (err: any) {
        console.error('❌ Erro ao buscar experiências culturais:', err);
        setError(null); // Don't show error to user, just use mock data
        setExperiences(mockCulturalExperiences);
      } finally {
        setLoading(false);
      }
    }

    fetchCulturalExperiences();
  }, []);

  return { experiences, loading, error };
}

const mockCulturalExperiences: CulturalExperience[] = [
    {
      id: 'sarau-literario',
      experience_name: 'Sarau Literário com Café Especial',
      story_behind: 'Uma noite especial onde poesia e café se encontram, criando um ambiente mágico para conexões autênticas.',
      cultural_value: 'Valoriza a literatura brasileira contemporânea e a tradição dos cafés culturais, promovendo encontros genuínos através da arte.',
      duo_benefit: 'Duas pessoas participam do sarau e degustam cafés especiais pelo preço de uma.',
      original_price: 60.00,
      duo_price: 30.00,
      ambiance_notes: 'Luzes suaves, música acústica ao vivo, estantes repletas de livros e o aroma de café especial no ar.',
      best_for: ['primeiro_encontro', 'amigos_arte'],
      cultural_tags: ['literatura', 'cafe_especial', 'musica_acustica'],
      emotion_tags: ['reflexao', 'descoberta'],
      active: true,
      cultural_partners: {
        id: 'cafe-das-letras',
        business_name: 'Café das Letras',
        business_type: 'cafe_cultural',
        cultural_category: 'literatura_gastronomia',
        ambiance_description: 'Café literário acolhedor com eventos culturais e biblioteca comunitária.',
        contact_name: 'Ana Beatriz',
        email: 'contato@cafedasletras.com',
        address: {
          street: 'Rua da Poesia, 123',
          city: 'Vila Madalena',
          state: 'São Paulo',
          zipcode: '05014-020'
        }
      }
    },
    {
      id: 'jantar-velas',
      experience_name: 'Jantar à Luz de Velas com Música ao Vivo',
      story_behind: 'Uma experiência gastronômica que celebra receitas familiares em um ambiente romântico e acolhedor.',
      cultural_value: 'Preserva tradições culinárias familiares e valoriza a música brasileira autoral em ambiente intimista.',
      duo_benefit: 'Jantar completo para duas pessoas com música ao vivo incluída.',
      original_price: 120.00,
      duo_price: 60.00,
      ambiance_notes: 'Ambiente íntimo com velas, música acústica brasileira e decoração que conta histórias de família.',
      best_for: ['momento_romantico', 'celebracao_especial'],
      cultural_tags: ['gastronomia_familiar', 'musica_brasileira', 'ambiente_romantico'],
      emotion_tags: ['romance', 'celebracao'],
      active: true,
      cultural_partners: {
        id: 'restaurante-nonna',
        business_name: 'Restaurante da Nonna',
        business_type: 'restaurante_familiar',
        cultural_category: 'gastronomia_tradicional',
        ambiance_description: 'Restaurante familiar com receitas tradicionais e música ao vivo.',
        contact_name: 'Giuseppe Romano',
        email: 'contato@restaurantenonna.com',
        address: {
          street: 'Rua do Amor, 456',
          city: 'Jardins',
          state: 'São Paulo',
          zipcode: '01310-100'
        }
      }
    },
    {
      id: 'oficina-ceramica',
      experience_name: 'Oficina de Cerâmica e Chá da Tarde',
      story_behind: 'Conecte-se com a arte milenar da cerâmica enquanto saboreiam chás especiais em um ambiente de tranquilidade.',
      cultural_value: 'Preserva técnicas artesanais da cerâmica e promove mindfulness através da criação manual.',
      duo_benefit: 'Duas pessoas criam suas peças únicas e levam para casa, com chá da tarde incluído.',
      original_price: 80.00,
      duo_price: 40.00,
      ambiance_notes: 'Ateliê com luz natural abundante, plantas, som ambiente suave e o toque terapêutico da argila.',
      best_for: ['reflexao_pessoal', 'amigos_arte', 'descoberta_cultural'],
      cultural_tags: ['ceramica', 'artesanato', 'mindfulness', 'cha_especial'],
      emotion_tags: ['tranquilidade', 'descoberta', 'reflexao'],
      active: true,
      cultural_partners: {
        id: 'atelier-terra-alma',
        business_name: 'Ateliê Terra & Alma',
        business_type: 'atelier_arte',
        cultural_category: 'artesanato_local',
        ambiance_description: 'Espaço criativo dedicado à cerâmica, bem-estar e conexão com a natureza.',
        contact_name: 'Mariana Costa',
        email: 'contato@terraealma.com',
        address: {
          street: 'Rua da Criatividade, 789',
          city: 'Vila Olímpia',
          state: 'São Paulo',
          zipcode: '04547-130'
        }
      }
    },
    {
      id: 'aula-danca',
      experience_name: 'Aula de Dança de Salão para Iniciantes',
      story_behind: 'Descubra a magia da dança de salão em um ambiente descontraído e acolhedor.',
      cultural_value: 'Preserva a tradição da dança de salão e promove conexão através do movimento.',
      duo_benefit: 'Aula completa para duas pessoas com instrutor dedicado.',
      original_price: 90.00,
      duo_price: 45.00,
      ambiance_notes: 'Estúdio com espelhos, música clássica de dança e ambiente acolhedor para iniciantes.',
      best_for: ['primeiro_encontro', 'momento_romantico', 'descoberta_cultural'],
      cultural_tags: ['danca', 'musica', 'movimento', 'tradicao'],
      emotion_tags: ['romance', 'descoberta', 'celebracao'],
      active: true,
      cultural_partners: {
        id: 'estudio-danca',
        business_name: 'Estúdio Dança & Alma',
        business_type: 'estudio_danca',
        cultural_category: 'danca_tradicional',
        ambiance_description: 'Estúdio acolhedor especializado em dança de salão para todos os níveis.',
        contact_name: 'Carlos e Maria',
        email: 'contato@dancaealma.com',
        address: {
          street: 'Rua do Ritmo, 321',
          city: 'Copacabana',
          state: 'Rio de Janeiro',
          zipcode: '22070-010'
        }
      }
    },
    {
      id: 'degustacao-vinhos',
      experience_name: 'Degustação de Vinhos com Harmonização',
      story_behind: 'Uma jornada sensorial através de vinhos selecionados com harmonizações especiais.',
      cultural_value: 'Valoriza a cultura vinícola e a arte da harmonização gastronômica.',
      duo_benefit: 'Degustação completa para duas pessoas com sommelier dedicado.',
      original_price: 150.00,
      duo_price: 75.00,
      ambiance_notes: 'Adega intimista com iluminação suave, música ambiente e vista para as vinhas.',
      best_for: ['celebracao_especial', 'momento_romantico', 'descoberta_cultural'],
      cultural_tags: ['vinho', 'gastronomia', 'harmonizacao', 'cultura_vinicola'],
      emotion_tags: ['celebracao', 'descoberta', 'romance'],
      active: true,
      cultural_partners: {
        id: 'adega-boutique',
        business_name: 'Adega Boutique',
        business_type: 'adega_especializada',
        cultural_category: 'cultura_vinicola',
        ambiance_description: 'Adega boutique com seleção especial de vinhos e experiências únicas.',
        contact_name: 'Roberto Silva',
        email: 'contato@adegaboutique.com',
        address: {
          street: 'Rua das Vinhas, 567',
          city: 'Bento Gonçalves',
          state: 'Rio Grande do Sul',
          zipcode: '95700-000'
        }
      }
    },
    {
      id: 'workshop-fotografia',
      experience_name: 'Workshop de Fotografia Urbana',
      story_behind: 'Explore a cidade através das lentes e descubra a beleza escondida nos detalhes urbanos.',
      cultural_value: 'Desenvolve o olhar artístico e valoriza a fotografia como forma de expressão cultural.',
      duo_benefit: 'Workshop completo para duas pessoas com equipamento incluído.',
      original_price: 100.00,
      duo_price: 50.00,
      ambiance_notes: 'Caminhada fotográfica pelos pontos mais interessantes da cidade com orientação profissional.',
      best_for: ['amigos_arte', 'descoberta_cultural', 'reflexao_pessoal'],
      cultural_tags: ['fotografia', 'arte_urbana', 'criatividade', 'exploracao'],
      emotion_tags: ['descoberta', 'inspiracao', 'reflexao'],
      active: true,
      cultural_partners: {
        id: 'coletivo-foto',
        business_name: 'Coletivo Fotográfico',
        business_type: 'coletivo_artistico',
        cultural_category: 'arte_visual',
        ambiance_description: 'Coletivo de fotógrafos dedicado ao ensino e valorização da fotografia urbana.',
        contact_name: 'Ana Paula',
        email: 'contato@coletivofoto.com',
        address: {
          street: 'Rua da Arte, 890',
          city: 'Santa Teresa',
          state: 'Rio de Janeiro',
          zipcode: '20241-180'
        }
      }
    }
  ];