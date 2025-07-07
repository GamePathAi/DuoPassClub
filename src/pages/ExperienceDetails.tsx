import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Heart, Share2, Sparkles, Gift, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { VoucherService } from '../lib/voucherService';
import { PaywallModal } from '../components/PaywallModal';
import { PAYWALL_CONFIG } from '../types/membership';

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
    id: string;
    business_name: string;
    business_type: string;
    cultural_category: string;
    ambiance_description: string;
    contact_name: string;
    email: string;
    address: Record<string, string>;
  };
}

export function ExperienceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [experience, setExperience] = useState<CulturalExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [hasActiveVoucher, setHasActiveVoucher] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [experiencesUsed, setExperiencesUsed] = useState(0);
  const [userSubscription, setUserSubscription] = useState<{status: string} | null>(null);

  useEffect(() => {
    if (!id) return;

    // Mock data para experiências baseado no ID da URL
    const experienceDetails: { [key: string]: CulturalExperience } = {
      'sarau-literario': {
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
      'jantar-velas': {
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
      'oficina-ceramica': {
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
      }
    };

    const selectedExperience = experienceDetails[id];
    if (selectedExperience) {
      setExperience(selectedExperience);
    }
    setLoading(false);

    if (user && selectedExperience) {
      checkExistingVoucher();
      checkUserSubscriptionStatus();
    }
  }, [id, user, checkExistingVoucher, checkUserSubscriptionStatus]);

  const checkUserSubscriptionStatus = useCallback(async () => {
    if (!user) return;

    try {
      // Mock data - em produção, isso viria do Supabase
      const mockExperiencesUsed = parseInt(localStorage.getItem(`experiences_used_${user.id}`) || '0');
      const mockSubscription = localStorage.getItem(`subscription_${user.id}`);
      
      setExperiencesUsed(mockExperiencesUsed);
      setUserSubscription(mockSubscription ? JSON.parse(mockSubscription) : null);
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
    }
  }, [user]);

  const canRedeemExperience = () => {
    // Se tem assinatura ativa, pode resgatar
    if (userSubscription && userSubscription.status === 'active') {
      return true;
    }
    
    // Se não tem assinatura, verifica limite gratuito
    return experiencesUsed < PAYWALL_CONFIG.FREE_EXPERIENCES_LIMIT;
  };

  const checkExistingVoucher = useCallback(async () => {
    if (!user || !experience) return;

    try {
      const canGenerate = await VoucherService.canGenerateVoucher(user.id, experience.cultural_partners.id);
      setHasActiveVoucher(!canGenerate);
    } catch (err) {
      console.error('Erro ao verificar voucher existente:', err);
    }
  }, [user, experience]);

  const handleRedeemVoucher = async () => {
    if (!user) {
      // Redireciona para login com redirect de volta para esta página
      const redirectUrl = encodeURIComponent(location.pathname);
      navigate(`/login?redirect=${redirectUrl}`);
      return;
    }

    if (!experience) return;

    // Verifica se pode resgatar experiência
    if (!canRedeemExperience()) {
      setShowPaywall(true);
      return;
    }

    try {
      setIsRedeeming(true);
      
      const voucher = await VoucherService.generateVoucher(user.id, experience.cultural_partners.id);
      
      if (voucher) {
        // Incrementa contador de experiências usadas se não tem assinatura
        if (!userSubscription || userSubscription.status !== 'active') {
          const newCount = experiencesUsed + 1;
          localStorage.setItem(`experiences_used_${user.id}`, newCount.toString());
          setExperiencesUsed(newCount);
        }
        
        // Redirecionar para página de voucher ativo
        navigate(`/voucher/ativo/${voucher.id}?code=${voucher.voucher_code}`);
      } else {
        throw new Error('Não foi possível gerar o voucher');
      }
    } catch (error) {
      console.error('Erro ao resgatar voucher:', error);
      alert('Erro ao resgatar voucher. Tente novamente.');
    } finally {
      setIsRedeeming(false);
    }
  };



  const getBestForLabel = (bestFor: string) => {
    const labels: { [key: string]: string } = {
      'primeiro_encontro': 'Primeiro Encontro',
      'amigos_arte': 'Amigos & Arte',
      'reflexao_pessoal': 'Reflexão Pessoal',
      'celebracao_especial': 'Celebração Especial',
      'momento_romantico': 'Momento Romântico',
      'descoberta_cultural': 'Descoberta Cultural'
    };
    return labels[bestFor] || bestFor;
  };

  const getEmotionIcon = (emotion: string) => {
    const icons: { [key: string]: string } = {
      'romance': '💕',
      'descoberta': '🔍',
      'reflexao': '🧘',
      'tranquilidade': '🕯️',
      'celebracao': '🎉',
      'aventura': '🌟'
    };
    return icons[emotion] || '✨';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Experiência não encontrada</h1>
          <button
            onClick={() => navigate('/')}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-2 text-amber-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{experience.cultural_partners.business_name}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {experience.experience_name}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {experience.story_behind}
              </p>

              {/* Emotion Tags */}
              <div className="flex items-center space-x-3 mb-8">
                {experience.emotion_tags.map(emotion => (
                  <span key={emotion} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <span className="text-lg">{getEmotionIcon(emotion)}</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">{emotion}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-amber-100 to-rose-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">DUO PASS Especial</h3>
                <p className="text-gray-600">Experiência para duas pessoas</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preço Individual</span>
                  <span className="text-gray-500 line-through">CHF {(experience.original_price * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-amber-600">DUO PASS</span>
                  <span className="text-green-600">CHF {(experience.duo_price * 0.18).toFixed(2)}</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-medium">
                    💰 Economia de CHF {((experience.original_price - experience.duo_price) * 0.18).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-800 mb-2">🎁 Benefício DUO:</h4>
                <p className="text-sm text-amber-700">{experience.duo_benefit}</p>
              </div>

              {hasActiveVoucher ? (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Você já possui um voucher ativo!</p>
                  </div>
                  <button
                    onClick={() => navigate('/meus-vouchers')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Ver Meus Vouchers
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRedeemVoucher}
                  disabled={isRedeeming}
                  className="w-full bg-gradient-to-r from-amber-500 to-rose-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRedeeming ? 'Gerando Voucher...' : '🎯 Resgatar DUO PASS'}
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Details Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cultural Value */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <span>Valor Cultural</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">{experience.cultural_value}</p>
            </motion.div>

            {/* Ambiance */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <span>Ambiente</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">{experience.ambiance_notes}</p>
            </motion.div>

            {/* Best For */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-500" />
                <span>Ideal Para</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {experience.best_for.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium">
                    {getBestForLabel(tag)}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Partner Info */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h4 className="font-bold text-gray-800 mb-4">Parceiro Cultural</h4>
              <div className="space-y-3">
                <h5 className="font-semibold text-amber-600">{experience.cultural_partners.business_name}</h5>
                <p className="text-sm text-gray-600">{experience.cultural_partners.ambiance_description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {experience.cultural_partners.address.street}, {experience.cultural_partners.address.city}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Cultural Tags */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h4 className="font-bold text-gray-800 mb-4">Tags Culturais</h4>
              <div className="flex flex-wrap gap-2">
                {experience.cultural_tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Share */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h4 className="font-bold text-gray-800 mb-4">Compartilhar</h4>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Compartilhar experiência</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        experiencesUsed={experiencesUsed}
        triggerExperience={experience?.experience_name}
      />
    </div>
  );
}