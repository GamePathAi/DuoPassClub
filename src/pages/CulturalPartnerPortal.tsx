import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Users, Sparkles, Plus, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseConfig';

interface CulturalPartner {
  id: string;
  business_name: string;
  founder_story: string;
  cultural_mission: string;
  contact_name: string;
  email: string;
  business_type: string;
  cultural_category: string;
  address: Record<string, string>;
  ambiance_description: string;
  social_values: string[];
  status: string;
}

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
}

export default function CulturalPartnerPortal() {
  const { user } = useAuth();
  const [partner, setPartner] = useState<CulturalPartner | null>(null);
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [activeTab, setActiveTab] = useState('historia');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [partnerForm, setPartnerForm] = useState({
    business_name: '',
    founder_story: '',
    cultural_mission: '',
    contact_name: '',
    email: '',
    business_type: '',
    cultural_category: '',
    ambiance_description: '',
    social_values: [] as string[]
  });

  // const [experienceForm, setExperienceForm] = useState({
  //   experience_name: '',
  //   story_behind: '',
  //   cultural_value: '',
  //   duo_benefit: '',
  //   original_price: 0,
  //   duo_price: 0,
  //   ambiance_notes: '',
  //   best_for: [] as string[],
  //   cultural_tags: [] as string[],
  //   emotion_tags: [] as string[]
  // });

  const businessTypes = [
    { value: 'cafe_cultural', label: 'Café Cultural' },
    { value: 'restaurante_familia', label: 'Restaurante Familiar' },
    { value: 'atelier_arte', label: 'Ateliê de Arte' },
    { value: 'espaco_bem_estar', label: 'Espaço de Bem-Estar' },
    { value: 'livraria_cafe', label: 'Livraria & Café' },
    { value: 'galeria_arte', label: 'Galeria de Arte' },
    { value: 'casa_shows', label: 'Casa de Shows Intimista' }
  ];

  const culturalCategories = [
    { value: 'gastronomia_autoral', label: 'Gastronomia Autoral' },
    { value: 'arte_local', label: 'Arte Local' },
    { value: 'bem_estar_holistico', label: 'Bem-Estar Holístico' },
    { value: 'musica_ao_vivo', label: 'Música ao Vivo' },
    { value: 'literatura_cafe', label: 'Literatura & Café' },
    { value: 'artesanato_local', label: 'Artesanato Local' },
    { value: 'experiencias_natureza', label: 'Experiências na Natureza' }
  ];

  const socialValues = [
    'sustentabilidade', 'arte_local', 'comercio_justo', 'inclusao_social',
    'preservacao_cultural', 'economia_criativa', 'slow_living', 'mindfulness'
  ];

  // const emotionTags = [
  //   'romance', 'amizade', 'descoberta', 'reflexao', 'celebracao',
  //   'conexao', 'inspiracao', 'tranquilidade', 'aventura', 'nostalgia'
  // ];

  // const bestForOptions = [
  //   'primeiro_encontro', 'amigos_arte', 'reflexao_pessoal', 'celebracao_especial',
  //   'networking_criativo', 'familia_unida', 'momento_romantico', 'descoberta_cultural'
  // ];

  const loadPartnerData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Carregar dados do parceiro
      const { data: partnerData, error: partnerError } = await supabase
        .from('cultural_partners')
        .select('*')
        .eq('email', user.email)
        .single();

      if (partnerError && partnerError.code !== 'PGRST116') {
        console.error('Erro ao carregar parceiro:', partnerError);
      }

      if (partnerData) {
        setPartner(partnerData);
        setPartnerForm({
          business_name: partnerData.business_name || '',
          founder_story: partnerData.founder_story || '',
          cultural_mission: partnerData.cultural_mission || '',
          contact_name: partnerData.contact_name || '',
          email: partnerData.email || '',
          business_type: partnerData.business_type || '',
          cultural_category: partnerData.cultural_category || '',
          ambiance_description: partnerData.ambiance_description || '',
          social_values: partnerData.social_values || []
        });

        // Carregar experiências
        const { data: experiencesData } = await supabase
          .from('cultural_experiences')
          .select('*')
          .eq('partner_id', partnerData.id);

        if (experiencesData) {
          setExperiences(experiencesData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPartnerData();
  }, [loadPartnerData]);

  const savePartnerData = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const partnerData = {
        ...partnerForm,
        address: { street: '', city: '', state: '', zipcode: '' }, // Simplificado para demo
        status: partner ? partner.status : 'pending'
      };

      if (partner) {
        // Atualizar
        const { error } = await supabase
          .from('cultural_partners')
          .update(partnerData)
          .eq('id', partner.id);

        if (error) throw error;
      } else {
        // Criar novo
        const { data, error } = await supabase
          .from('cultural_partners')
          .insert([partnerData])
          .select()
          .single();

        if (error) throw error;
        setPartner(data);
      }

      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar dados.');
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayValue = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando sua história...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 pt-16">
      {/* Header Cultural */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Heart className="w-8 h-8 text-rose-500" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  Portal do Parceiro Cultural
                </h1>
                <p className="text-gray-600">Onde sua história ganha vida</p>
              </div>
            </div>
            {partner && (
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  partner.status === 'approved' ? 'bg-green-100 text-green-800' :
                  partner.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {partner.status === 'approved' ? '✨ Aprovado' :
                   partner.status === 'pending' ? '⏳ Em Análise' : '📋 Rascunho'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          {[
            { id: 'historia', label: 'Sua História', icon: Heart },
            { id: 'experiencias', label: 'Experiências', icon: Sparkles },
            { id: 'metricas', label: 'Impacto Cultural', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conte Sua História */}
        {activeTab === 'historia' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Conte Sua História</h2>
              <p className="text-gray-600">Cada lugar tem uma alma. Qual é a sua?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações Básicas */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do seu espaço cultural
                  </label>
                  <input
                    type="text"
                    value={partnerForm.business_name}
                    onChange={(e) => setPartnerForm({...partnerForm, business_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ex: Café das Letras"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de negócio
                  </label>
                  <select
                    value={partnerForm.business_type}
                    onChange={(e) => setPartnerForm({...partnerForm, business_type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Selecione o tipo</option>
                    {businessTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria cultural
                  </label>
                  <select
                    value={partnerForm.cultural_category}
                    onChange={(e) => setPartnerForm({...partnerForm, cultural_category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Selecione a categoria</option>
                    {culturalCategories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* História e Missão */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    A história por trás do lugar
                  </label>
                  <textarea
                    value={partnerForm.founder_story}
                    onChange={(e) => setPartnerForm({...partnerForm, founder_story: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Como tudo começou? Qual foi a inspiração? O que te motivou a criar este espaço?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sua missão cultural
                  </label>
                  <textarea
                    value={partnerForm.cultural_mission}
                    onChange={(e) => setPartnerForm({...partnerForm, cultural_mission: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Que impacto cultural você quer gerar? Como seu espaço transforma vidas?"
                  />
                </div>
              </div>
            </div>

            {/* Ambiente e Energia */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descreva o ambiente e energia do seu espaço
              </label>
              <textarea
                value={partnerForm.ambiance_description}
                onChange={(e) => setPartnerForm({...partnerForm, ambiance_description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Como as pessoas se sentem quando entram? Que tipo de conversas acontecem? Qual é a magia do lugar?"
              />
            </div>

            {/* Valores Compartilhados */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Valores que compartilhamos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {socialValues.map(value => (
                  <button
                    key={value}
                    onClick={() => toggleArrayValue(
                      partnerForm.social_values, 
                      value, 
                      (arr) => setPartnerForm({...partnerForm, social_values: arr})
                    )}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      partnerForm.social_values.includes(value)
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {value.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={savePartnerData}
                disabled={saving}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar História'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Suas Experiências */}
        {activeTab === 'experiencias' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Suas Experiências Únicas</h2>
                <p className="text-gray-600">Não vendemos produtos, criamos memórias</p>
              </div>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />
                <span>Nova Experiência</span>
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Ainda não há experiências</h3>
                <p className="text-gray-500">Crie sua primeira experiência cultural única</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.map(experience => (
                  <div key={experience.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">{experience.experience_name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{experience.story_behind}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500 line-through">CHF {(experience.original_price * 0.18).toFixed(2)}</span>
                <span className="text-green-600 font-semibold ml-2">CHF {(experience.duo_price * 0.18).toFixed(2)}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        experience.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {experience.active ? 'Ativa' : 'Pausada'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Impacto Cultural */}
        {activeTab === 'metricas' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu Impacto Cultural</h2>
              <p className="text-gray-600">Medimos conexões, não apenas vendas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="w-8 h-8 text-amber-600" />
                  <h3 className="font-semibold text-amber-800">Conexões Criadas</h3>
                </div>
                <div className="text-3xl font-bold text-amber-700 mb-2">12</div>
                <p className="text-amber-600 text-sm">Pessoas se conectaram através das suas experiências</p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-8 h-8 text-rose-600" />
                  <h3 className="font-semibold text-rose-800">Momentos Especiais</h3>
                </div>
                <div className="text-3xl font-bold text-rose-700 mb-2">28</div>
                <p className="text-rose-600 text-sm">Histórias compartilhadas pelos visitantes</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                  <h3 className="font-semibold text-green-800">Impacto Cultural</h3>
                </div>
                <div className="text-3xl font-bold text-green-700 mb-2">4.8</div>
                <p className="text-green-600 text-sm">Avaliação média de impacto cultural</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-rose-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Últimas Histórias Compartilhadas</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-700 italic">"Conheci minha melhor amiga neste café. A energia do lugar nos conectou instantaneamente."</p>
                  <p className="text-sm text-gray-500 mt-2">- Ana, há 3 dias</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-700 italic">"Um lugar que respira arte e acolhimento. Cada visita é uma descoberta."</p>
                  <p className="text-sm text-gray-500 mt-2">- Carlos, há 1 semana</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}