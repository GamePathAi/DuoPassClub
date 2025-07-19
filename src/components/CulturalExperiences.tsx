import React, { useState, useMemo, useCallback } from 'react';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExperiences } from '../hooks/useExperiences';
import { Offer } from '../types';

interface CulturalExperiencesProps {
  limit?: number;
  showHeader?: boolean;
  isLandingPage?: boolean;
}

const CulturalExperiences: React.FC<CulturalExperiencesProps> = ({ limit = 6, showHeader = true, isLandingPage = false }) => {
  const { experiences: allExperiences, loading, error } = useExperiences();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const emotionCategories = useMemo(() => [
    { id: 'romance', label: 'Romance', icon: '💕', description: 'Para momentos íntimos' },
    { id: 'amizade', label: 'Amizade', icon: '🤝', description: 'Para fortalecer laços' },
    { id: 'descoberta', label: 'Descoberta', icon: '🔍', description: 'Para explorar o novo' },
    { id: 'reflexao', label: 'Reflexão', icon: '🧘', description: 'Para momentos contemplativos' },
    { id: 'celebracao', label: 'Celebração', icon: '🎉', description: 'Para ocasiões especiais' },
    { id: 'inspiracao', label: 'Inspiração', icon: '✨', description: 'Para despertar criatividade' }
  ], []);

  const experiences = useMemo(() => {
    let filtered = allExperiences;

    if (selectedEmotion) {
      // @ts-ignore
      filtered = allExperiences.filter(exp => exp.emotion_tags?.includes(selectedEmotion));
    }

    return limit ? filtered.slice(0, limit) : filtered;
  }, [allExperiences, selectedEmotion, limit]);



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
          experiences.map((exp: Offer) => (
            <div key={exp.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
              {/* Header da Experiência */}
              <div className="p-6 pb-4 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.merchant?.business_name || 'Parceiro Cultural'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {/* @ts-ignore */}
                    {exp.emotion_tags?.slice(0, 2).map(emotion => (
                      <span key={emotion} className="text-lg">
                        {getEmotionIcon(emotion)}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  {exp.description}
                </p>

                {/* Tags de Melhor Para */}
                {/* @ts-ignore */}
                {exp.best_for && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* @ts-ignore */}
                    {exp.best_for.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                        {getBestForLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Preços e Benefício DUO */}
              <div className="px-6 pb-4">
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Valor Original</span>
                    <span className="text-sm text-gray-500 line-through">CHF {exp.original_value.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-700">DUO PASS</span>
                    <span className="text-xl font-bold text-green-600">CHF {(exp.original_value / 2).toFixed(2)}</span>
                  </div>
                  {/* @ts-ignore */}
                  <p className="text-xs text-gray-600 mt-2">{exp.duo_benefit}</p>
                </div>
              </div>

              {/* Ambiente e CTA */}
              <div className="px-6 pb-6">
                {/* @ts-ignore */}
                {exp.ambiance_notes && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {/* @ts-ignore */}
                    <span className="line-clamp-1">{exp.ambiance_notes}</span>
                  </div>
                )}

                <Link
                  to={isLandingPage ? '/login' : `/ofertas/${exp.id}`}
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
};

export default React.memo(CulturalExperiences);