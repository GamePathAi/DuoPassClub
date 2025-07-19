/**
 * Componente RecommendationAgent
 * Interface para gerar e exibir recomendações personalizadas de IA
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  MapPinIcon, 
  SunIcon, 
  HeartIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useRecommendationAgent, Recommendation } from '../hooks/useRecommendationAgent';
import { RecommendationContext } from '../services/openai-proxy';

const RecommendationAgent: React.FC = () => {
  const navigate = useNavigate();
  const { recommendations, loading, error, generateRecommendations, clearError } = useRecommendationAgent();
  
  const [context, setContext] = useState<RecommendationContext>({
    location: 'Zurich',
    weather: 'ensolarado',
    occasion: 'encontro romântico',
    budget: 150
  });

  const handleGenerateRecommendations = async () => {
    clearError();
    await generateRecommendations(context);
  };

  const handleOfferClick = (offerId: string) => {
    navigate(`/ofertas/${offerId}`);
  };



  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={cardVariants}
        >
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Sofia - Sua Assistente IA
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Recomendações personalizadas baseadas no seu histórico e preferências
          </p>
        </motion.div>

        {/* Controles de Contexto */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          variants={cardVariants}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            Conte-me sobre o momento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Localização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                Localização
              </label>
              <select
                value={context.location}
                onChange={(e) => setContext(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Zurich">Zurich</option>
                <option value="Geneva">Geneva</option>
                <option value="Basel">Basel</option>
                <option value="Bern">Bern</option>
                <option value="Lausanne">Lausanne</option>
                <option value="Lucerne">Lucerne</option>
              </select>
            </div>

            {/* Clima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SunIcon className="h-4 w-4 inline mr-1" />
                Clima
              </label>
              <select
                value={context.weather}
                onChange={(e) => setContext(prev => ({ ...prev, weather: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ensolarado">Ensolarado</option>
                <option value="nublado">Nublado</option>
                <option value="chuva">Chuva</option>
                <option value="neve">Neve</option>
                <option value="frio">Frio</option>
                <option value="quente">Quente</option>
              </select>
            </div>

            {/* Ocasião */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HeartIcon className="h-4 w-4 inline mr-1" />
                Ocasião
              </label>
              <select
                value={context.occasion}
                onChange={(e) => setContext(prev => ({ ...prev, occasion: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="encontro romântico">Encontro Romântico</option>
                <option value="aniversário">Aniversário</option>
                <option value="celebração especial">Celebração Especial</option>
                <option value="fim de semana relaxante">Fim de Semana Relaxante</option>
                <option value="aventura">Aventura</option>
                <option value="cultura">Cultura</option>
              </select>
            </div>

            {/* Orçamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                Orçamento (CHF)
              </label>
              <input
                type="number"
                value={context.budget}
                onChange={(e) => setContext(prev => ({ ...prev, budget: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="50"
                max="1000"
                step="10"
              />
            </div>
          </div>

          {/* Botão Gerar Recomendações */}
          <motion.button
            onClick={handleGenerateRecommendations}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Gerando recomendações...
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Atualizar Recomendações
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center"
            >
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recomendações */}
        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={`${recommendation.offer_id}-${index}`}
                  recommendation={recommendation}
                  onOfferClick={handleOfferClick}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && recommendations.length === 0 && !error && (
          <motion.div
            className="text-center py-12"
            variants={cardVariants}
          >
            <SparklesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Pronto para descobrir experiências incríveis?
            </h3>
            <p className="text-gray-400">
              Clique em "Atualizar Recomendações" para começar
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Componente do Card de Recomendação
interface RecommendationCardProps {
  recommendation: Recommendation;
  onOfferClick: (offerId: string) => void;
  index: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onOfferClick,
  index
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.4 }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Header com Confidence Score */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
            {recommendation.confidence}% match
          </span>
          <div className="flex items-center text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{recommendation.perfect_timing}</span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {recommendation.title}
        </h3>

        {/* Localização e Preço */}
        {recommendation.offer && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {recommendation.offer.location}
            </span>
            <span className="font-semibold text-orange-600">
              CHF {recommendation.offer.price}
            </span>
          </div>
        )}

        {/* Razão Personalizada */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <HeartIcon className="h-4 w-4 mr-2 text-pink-500" />
            Por que é perfeita para vocês
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {recommendation.reason}
          </p>
        </div>

        {/* Dica Especial */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <h4 className="font-semibold text-yellow-800 mb-1 flex items-center">
            <LightBulbIcon className="h-4 w-4 mr-2" />
            Dica especial
          </h4>
          <p className="text-yellow-700 text-sm">
            {recommendation.special_tip}
          </p>
        </div>

        {/* Botão de Ação */}
        <motion.button
          onClick={() => onOfferClick(recommendation.offer_id)}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Quero esta experiência!
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecommendationAgent;