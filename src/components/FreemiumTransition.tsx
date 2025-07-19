import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FreemiumTransition() {
  const { trialStatus, tier } = useAuth();
  const navigate = useNavigate();

  if (trialStatus !== 'expired' || tier !== 'freemium') {
    return null;
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg mb-6 shadow-lg border border-yellow-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold">Sua Golden Week terminou.</h2>
          </div>
          <p className="text-gray-300">Você agora está no plano Freemium. Resgate 1 oferta por mês e continue explorando!</p>
        </div>
        <button 
          onClick={() => navigate('/pricing')}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition flex items-center gap-2"
        >
          Ver Planos Premium <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}