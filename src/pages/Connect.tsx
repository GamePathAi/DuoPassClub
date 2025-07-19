import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Community } from '../types/community';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Connect: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'duopass' | 'communities'>('duopass');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        // Mock data to avoid database query
        const mockData: Community[] = [
          {
            id: '1',
            name: 'Arte & Criatividade',
            description: 'Explore galerias, exposições e ateliês. Conecte-se com outros amantes da arte contemporânea e clássica.',
            image_url: '/images/placeholder.png',
            member_count: 123,
          },
          {
            id: '2',
            name: 'Gastronomia & Vinhos',
            description: 'Descubra novos sabores, restaurantes exclusivos e experiências culinárias únicas na cidade.',
            image_url: '/images/placeholder.png',
            member_count: 456,
          },
        ];
        setCommunities(mockData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'communities') {
      fetchCommunities();
    }
  }, [activeTab]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-8">Carregando...</div>;
    }

    if (error) {
      return <div className="text-center p-8 text-red-500">Erro: {error}</div>;
    }

    switch (activeTab) {
      case 'duopass':
        return <div className="p-4">Conteúdo da comunidade DuoPass (Em breve)</div>;
      case 'communities':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {communities.map((community) => (
              <div key={community.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src={community.image_url || '/images/placeholder.png'} alt={community.name} className="w-full h-40 object-cover"/>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{community.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">{community.member_count} membros</span>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Entrar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>DuoPass Connect - Comunidades</title>
        <meta name="description" content="Conecte-se com comunidades e outros membros do DuoPass." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">DuoPass Connect</h1>
          <p className="text-gray-500">Conecte-se, compartilhe e descubra novas experiências.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex space-x-2">
          <button 
            onClick={() => setActiveTab('duopass')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeTab === 'duopass' ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            Comunidade DuoPass
          </button>
          <button 
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeTab === 'communities' ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            Explorar Comunidades
          </button>
        </div>

        <div>
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Connect;