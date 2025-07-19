import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, Zap, Eye, Clock, X, Crown, Gift } from 'lucide-react';
import { Offer } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MembershipService } from '../services/membershipService';

interface OfferCardProps {
  offer: Offer;
  onActivate?: (offer: Offer) => void;
  showActivateButton?: boolean;
  isPublic?: boolean;
}

export default function OfferCard({ offer, onActivate, showActivateButton = true, isPublic = false }: OfferCardProps) {
  const navigate = useNavigate();
  const { user, trialStatus, tier } = useAuth();
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleResgateOferta = async (offerId: string) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      // Bypass para usuários com assinatura paga ou demo
      if (tier === 'premium' || tier === 'golden' || user.email === 'demo@duopass.com') {
        await criarVoucher(offerId);
        return;
      }

      // Contar vouchers existentes do usuário
      const { count, error: countError } = await supabase
        .from('vouchers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        console.error('Erro ao contar vouchers:', countError);
        return;
      }

      const voucherCount = count ?? 0;

      // Lógica de limite para Golden Week (trial)
      if (trialStatus === 'active') {
        if (voucherCount < 4) {
          await criarVoucher(offerId);
        } else {
          alert('Você atingiu o limite de 4 resgates da Golden Week. Faça upgrade para continuar!');
          setShowPaywallModal(true);
        }
        return;
      }

      // Lógica de limite para Freemium
      if (tier === 'freemium') {
        if (voucherCount < 1) {
          await criarVoucher(offerId);
        } else {
          alert('Você atingiu seu limite de resgate Freemium. Faça upgrade para resgatar mais!');
          setShowPaywallModal(true);
        }
        return;
      }

      // Se não for trial, nem freemium, nem pago, mostrar paywall
      setShowPaywallModal(true);

    } catch (error) {
      console.error('Erro ao resgatar oferta:', error);
    }
  };

  // 🎫 Função para criar voucher
  const criarVoucher = async (offerId: string) => {
    // Gerar código único para o voucher
    const voucherCode = `DUO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Criar registro do voucher resgatado
    const { data: voucherData, error: voucherError } = await supabase
      .from('vouchers')
      .insert({
        offer_id: offerId,
        user_id: user!.id,
        merchant_id: offer.merchant_id,
        voucher_code: voucherCode,
        qr_code_data: voucherCode,
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
      })
      .select()
      .single();
    
    if (voucherError) {
      console.error('❌ Erro ao criar voucher:', voucherError);
      throw voucherError;
    }
    
    console.log('✅ Voucher criado com sucesso:', voucherData);
    
    // Navegar para o voucher ativo
    if (voucherData) {
      navigate(`/voucher/${voucherData.id}?code=${voucherCode}`);
    }
    
    // Chamar callback se fornecido
    if (onActivate) {
      onActivate(offer);
    }
  };

  // Calcular dias restantes para urgência
  const getDaysRemaining = () => {
    const now = new Date();
    const expiry = new Date(offer.expires_at);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calcular desconto simulado
  const getDiscountPercentage = () => {
    const discounts = [30, 40, 50, 60, 70];
    return discounts[Math.floor(Math.random() * discounts.length)];
  };

  // Gerar social proof simulado
  const getSocialProof = () => {
    const usersCount = Math.floor(Math.random() * 500) + 100;
    const rating = (4.2 + Math.random() * 0.6).toFixed(1);
    const reviewsCount = Math.floor(Math.random() * 200) + 50;
    return { usersCount, rating, reviewsCount };
  };

  const daysRemaining = getDaysRemaining();
  const discountPercentage = getDiscountPercentage();
  const socialProof = getSocialProof();
  const discountedPrice = offer.original_value * (1 - discountPercentage / 100);

  // Determinar badge de urgência
  const getUrgencyBadge = () => {
    if (daysRemaining <= 1) return { text: 'ÚLTIMAS HORAS', color: 'bg-red-500', icon: Clock };
    if (daysRemaining <= 3) return { text: 'RESTAM ' + daysRemaining + ' DIAS', color: 'bg-orange-500', icon: Clock };
    if (offer.id.includes('demo-1') || offer.id.includes('demo-5')) return { text: 'HOT', color: 'bg-red-500', icon: Zap };
    if (offer.id.includes('demo-2') || offer.id.includes('demo-4')) return { text: 'NOVA', color: 'bg-green-500', icon: Star };
    return null;
  };

  const urgencyBadge = getUrgencyBadge();

  return (
    <>
      {/* 💳 Modal de Paywall para usuários reais sem membership */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Botão fechar */}
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#333333] mb-2">
                Torne-se Membro DUO PASS
              </h2>
              <p className="text-gray-600">
                Desbloqueie experiências culturais exclusivas em dupla
              </p>
            </div>

            {/* Benefícios */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Vouchers ilimitados 2 por 1</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Acesso a experiências exclusivas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Curadoria cultural personalizada</span>
              </div>
            </div>

            {/* Trial gratuito */}
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-4 mb-6 border border-green-200">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 mb-1">
                  🎁 Trial Gratuito 7 Dias
                </div>
                <div className="text-sm text-gray-600">
                  Experimente sem compromisso
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowPaywallModal(false);
                  navigate('/memberships');
                }}
                className="w-full bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-3 px-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                🚀 Ver Planos de Membership
              </button>
              <button
                onClick={() => setShowPaywallModal(false)}
                className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
              >
                Talvez mais tarde
              </button>
            </div>
          </div>
        </div>
      )}
    <div className="bg-white rounded-2xl shadow-sm border-2 border-[#F5F3EF] overflow-hidden hover:border-[#F6C100] hover:shadow-xl transition-all transform hover:-translate-y-1 group">
      {offer.image_url && (
        <div className="h-48 bg-gray-200 overflow-hidden relative">
          <img
            src={offer.image_url}
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge de urgência */}
          {urgencyBadge && (
            <div className={`absolute top-3 left-3 ${urgencyBadge.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse`}>
              <urgencyBadge.icon className="w-3 h-3" />
              {urgencyBadge.text}
            </div>
          )}
          {/* Badge de desconto */}
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-[#333333] flex-1 group-hover:text-[#C91F1F] transition-colors">
            {offer.title}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white">
            {offer.category}
          </span>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{socialProof.rating}</span>
            <span>({socialProof.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-[#C91F1F]" />
            <span>{socialProof.usersCount}+ aproveitaram</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {offer.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-[#C91F1F]" />
            <span>{offer.city ? offer.city : offer.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-[#C91F1F]" />
            <span>Válido até: {formatDate(offer.expires_at)}</span>
          </div>
        </div>

        {/* Preços com destaque */}
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">CHF {discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">CHF {offer.original_value.toFixed(2)}</span>
              </div>
              <div className="text-xs text-green-600 font-medium">
                Economize CHF {(offer.original_value - discountedPrice).toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Desconto</div>
              <div className="text-lg font-bold text-green-600">-{discountPercentage}%</div>
            </div>
          </div>
        </div>

        {offer.merchant && (
          <div className="text-sm text-[#333333] mb-4 font-medium">
            <strong>{offer.merchant.business_name}</strong>
          </div>
        )}

        {/* Botões de ação */}
        <div className="space-y-3">
          {/* Botão Ver Detalhes */}
          <ViewDetailsButton offerId={offer.id} isPublic={isPublic} />
          
          {/* Botão Resgatar (se aplicável) */}
          {showActivateButton && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (isPublic) {
                  navigate('/login?redirect=/experiencias');
                  return;
                }
                const button = document.activeElement as HTMLButtonElement;
                if (button) {
                  // Mostrar loading
                  button.innerHTML = '⏳ RESGATANDO...';
                  button.disabled = true;
                  button.className = 'w-full bg-gray-500 text-white py-3 px-4 rounded-full font-semibold transition-all';
                  
                  // Tentar resgatar oferta
                  const success = await handleResgateOferta(offer.id);
                  
                  if (success) {
                    // Sucesso
                    button.innerHTML = '✅ VOUCHER RESGATADO!';
                    button.className = 'w-full bg-green-500 text-white py-3 px-4 rounded-full font-semibold transition-all';
                    
                    setTimeout(() => {
                      button.innerHTML = '🎯 RESGATAR VOUCHER';
                      button.className = 'w-full bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-3 px-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95';
                      button.disabled = false;
                    }, 3000);
                  } else {
                    // Erro
                    button.innerHTML = '❌ ERRO - TENTE NOVAMENTE';
                    button.className = 'w-full bg-red-500 text-white py-3 px-4 rounded-full font-semibold transition-all';
                    
                    setTimeout(() => {
                      button.innerHTML = '🎯 RESGATAR VOUCHER';
                      button.className = 'w-full bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-3 px-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95';
                      button.disabled = false;
                    }, 2000);
                  }
                }
              }}
              className="w-full bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-3 px-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              {isPublic ? 'DESBLOQUEAR OFERTA' : 'RESGATAR VOUCHER'}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

// Componente separado para o botão "Ver Detalhes"
function ViewDetailsButton({ offerId, isPublic }: { offerId: string; isPublic: boolean; }) {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    if (isPublic) {
      navigate('/login?redirect=/experiencias');
    } else {
      navigate(`/ofertas/${offerId}`);
    }
  };
  
  return (
    <button
      onClick={handleViewDetails}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#F6C100] text-[#C91F1F] rounded-full font-semibold hover:bg-[#F6C100] hover:text-white transition-all transform hover:-translate-y-1"
    >
      <Eye className="w-4 h-4" />
      Ver Detalhes
    </button>
  );
}