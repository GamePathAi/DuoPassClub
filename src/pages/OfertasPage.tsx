import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OfferCard } from '../components/OfferCard';
import { useAuth } from '../contexts/AuthContext';
import { Offer } from '../types';
import { supabase } from '../lib/supabase';

const demoOffers: Offer[] = [
  {
    id: 'demo-1',
    merchant_id: 'demo-merchant-1',
    title: '🍕 Jantar Romântico para Dois - Pizza Gourmet',
    description: 'Experiência gastronômica única com pizza artesanal para duas pessoas, entrada, sobremesa e vinho da casa inclusos.',
    original_value: 89.90,
    category: 'gastronomy',
    location: 'Centro, Zürich',
    city: 'Zürich',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    terms_conditions: 'Válido de segunda a quinta-feira. Reserva obrigatória.',
    created_at: new Date().toISOString(),
    merchant: {
      business_name: 'Ristorante Bella Vista',
      contact_info: '+41 44 123 4567'
    }
  },
  {
    id: 'demo-2',
    merchant_id: 'demo-merchant-2',
    title: '🎭 Concerto de Música Clássica - Ingressos Duplos',
    description: 'Noite inesquecível de música clássica na Opera House. Dois ingressos para a melhor experiência cultural de Zurique.',
    original_value: 120.00,
    category: 'culture',
    location: 'Opera House, Zürich',
    city: 'Zürich',
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    terms_conditions: 'Sujeito à disponibilidade. Não reembolsável.',
    created_at: new Date().toISOString(),
    merchant: {
      business_name: 'Zurich Opera House',
      contact_info: '+41 44 268 6666'
    }
  },
  {
    id: 'demo-3',
    merchant_id: 'demo-merchant-3',
    title: '🎨 Workshop de Arte Contemporânea para Casais',
    description: 'Aprenda técnicas de arte moderna em uma experiência criativa para duas pessoas. Materiais inclusos.',
    original_value: 75.00,
    category: 'culture',
    location: 'Galeria Central, Genève',
    city: 'Genève',
    expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    terms_conditions: 'Agendamento obrigatório. Materiais inclusos.',
    created_at: new Date().toISOString(),
    merchant: {
      business_name: 'Atelier Moderne',
      contact_info: '+41 22 987 6543'
    }
  },
  {
    id: 'demo-4',
    merchant_id: 'demo-merchant-4',
    title: '🍷 Degustação de Vinhos Suíços - Experiência Premium',
    description: 'Descubra os melhores vinhos locais em uma degustação guiada para duas pessoas com sommelier especializado.',
    original_value: 95.00,
    category: 'gastronomy',
    location: 'Wine Bar Premium, Basel',
    city: 'Basel',
    expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
    terms_conditions: 'Apenas maiores de 18 anos. Reserva antecipada.',
    created_at: new Date().toISOString(),
    merchant: {
      business_name: 'Swiss Wine Experience',
      contact_info: '+41 61 456 7890'
    }
  },
  {
    id: 'demo-5',
    merchant_id: 'demo-merchant-5',
    title: '🎪 Espetáculo de Teatro Contemporâneo',
    description: 'Performance teatral inovadora e envolvente. Dois ingressos para uma noite cultural única no coração de Bern.',
    original_value: 68.00,
    category: 'culture',
    location: 'Teatro Municipal, Bern',
    city: 'Bern',
    expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=300&fit=crop',
    terms_conditions: 'Sujeito à lotação. Chegada 30min antes.',
    created_at: new Date().toISOString(),
    merchant: {
      business_name: 'Teatro Municipal de Bern',
      contact_info: '+41 31 234 5678'
    }
  },
  {
    id: 'demo-6',
    merchant_id: 'demo-merchant-6',
    title: '🚶‍♂️ Tour Cultural pela Cidade Antiga',
    description: 'Caminhada guiada pela história suíça para duas pessoas. Descubra segredos e lendas do centro histórico.',
    original_value: 45.00,
    category: 'culture',
    location: 'Centro Histórico, Lausanne',
    city: 'Lausanne',
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    terms_conditions: 'Cancelamento até 24h antes. Guia em português.',
    created_at: new Date().toISOString(),
    merchant: {
      business_name: 'Swiss Heritage Tours',
      contact_info: '+41 21 345 6789'
    }
  }
];

export function OfertasPage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('❌ Erro ao carregar ofertas:', error);
        setOffers(demoOffers);
      } else if (data && data.length > 0) {
        setOffers(data);
      } else {
        setOffers(demoOffers);
      }
      
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      setOffers(demoOffers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || offer.category === selectedCategory;
    const matchesCity = !selectedCity || offer.city === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  const categories = Array.from(new Set(offers.map(offer => offer.category)));
  const cities = Array.from(new Set(offers.map(offer => offer.city)));

  const getTierBadge = () => {
    if (!userProfile) return null;
    
    const tierColors = {
      'explorer': 'bg-green-100 text-green-800',
      'enthusiast': 'bg-blue-100 text-blue-800',
      'ambassador': 'bg-purple-100 text-purple-800'
    };
    
    const tierNames = {
      'explorer': 'Explorer',
      'enthusiast': 'Enthusiast',
      'ambassador': 'Ambassador'
    };
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        tierColors[userProfile.membership_tier as keyof typeof tierColors] || 'bg-gray-100 text-gray-800'
      }`}>
        <Star className="w-4 h-4 mr-1" />
        {tierNames[userProfile.membership_tier as keyof typeof tierNames] || userProfile.membership_tier}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando experiências...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header com boas-vindas */}
      <section className="bg-gradient-to-r from-orange-500 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Olá, {userProfile?.full_name || user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-xl opacity-90 mb-4">
                Descubra experiências culturais exclusivas para você
              </p>
              {getTierBadge()}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {filteredOffers.length} experiências disponíveis
              </p>
              <p className="text-sm opacity-75">
                Sempre em dupla • Sempre autênticas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white shadow-sm border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar experiências..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Filtro Categoria */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'gastronomy' ? 'Gastronomia' :
                   category === 'culture' ? 'Cultura' :
                   category === 'leisure' ? 'Lazer' :
                   category === 'fitness' ? 'Fitness' :
                   category === 'beauty' ? 'Beleza' :
                   category === 'shopping' ? 'Shopping' :
                   category === 'services' ? 'Serviços' : category}
                </option>
              ))}
            </select>
            
            {/* Filtro Cidade */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas as cidades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid de Ofertas */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Nenhuma experiência encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar seus filtros ou buscar por outros termos
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCity('');
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA para mais experiências */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Quer mais experiências exclusivas?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upgrade seu plano e tenha acesso a experiências premium e comunidades VIP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
              Ver Planos Premium
            </button>
            <button 
              onClick={() => navigate('/dashboard?tab=connect')}
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all duration-200"
            >
              Explorar Comunidades
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}