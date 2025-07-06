import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseConfig';

interface CulturalExperience {
  id: string;
  experience_name: string;
  story_behind: string;
  cultural_value: string;
  duo_benefit: string;
  original_price: number;
  duo_price: number;
  ambiance_notes: string;
  best_for: string[];
  cultural_tags: string[];
  emotion_tags: string[];
  active: boolean;
  cultural_partners: {
    business_name: string;
    business_type: string;
    cultural_category: string;
    ambiance_description: string;
  };
}

interface CulturalExperiencesProps {
  limit?: number;
  showHeader?: boolean;
}

export const CulturalExperiences = React.memo(function CulturalExperiences({ limit = 6, showHeader = true }: CulturalExperiencesProps) {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const emotionCategories = useMemo(() => [
    { id: 'romance', label: 'Romance', icon: '💕', description: 'Para momentos íntimos' },
    { id: 'amizade', label: 'Amizade', icon: '🤝', description: 'Para fortalecer laços' },
    { id: 'descoberta', label: 'Descoberta', icon: '🔍', description: 'Para explorar o novo' },
    { id: 'reflexao', label: 'Reflexão', icon: '🧘', description: 'Para momentos contemplativos' },
    { id: 'celebracao', label: 'Celebração', icon: '🎉', description: 'Para ocasiões especiais' },
    { id: 'inspiracao', label: 'Inspiração', icon: '✨', description: 'Para despertar criatividade' }
  ], []);

  const getDemoExperiences = useCallback((): CulturalExperience[] => [
    {
      id: 'demo-1',
      experience_name: 'Sarau Literário com Café Especial',
      story_behind: 'Uma noite especial onde poesia e café se encontram, criando um ambiente mágico para compartilhar histórias.',
      cultural_value: 'Promove a literatura local e cria um espaço de expressão artística acessível.',
      duo_benefit: 'Duas pessoas participam do sarau e degustam cafés especiais pelo preço de uma.',
      original_price: 60.00,
      duo_price: 30.00,
      ambiance_notes: 'Luzes suaves, música acústica ao vivo e um ambiente que convida à contemplação.',
      best_for: ['primeiro_encontro', 'amigos_arte', 'descoberta_cultural'],
      cultural_tags: ['literatura', 'poesia', 'musica_acustica'],
      emotion_tags: ['inspiracao', 'conexao', 'descoberta'],
      active: true,
      cultural_partners: {
        business_name: 'Café das Letras',
        business_type: 'cafe_cultural',
        cultural_category: 'literatura_cafe',
        ambiance_description: 'Um ambiente acolhedor com estantes repletas de livros e música suave.'
      }
    },
    {
      id: 'demo-2',
      experience_name: 'Jantar à Luz de Velas com Música ao Vivo',
      story_behind: 'Uma experiência gastronômica que celebra receitas familiares em um ambiente romântico.',
      cultural_value: 'Preserva tradições culinárias familiares e promove conexões genuínas.',
      duo_benefit: 'Jantar completo para duas pessoas com música ao vivo incluída.',
      original_price: 120.00,
      duo_price: 60.00,
      ambiance_notes: 'Ambiente íntimo com velas, música acústica e decoração que conta histórias.',
      best_for: ['momento_romantico', 'celebracao_especial'],
      cultural_tags: ['gastronomia_familiar', 'musica_ao_vivo', 'ambiente_romantico'],
      emotion_tags: ['romance', 'celebracao', 'conexao'],
      active: true,
      cultural_partners: {
        business_name: 'Restaurante da Nonna',
        business_type: 'restaurante_familia',
        cultural_category: 'gastronomia_autoral',
        ambiance_description: 'Restaurante familiar que preserva receitas tradicionais italianas.'
      }
    },
    {
      id: 'demo-3',
      experience_name: 'Oficina de Cerâmica e Chá da Tarde',
      story_behind: 'Conecte-se com a arte milenar da cerâmica enquanto saboreia chás especiais.',
      cultural_value: 'Preserva técnicas artesanais e promove mindfulness através da arte.',
      duo_benefit: 'Duas pessoas criam suas peças únicas e levam para casa.',
      original_price: 80.00,
      duo_price: 40.00,
      ambiance_notes: 'Ateliê com luz natural, plantas e o som suave da roda de oleiro.',
      best_for: ['reflexao_pessoal', 'amigos_arte', 'descoberta_cultural'],
      cultural_tags: ['artesanato', 'ceramica', 'mindfulness'],
      emotion_tags: ['reflexao', 'tranquilidade', 'descoberta'],
      active: true,
      cultural_partners: {
        business_name: 'Ateliê Terra & Alma',
        business_type: 'atelier_arte',
        cultural_category: 'artesanato_local',
        ambiance_description: 'Espaço criativo dedicado à cerâmica e bem-estar.'
      }
    }
  ], []);

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      
      // Teste básico de conectividade primeiro
      const connectivityTest = Promise.race([
        supabase.from('cultural_experiences').select('count').limit(1),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de conectividade experiências (5s)')), 5000)
        )
      ]);
      
      await connectivityTest;

      let query = supabase
        .from('cultural_experiences')
        .select(`
          *,
          cultural_partners (
            business_name,
            business_type,
            cultural_category,
            ambiance_description
          )
        `)
        .eq('active', true)
        .limit(limit);

      if (selectedEmotion) {
        query = query.contains('emotion_tags', [selectedEmotion]);
      }

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout da query experiências (10s)')), 10000)
      );
      
      const { data, error } = await Promise.race([query, timeoutPromise]);

      if (error) {
        setExperiences(getDemoExperiences());
      } else {
        if (!data || data.length === 0) {
          setExperiences(getDemoExperiences());
        } else {
          setExperiences(data);
        }
      }
    } catch {
       // Usar dados mock em caso de erro
       setExperiences(getDemoExperiences());
     } finally {
       setLoading(false);
     }
  }, [selectedEmotion, limit, getDemoExperiences]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const getEmotionIcon = useCallback((emotion: string) => {
    const category = emotionCategories.find(cat => cat.id === emotion);
    return category?.icon || '✨';
  }, [emotionCategories]);

  const getBestForLabel = useCallback((bestFor: string) => {
    const labels: { [key: string]: string } = {
      'primeiro_encontro': 'Primeiro Encontro',
      'amigos_arte': 'Amigos & Arte',
      'reflexao_pessoal': 'Reflexão Pessoal',
      'celebracao_especial': 'Celebração Especial',
      'momento_romantico': 'Momento Romântico',
      'descoberta_cultural': 'Descoberta Cultural'
    };
    return labels[bestFor] || bestFor;
  }, []);

  // Logs removidos para evitar spam no console

  if (loading) {
    return (
      <div className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {showHeader && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Descubra Experiências com Alma
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Não vendemos produtos, criamos memórias. Cada experiência é uma oportunidade de conexão genuína.
          </p>

          {/* Filtros por Emoção */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedEmotion(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedEmotion === null
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas as Experiências
            </button>
            {emotionCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedEmotion(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-2 ${
                  selectedEmotion === category.id
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Experiências */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma experiência encontrada</p>

          </div>
        ) : (
          experiences.map(experience => (
              <div key={experience.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Header da Experiência */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                    {experience.experience_name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{experience.cultural_partners.business_name}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {experience.emotion_tags.slice(0, 2).map(emotion => (
                    <span key={emotion} className="text-lg">
                      {getEmotionIcon(emotion)}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {experience.story_behind}
              </p>

              {/* Tags de Melhor Para */}
              <div className="flex flex-wrap gap-2 mb-4">
                {experience.best_for.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                    {getBestForLabel(tag)}
                  </span>
                ))}
              </div>
            </div>

            {/* Preços e Benefício DUO */}
            <div className="px-6 pb-4">
              <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Experiência Individual</span>
                  <span className="text-sm text-gray-500 line-through">R$ {experience.original_price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-700">DUO PASS</span>
                  <span className="text-xl font-bold text-green-600">R$ {experience.duo_price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">{experience.duo_benefit}</p>
              </div>
            </div>

            {/* Ambiente e CTA */}
            <div className="px-6 pb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="line-clamp-1">{experience.ambiance_notes}</span>
              </div>

              <Link
                to={`/experiencia/${experience.id}`}
                className="w-full bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Viver Esta Experiência</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          ))
        )}
      </div>

      {/* CTA para Ver Mais */}
      {showHeader && experiences.length >= limit && (
        <div className="text-center mt-12">
          <Link
            to="/experiencias"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <span>Descobrir Mais Experiências</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
});