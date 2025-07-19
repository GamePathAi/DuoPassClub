import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseConfig';
import CategoryBadge from '../components/CategoryBadge';
import { useMembership } from '../hooks/useMembership';
import { ArrowRight, RefreshCw } from 'lucide-react';
import OfferModal from '../components/OfferModal';
import PageNavigation from '../components/PageNavigation';
import { X as ClearIcon } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  price_original: number;
  is_active: boolean;
  image_url?: string;
}

const OfertasPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { membership, loading: membershipLoading, error: membershipError, retry: retryMembership } = useMembership();
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    loadOffers();
  }, []);

  const retryLoad = () => {
    setError(null);
    loadOffers();
  };

  const [loading, setLoading] = useState(true);
  const loadOffers = async () => { 
    setLoading(true);
    try { 
      setError(null);
     // Definir categorias específicas para "Ofertas" 
     const offerCategories = [ 
       'Limpeza', 
       'Beleza', 
       'Retail', 
       'Serviços', 
       'Saúde', 
       'Tecnologia', 
       'Casa', 
       'Automóveis' 
     ]; 
 
     const { data, error: supaError } = await supabase 
       .from('offers') 
       .select('*') 
       .eq('is_active', true) 
       .in('category', offerCategories) 
       .order('created_at', { ascending: false }); 
 
     if (supaError) throw supaError;
 
     setOffers(data || []); 
     console.log('✅ Ofertas comerciais carregadas:', data?.length); 
   } catch (err) { 
     setError('Erro ao carregar ofertas. Tente novamente.'); 
     console.error(err); 
   } finally { 
     setLoading(false); 
   } 
 };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || membershipLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || membershipError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || membershipError}</p>
        <button 
          onClick={retryLoad}
          className="flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <PageNavigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Ofertas Comerciais</h1> 
        <p className="text-gray-600 mb-6"> 
          Produtos e serviços com desconto especial para membros DuoPass 
        </p>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Buscar ofertas por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <ClearIcon size={20} />
            </button>
          )}
        </div>
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma oferta encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div 
                key={offer.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => setSelectedOffer(offer)}
              >
                {offer.image_url && (
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <CategoryBadge category={offer.category} type="offer" />
                    <span className="font-bold text-green-600">CHF {offer.price_original}</span>
                  </div>
                  {membership?.canRedeem ? (
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center">
                      Resgatar Oferta <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      Atualize seu plano para resgatar
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedOffer && (
        <OfferModal 
          offer={selectedOffer} 
          isOpen={!!selectedOffer} 
          onClose={() => setSelectedOffer(null)} 
          type="offer" 
        />
      )}
    </>
  );
}

export default OfertasPage;