import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, Star, Users, Zap } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import DuoPassLogo from '../components/ui/DuoPassLogo';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Offer } from '../types';
import { supabase } from '../lib/supabase';

export default function Offers() {
  console.log('🔄 Componente Offers iniciado');
  const { user, userProfile } = useAuth();
  const { t } = useLanguage();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  console.log('📊 Estado atual:', { offers: offers.length, loading });

  const fetchOffers = useCallback(async () => {

    setLoading(true);
    setError(null);
    
    try {
      // Teste básico de conectividade primeiro

      const connectivityTest = Promise.race([
        supabase.from('offers').select('count').limit(1),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de conectividade (5s)')), 5000)
        )
      ]);
      
      const testResult = await connectivityTest;
      console.log('✅ [DEBUG] Conectividade OK:', testResult);
      
      // Query principal com timeout

      const queryPromise = supabase
        .from('offers')
        .select('*')
        .eq('is_active', true);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout da query (10s)')), 10000)
      );
      
      const result = await Promise.race([queryPromise, timeoutPromise]) as { data: Offer[] | null, error: any };
      const { data, error } = result;

      
      if (error) {
        console.error('❌ [ERROR] Erro ao carregar ofertas do Supabase:', error);
        // Fallback para dados demo em caso de erro

      }
      
      if (error) {
        console.error('❌ [ERROR] Erro ao carregar ofertas do Supabase:', error);
        setError(error);
        setOffers([]);
      } else if (data && data.length > 0) {
        console.log('✅ [SUCCESS] Ofertas carregadas do Supabase:', data.length);
        setOffers(data);
      } else {
        console.log('ℹ️ [INFO] Nenhuma oferta encontrada no Supabase');
        setOffers([]);
      }
      
    } catch (err) {
       console.error('❌ [ERROR] Erro inesperado ao carregar ofertas:', err);
       console.error('❌ [ERROR] Stack trace:', err instanceof Error ? err.stack : 'N/A');
       setError(err as Error);
       setOffers([]);
     } finally {
       // SEMPRE definir loading como false
 
       setLoading(false);
 
     }
  }, []);

  useEffect(() => {
    console.log('🎯 useEffect executado');
    fetchOffers();
  }, [fetchOffers]);

  const handleActivateCoupon = async (offer: Offer) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!userProfile?.subscription_status || userProfile.subscription_status !== 'active') {
      setShowSubscriptionModal(true);
      return;
    }

    try {
      const { error } = await supabase.from('activated_coupons').insert([
        {
          user_id: user.id,
          offer_id: offer.id,
          status: 'active',
        },
      ]);

      if (error) throw error;

      alert('Cupom ativado com sucesso!');
    } catch (error) {
      console.error('Error activating coupon:', error);
      alert('Erro ao ativar cupom. Tente novamente.');
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || offer.category === selectedCategory;
    const matchesCity = !selectedCity || offer.city === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });
  


  if (loading) {

    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="flex items-center justify-center mx-auto mb-4 animate-pulse">
            <DuoPassLogo className="h-16 w-auto" fill="currentColor" />
          </div>
          <p className="text-[#333333] font-medium">Carregando ofertas...</p>
        </div>
      </div>
    );
  }

  // PRIORIZAR DADOS: Se tem dados, mostrar dados (mesmo com erro)
  if (offers.length > 0) {

    // Continuar para renderização principal
  } else if (error) {

    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-[#333333] mb-2">Erro ao carregar ofertas</h2>
          <p className="text-gray-600 mb-4">
            Ocorreu um erro inesperado. Mas não se preocupe, temos ofertas demo para você!
          </p>
          <button
            onClick={() => {
              setError(null);
              fetchOffers();
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#333333] mb-6">🔥 Ofertas Exclusivas DuoPass</h1>
          
          {/* Banner de destaque */}
          <div className="bg-gradient-to-r from-[#F6C100] via-[#FFD700] to-[#C91F1F] rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">💎 Marketplace Exclusivo</h2>
                  <p className="text-lg opacity-90">Descubra ofertas imperdíveis com até 70% de desconto!</p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>2.500+ membros ativos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>Novas ofertas diárias</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Avaliação 4.8/5</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-right">
                    <div className="text-3xl font-bold">{filteredOffers.length}</div>
                    <div className="text-sm opacity-90">ofertas ativas</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C91F1F] w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] bg-white transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C91F1F] w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] appearance-none bg-white transition-all"
              >
                <option value="">Todas as categorias ({offers.length})</option>
                <option value="gastronomy">🍕 Gastronomia ({offers.filter(o => o.category === 'gastronomy').length})</option>
                <option value="beauty">💄 Beleza ({offers.filter(o => o.category === 'beauty').length})</option>
                <option value="leisure">🎬 Lazer ({offers.filter(o => o.category === 'leisure').length})</option>
                <option value="fitness">💪 Fitness ({offers.filter(o => o.category === 'fitness').length})</option>
                <option value="shopping">📱 Compras ({offers.filter(o => o.category === 'shopping').length})</option>
                <option value="services">🏠 Serviços ({offers.filter(o => o.category === 'services').length})</option>
              </select>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C91F1F] w-5 h-5" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] appearance-none bg-white transition-all"
              >
                <option value="">Todas as cidades</option>
                <option value="Zürich">Zürich (ZH)</option>
                <option value="Genève">Genève (GE)</option>
                <option value="Basel">Basel (BS)</option>
                <option value="Bern">Bern (BE)</option>
                <option value="Lausanne">Lausanne (VD)</option>
                <option value="Winterthur">Winterthur (ZH)</option>
                <option value="Luzern">Luzern (LU)</option>
                <option value="St. Gallen">St. Gallen (SG)</option>
              </select>
            </div>
          </div>
          {/* Ofertas na sua região */}
          <div className="mb-8">
            <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#333333]">
                      {selectedCity ? `Ofertas em ${selectedCity}` : 'Ofertas em toda Suíça'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {filteredOffers.length} ofertas disponíveis • Atualizadas agora
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#C91F1F]">{filteredOffers.length}</div>
                  <div className="text-xs text-gray-500">ofertas ativas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => {
  
              return (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onActivate={handleActivateCoupon}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border-2 border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-[#333333] text-2xl font-bold mb-2">🔍 Ops! Nenhuma oferta encontrada</h3>
            <p className="text-gray-600 text-lg mb-6">Não encontramos ofertas com esses filtros, mas temos sugestões!</p>
            
            <div className="max-w-md mx-auto space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-[#F6C100] rounded-full"></span>
                <span>Tente remover alguns filtros</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-[#C91F1F] rounded-full"></span>
                <span>Explore outras categorias</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Novas ofertas chegam diariamente!</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCity('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                🔄 Limpar Filtros
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border-2 border-[#F6C100] text-[#C91F1F] rounded-full font-semibold hover:bg-[#F6C100] hover:text-white transition-all"
              >
                ✨ Ver Todas as Ofertas
              </button>
            </div>
          </div>
        )}

        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">!</span>
                </div>
                <h3 className="text-2xl font-bold text-[#333333] mb-2">
                  {t('subscription.required')}
                </h3>
                <p className="text-gray-600 text-lg">
                  {t('subscription.message')}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-[#333333] font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowSubscriptionModal(false);
                    alert('Funcionalidade de assinatura em desenvolvimento');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {t('subscription.subscribe')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}