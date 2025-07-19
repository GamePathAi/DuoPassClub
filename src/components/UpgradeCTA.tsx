import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Crown } from 'lucide-react';

const UpgradeCTA: React.FC = () => {
  const { trialStatus, tier } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  if (tier === 'premium' || tier === 'golden') {
    return null; // Não mostra CTA se já for assinante
  }

  let title = '';
  let description = '';
  let buttonText = '';

  if (trialStatus === 'active') {
    title = 'Gostando da Golden Week?';
    description = 'Faça o upgrade agora para manter o acesso a todos os benefícios exclusivos e não perca nenhuma experiência.';
    buttonText = 'Fazer Upgrade Agora';
  } else if (tier === 'freemium') {
    title = 'Eleve sua experiência cultural!';
    description = 'Seu acesso é limitado no plano Freemium. Faça o upgrade para o DuoPass Premium e desbloqueie experiências ilimitadas.';
    buttonText = 'Conhecer Planos';
  }

  if (!title) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg my-8 flex flex-col sm:flex-row items-center justify-between shadow-lg">
      <div className="flex items-center mb-4 sm:mb-0">
        <Crown className="w-10 h-10 mr-4 text-white" />
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>
      <Button 
        onClick={handleUpgrade} 
        className="bg-white text-orange-500 hover:bg-gray-100 font-bold transition-transform transform hover:scale-105 shadow-md"
      >
        {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default UpgradeCTA;