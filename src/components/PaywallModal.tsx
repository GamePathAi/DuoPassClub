import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Crown, Trophy, Check, ArrowRight, Gift, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MEMBERSHIP_PLANS, PAYWALL_CONFIG } from '../types/membership';
import { useAuth } from '../contexts/AuthContext';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiencesUsed: number;
  triggerExperience?: string;
}

export function PaywallModal({ isOpen, onClose, experiencesUsed }: PaywallModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/login?redirect=/memberships');
      return;
    }
    navigate(`/checkout?plan=${planId}&billing=monthly`);
    onClose();
  };

  const handleViewAllPlans = () => {
    navigate('/memberships');
    onClose();
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'starter': return <Star className="w-6 h-6" />;
      case 'explorer': return <Crown className="w-6 h-6" />;
      case 'ambassador': return <Trophy className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const popularPlan = MEMBERSHIP_PLANS.find(plan => plan.popular);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white p-8 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Gift className="w-5 h-5" />
                  <span className="font-medium">Experiências Gratuitas Esgotadas</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Continue Sua Jornada Cultural
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Você já aproveitou suas {PAYWALL_CONFIG.FREE_EXPERIENCES_LIMIT} experiências gratuitas! 
                  Torne-se membro para continuar descobrindo a cultura suíça.
                </p>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Stats */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600 mb-1">{experiencesUsed}</div>
                  <div className="text-sm text-gray-600">Experiências Aproveitadas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">150+</div>
                  <div className="text-sm text-gray-600">Experiências Disponíveis</div>
                </div>
                <div className="text-center p-4 bg-rose-50 rounded-xl">
                  <div className="text-2xl font-bold text-rose-600 mb-1">7 dias</div>
                  <div className="text-sm text-gray-600">Teste Grátis</div>
                </div>
              </motion.div>

              {/* Popular Plan Highlight */}
              {popularPlan && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-white/20 rounded-full p-2">
                          {getPlanIcon(popularPlan.tier)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{popularPlan.name}</h3>
                          <div className="text-purple-100">⭐ Mais Popular</div>
                        </div>
                      </div>
                      <p className="text-white/90 mb-4">{popularPlan.description}</p>
                      <div className="flex items-baseline space-x-2 mb-4">
                        <span className="text-3xl font-bold">CHF {popularPlan.price_monthly}</span>
                        <span className="text-purple-200">/mês</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4" />
                          <span>{popularPlan.experiences_per_month} experiências/mês</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4" />
                          <span>Eventos exclusivos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4" />
                          <span>Curadoria personalizada</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4" />
                          <span>7 dias grátis</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <button
                        onClick={() => handleSelectPlan(popularPlan.id)}
                        className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center space-x-2"
                      >
                        <span>Começar Teste</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Benefits Grid */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <div className="text-center p-6 bg-amber-50 rounded-xl">
                  <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Sempre em Dupla</h4>
                  <p className="text-sm text-gray-600">Todas as experiências são pensadas para duas pessoas, criando conexões autênticas.</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Curadoria Emocional</h4>
                  <p className="text-sm text-gray-600">Cada experiência é selecionada para criar momentos memoráveis e significativos.</p>
                </div>
                <div className="text-center p-6 bg-rose-50 rounded-xl">
                  <div className="bg-rose-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-rose-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Exclusividade Suíça</h4>
                  <p className="text-sm text-gray-600">Acesso a experiências culturais únicas e autênticas em toda a Suíça.</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleViewAllPlans}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Ver Todos os Planos</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Talvez Mais Tarde
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-6 border-t border-gray-200 text-center"
              >
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Cancele a qualquer momento</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Sem compromisso</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Suporte 24/7</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}