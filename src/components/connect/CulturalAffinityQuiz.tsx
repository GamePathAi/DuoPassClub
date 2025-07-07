import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Compass, 
  Heart, 
  MapPin, 
  Star,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabaseConfig';
import { useAuth } from '../../contexts/AuthContext';

interface UserAffinity {
  id: string;
  user_id: string;
  preferred_time: string;
  cultural_frequency: string;
  budget_range: string;
  group_size_preference: string;
  discovery_style: string;
  primary_interests: string[];
  preferred_location: string;
  available_days: string[];
  social_style: string;
  experience_level: string;
  created_at: string;
  updated_at: string;
}

interface CulturalAffinityQuizProps {
  onComplete: (affinity: UserAffinity) => void;
  existingAffinity?: UserAffinity | null;
  onCancel?: () => void;
}

interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  type: 'single' | 'multiple' | 'days';
  options: { value: string; label: string; description?: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: 'preferred_time',
    title: 'Quando você prefere suas experiências culturais?',
    subtitle: 'Escolha o período que mais combina com você',
    icon: Clock,
    type: 'single',
    options: [
      { value: 'morning', label: 'Manhã', description: 'Até 12h' },
      { value: 'afternoon', label: 'Tarde', description: '12h às 18h' },
      { value: 'evening', label: 'Noite', description: 'Após 18h' },
      { value: 'flexible', label: 'Flexível', description: 'Qualquer horário' }
    ]
  },
  {
    id: 'cultural_frequency',
    title: 'Com que frequência você busca experiências culturais?',
    subtitle: 'Nos ajude a entender seu ritmo',
    icon: Calendar,
    type: 'single',
    options: [
      { value: 'daily', label: 'Diariamente', description: 'Sempre em busca de algo novo' },
      { value: 'weekly', label: 'Semanalmente', description: 'Fins de semana culturais' },
      { value: 'monthly', label: 'Mensalmente', description: 'Experiências especiais' },
      { value: 'occasionally', label: 'Ocasionalmente', description: 'Quando surge oportunidade' }
    ]
  },
  {
    id: 'budget_range',
    title: 'Qual seu orçamento típico para experiências culturais?',
    subtitle: 'Por pessoa, por experiência',
    icon: DollarSign,
    type: 'single',
    options: [
      { value: 'low', label: 'Até CHF 9.-', description: 'Experiências acessíveis' },
    { value: 'medium', label: 'CHF 9.- - CHF 27.-', description: 'Investimento moderado' },
    { value: 'high', label: 'CHF 27.- - CHF 54.-', description: 'Experiências premium' },
    { value: 'luxury', label: 'Acima de CHF 54.-', description: 'Sem limites para cultura' }
    ]
  },
  {
    id: 'group_size_preference',
    title: 'Como você prefere vivenciar a cultura?',
    subtitle: 'Tamanho ideal do grupo',
    icon: Users,
    type: 'single',
    options: [
      { value: 'solo', label: 'Sozinho(a)', description: 'Momentos de introspecção' },
      { value: 'couple', label: 'Em dupla', description: 'Experiências íntimas' },
      { value: 'small_group', label: 'Grupo pequeno', description: '3-6 pessoas' },
      { value: 'large_group', label: 'Grupo grande', description: '7+ pessoas' }
    ]
  },
  {
    id: 'discovery_style',
    title: 'Como você gosta de descobrir novas experiências?',
    subtitle: 'Seu estilo de exploração',
    icon: Compass,
    type: 'single',
    options: [
      { value: 'planned', label: 'Planejado', description: 'Pesquiso e organizo com antecedência' },
      { value: 'spontaneous', label: 'Espontâneo', description: 'Decido na hora' },
      { value: 'recommended', label: 'Por indicação', description: 'Confio em recomendações' },
      { value: 'mixed', label: 'Misto', description: 'Depende da ocasião' }
    ]
  },
  {
    id: 'primary_interests',
    title: 'Quais são seus principais interesses culturais?',
    subtitle: 'Escolha até 3 opções',
    icon: Heart,
    type: 'multiple',
    options: [
      { value: 'arte', label: 'Arte & Design', description: 'Museus, galerias, exposições' },
      { value: 'gastronomia', label: 'Gastronomia', description: 'Restaurantes, degustações, culinária' },
      { value: 'musica', label: 'Música', description: 'Shows, concertos, festivais' },
      { value: 'bem-estar', label: 'Bem-estar', description: 'Spas, retiros, mindfulness' },
      { value: 'cultura', label: 'Cultura Local', description: 'História, tradições, patrimônio' }
    ]
  },
  {
    id: 'preferred_location',
    title: 'Onde você prefere suas experiências culturais?',
    subtitle: 'Localização ideal',
    icon: MapPin,
    type: 'single',
    options: [
      { value: 'São Paulo - SP', label: 'São Paulo - SP', description: 'Centro cultural do país' },
      { value: 'Rio de Janeiro - RJ', label: 'Rio de Janeiro - RJ', description: 'Cidade maravilhosa' },
      { value: 'Belo Horizonte - MG', label: 'Belo Horizonte - MG', description: 'Capital mineira' },
      { value: 'Porto Alegre - RS', label: 'Porto Alegre - RS', description: 'Sul do Brasil' },
      { value: 'Outras', label: 'Outras cidades', description: 'Especificar depois' }
    ]
  },
  {
    id: 'available_days',
    title: 'Quais dias você tem mais disponibilidade?',
    subtitle: 'Selecione todos que se aplicam',
    icon: Calendar,
    type: 'days',
    options: [
      { value: 'monday', label: 'Segunda' },
      { value: 'tuesday', label: 'Terça' },
      { value: 'wednesday', label: 'Quarta' },
      { value: 'thursday', label: 'Quinta' },
      { value: 'friday', label: 'Sexta' },
      { value: 'saturday', label: 'Sábado' },
      { value: 'sunday', label: 'Domingo' }
    ]
  },
  {
    id: 'social_style',
    title: 'Como você se descreveria socialmente?',
    subtitle: 'Seu perfil social',
    icon: Users,
    type: 'single',
    options: [
      { value: 'introvert', label: 'Introvertido(a)', description: 'Prefiro grupos menores e conversas profundas' },
      { value: 'extrovert', label: 'Extrovertido(a)', description: 'Adoro conhecer pessoas e grandes grupos' },
      { value: 'ambivert', label: 'Ambivertido(a)', description: 'Depende do momento e contexto' }
    ]
  },
  {
    id: 'experience_level',
    title: 'Como você se considera em relação à cultura?',
    subtitle: 'Seu nível de experiência',
    icon: Star,
    type: 'single',
    options: [
      { value: 'beginner', label: 'Iniciante', description: 'Começando a explorar' },
      { value: 'intermediate', label: 'Intermediário', description: 'Tenho alguma experiência' },
      { value: 'advanced', label: 'Avançado', description: 'Sou bem experiente' },
      { value: 'expert', label: 'Especialista', description: 'Conheço muito sobre cultura' }
    ]
  }
];

export function CulturalAffinityQuiz({ onComplete, existingAffinity, onCancel }: CulturalAffinityQuizProps) {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(() => {
    if (existingAffinity) {
      return {
        preferred_time: existingAffinity.preferred_time,
        cultural_frequency: existingAffinity.cultural_frequency,
        budget_range: existingAffinity.budget_range,
        group_size_preference: existingAffinity.group_size_preference,
        discovery_style: existingAffinity.discovery_style,
        primary_interests: existingAffinity.primary_interests,
        preferred_location: existingAffinity.preferred_location,
        available_days: existingAffinity.available_days,
        social_style: existingAffinity.social_style,
        experience_level: existingAffinity.experience_level
      };
    }
    return {};
  });
  const [loading, setLoading] = useState(false);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[question.id] !== undefined;

  const handleAnswer = (value: string) => {
    if (question.type === 'multiple') {
      const currentAnswers = answers[question.id] || [];
      if (currentAnswers.includes(value)) {
        setAnswers(prev => ({
          ...prev,
          [question.id]: currentAnswers.filter((v: string) => v !== value)
        }));
      } else if (currentAnswers.length < 3) {
        setAnswers(prev => ({
          ...prev,
          [question.id]: [...currentAnswers, value]
        }));
      }
    } else if (question.type === 'days') {
      const currentDays = answers[question.id] || [];
      if (currentDays.includes(value)) {
        setAnswers(prev => ({
          ...prev,
          [question.id]: currentDays.filter((v: string) => v !== value)
        }));
      } else {
        setAnswers(prev => ({
          ...prev,
          [question.id]: [...currentDays, value]
        }));
      }
    } else {
      setAnswers(prev => ({ ...prev, [question.id]: value }));
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const affinityData = {
        user_id: user.id,
        preferred_time: answers.preferred_time,
        cultural_frequency: answers.cultural_frequency,
        budget_range: answers.budget_range,
        group_size_preference: answers.group_size_preference,
        discovery_style: answers.discovery_style,
        primary_interests: answers.primary_interests || [],
        preferred_location: answers.preferred_location,
        available_days: answers.available_days || [],
        social_style: answers.social_style,
        experience_level: answers.experience_level
      };

      let result;
      if (existingAffinity) {
        // Atualizar existente
        result = await supabase
          .from('cultural_affinities')
          .update(affinityData)
          .eq('id', existingAffinity.id)
          .select()
          .single();
      } else {
        // Criar novo
        result = await supabase
          .from('cultural_affinities')
          .insert(affinityData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      onComplete(result.data);
    } catch (error) {
      console.error('Erro ao salvar afinidades:', error);
      alert('Erro ao salvar suas preferências. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const Icon = question.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#C91F1F] to-[#F6C100] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {existingAffinity ? 'Atualizar Perfil Cultural' : 'Perfil Cultural'}
                </h1>
                <p className="text-sm text-gray-500">
                  Questão {currentQuestion + 1} de {questions.length}
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="pb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#C91F1F] to-[#F6C100] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Question Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C91F1F] to-[#F6C100] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {question.title}
            </h2>
            <p className="text-gray-600">
              {question.subtitle}
            </p>
            {question.type === 'multiple' && (
              <p className="text-sm text-[#C91F1F] mt-2">
                Selecione até 3 opções
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = question.type === 'multiple' || question.type === 'days'
                ? (answers[question.id] || []).includes(option.value)
                : answers[question.id] === option.value;
              
              const isDisabled = question.type === 'multiple' && 
                !isSelected && 
                (answers[question.id] || []).length >= 3;

              return (
                <button
                  key={option.value}
                  onClick={() => !isDisabled && handleAnswer(option.value)}
                  disabled={isDisabled}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-[#C91F1F] bg-red-50 text-[#C91F1F]'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 hover:border-[#C91F1F] hover:bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-[#C91F1F] flex-shrink-0 ml-3" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestion === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                canProceed && !loading
                  ? 'bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <span>{isLastQuestion ? 'Finalizar' : 'Próxima'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}