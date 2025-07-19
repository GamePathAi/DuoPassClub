import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseConfig';
import CategoryBadge from '../components/CategoryBadge';
import { useMembership } from '../hooks/useMembership';
import { ArrowRight, RefreshCw } from 'lucide-react';
import OfferModal from '../components/OfferModal';
import PageNavigation from '../components/PageNavigation';
import { X as ClearIcon } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  price_original: number;
  is_active: boolean;
  image_url?: string;
}

const ExperienciasPage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { membership, loading: membershipLoading, error: membershipError, retry: retryMembership } = useMembership();
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  const retryLoad = () => {
    setError(null);
    loadExperiences();
  };

  const loadExperiences = async () => {
    setLoading(true);
    try {
      setError(null);
      // Definir categorias específicas para "Experiências"  
      const experienceCategories = [ 
        'Gastronomia', 
        'Entretenimento', 
        'Cultura', 
        'Arte', 
        'Música', 
        'Teatro', 
        'Cinema', 
        'Eventos' 
      ]; 
 
      const { data, error: supaError } = await supabase 
        .from('offers') 
        .select('*') 
        .eq('is_active', true) 
        .in('category', experienceCategories) 
        .order('created_at', { ascending: false });

      if (supaError) throw supaError;

      setExperiences(data || []);
      console.log('✅ Experiências culturais carregadas:', data?.length);
    } catch (err) {
      setError('Erro ao carregar experiências. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = experiences.filter(experience =>
    experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    experience.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || membershipLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || membershipError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || membershipError}</p>
        <button 
          onClick={retryLoad}
          className="flex items-center mx-auto px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
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
        <h1 className="text-3xl font-bold mb-2">Experiências Culturais</h1>
        <p className="text-gray-600 mb-6">
          Eventos e experiências imersivas para membros DuoPass
        </p>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Buscar experiências por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma experiência encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <div 
                key={experience.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => setSelectedExperience(experience)}
              >
                {experience.image_url && (
                  <img 
                    src={experience.image_url} 
                    alt={experience.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                  <p className="text-gray-600 mb-4">{experience.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <CategoryBadge category={experience.category} type="experience" />
                    <span className="font-bold text-green-600">CHF {experience.price_original}</span>
                  </div>
                  {membership?.canRedeem ? (
                    <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 flex items-center justify-center">
                      Resgatar Experiência <ArrowRight className="ml-2 h-4 w-4" />
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
      {selectedExperience && (
        <OfferModal 
          offer={selectedExperience} 
          isOpen={!!selectedExperience} 
          onClose={() => setSelectedExperience(null)} 
          type="experience" 
        />
      )}
    </>
  );
}

export default ExperienciasPage;