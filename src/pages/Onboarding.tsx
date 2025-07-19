import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrialOnboardingModal from '../components/modals/TrialOnboardingModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleOnboardingComplete = async (interests: string[]) => {
    if (!user || !userProfile) return;

    try {
      // 1. Atualizar o perfil do usuário com os interesses
      const { error } = await supabase
        .from('profiles')
        .update({ 
          cultural_interests: interests,
          onboarding_completed: true 
        })
        .eq('id', user.id);

      if (error) throw error;

      // 2. Atualizar o perfil no AuthContext
      await refreshUserProfile();

      // 3. Redirecionar para o dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Erro ao completar o onboarding:', error);
      // Opcional: mostrar uma mensagem de erro para o usuário
    }
  };

  // Se o onboarding já foi concluído, redireciona para o dashboard
  useEffect(() => {
    if (userProfile?.onboarding_completed) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  // Se não houver usuário, talvez redirecionar para o login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900">
      <TrialOnboardingModal onComplete={handleOnboardingComplete} />
    </div>
  );
}