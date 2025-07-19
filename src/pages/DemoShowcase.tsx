import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Clock,
  Users,
  BarChart3,
  Crown,
  Rocket
} from 'lucide-react';

type DemoStep = 
  | 'intro'
  | 'client_login'
  | 'client_qr'
  | 'client_gamification'
  | 'client_notifications'
  | 'partner_analytics'
  | 'partner_offers'
  | 'partner_reports'
  | 'partner_communication'
  | 'admin_overview'
  | 'admin_automation'
  | 'admin_crm'
  | 'admin_expansion'
  | 'tech_highlights'
  | 'value_proposition'
  | 'call_to_action';

interface DemoShowcaseProps {
  className?: string;
}

export default function DemoShowcase({ className = '' }: DemoShowcaseProps) {
  const [currentStep, setCurrentStep] = useState<DemoStep>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [stepProgress, setStepProgress] = useState(0);

  // Auto-advance timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
        
        setStepProgress(prev => {
          if (prev >= 100) {
            nextStep();
            return 0;
          }
          return prev + (100 / 30); // 30 seconds per step
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, nextStep]);

  // Auto-advance to next step
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying) {
      timer = setTimeout(() => {
        nextStep();
      }, 30000); // 30 seconds per step
    }
    
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, nextStep]);

  const playDemo = () => setIsPlaying(true);
  const pauseDemo = () => setIsPlaying(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = useCallback(() => {
    const steps: DemoStep[] = [
      'intro',
      'client_login',
      'client_qr',
      'client_gamification',
      'client_notifications',
      'partner_analytics',
      'partner_offers',
      'partner_reports',
      'partner_communication',
      'admin_overview',
      'admin_automation',
      'admin_crm',
      'admin_expansion',
      'tech_highlights',
      'value_proposition',
      'call_to_action'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setStepProgress(0);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep]);

  const prevStep = () => {
    const steps: DemoStep[] = [
      'intro',
      'client_login',
      'client_qr',
      'client_gamification',
      'client_notifications',
      'partner_analytics',
      'partner_offers',
      'partner_reports',
      'partner_communication',
      'admin_overview',
      'admin_automation',
      'admin_crm',
      'admin_expansion',
      'tech_highlights',
      'value_proposition',
      'call_to_action'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setStepProgress(0);
    }
  };

  const resetDemo = () => {
    setCurrentStep('intro');
    setTimeRemaining(600);
    setIsPlaying(false);
    setStepProgress(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <div className="text-center space-y-8 p-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DuoPass Enterprise
              </h1>
              <p className="text-2xl text-gray-600">
                A Plataforma que Opera como 100 Pessoas com Equipe de 6
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900">Experiência Cliente</h3>
                <p className="text-sm text-blue-700 mt-2">Gamificação + QR + Notificações</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-green-900">Painel Comerciante</h3>
                <p className="text-sm text-green-700 mt-2">Analytics + Controle + ROI</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-purple-900">Dashboard Admin</h3>
                <p className="text-sm text-purple-700 mt-2">Automação + CRM + IA</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <Rocket className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-orange-900">Escalabilidade</h3>
                <p className="text-sm text-orange-700 mt-2">95% Automação Operacional</p>
              </div>
            </div>
          </div>
        );

      case 'call_to_action':
        return (
          <div className="text-center space-y-8 p-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900">
                🚀 Pronto para Transformar seu Negócio?
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Junte-se a centenas de empresas que já descobriram o poder da automação inteligente
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all">
                Começar Agora - Grátis
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-400 transition-all">
                Agendar Demo Personalizada
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">95%</div>
                <div className="text-gray-600">Redução Operacional</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">300%</div>
                <div className="text-gray-600">Aumento Engajamento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">ROI 500%</div>
                <div className="text-gray-600">Retorno Investimento</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">🎯 ROTEIRO DE DEMONSTRAÇÃO</h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-bold mb-2">1️⃣ Cliente (3 min)</h3>
                <ul className="text-sm space-y-1">
                  <li>• Login & Gamificação</li>
                  <li>• QR Scanner Real</li>
                  <li>• Notificações Push</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">2️⃣ Parceiro (3 min)</h3>
                <ul className="text-sm space-y-1">
                  <li>• Analytics Avançados</li>
                  <li>• Gestão de Ofertas</li>
                  <li>• Relatórios ROI</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">3️⃣ Admin (3 min)</h3>
                <ul className="text-sm space-y-1">
                  <li>• CRM Integrado</li>
                  <li>• Automações IA</li>
                  <li>• Expansão Mercado</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">4️⃣ Técnico (1 min)</h3>
                <ul className="text-sm space-y-1">
                  <li>• 95% Automação</li>
                  <li>• Geolocalização IA</li>
                  <li>• Pagamentos PIX</li>
                  <li>• Sugestões IA</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 pt-16 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Demo Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">DuoPass Enterprise Demo</h1>
            <div className="flex items-center space-x-2 text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={isPlaying ? pauseDemo : playDemo}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span>{isPlaying ? 'Pausar' : 'Iniciar'}</span>
            </button>
            
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Anterior</span>
            </button>
            
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <SkipForward className="h-5 w-5" />
              <span>Próximo</span>
            </button>
            
            <button
              onClick={resetDemo}
              className="flex items-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reiniciar</span>
            </button>
          </div>
          
          <div className="text-center text-gray-600">
            <p className="text-lg font-medium mb-2">Etapa Atual: {currentStep.replace('_', ' ').toUpperCase()}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Demo Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}