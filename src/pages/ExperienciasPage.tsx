import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ExperienciasLanding } from './ExperienciasLanding';

export function ExperienciasPage() {
  const { user } = useAuth();
  
  if (user) {
    // Usuário logado → Redireciona para ofertas personalizadas
    return <Navigate to="/ofertas" replace />;
  } else {
    // Usuário não logado → Landing page pública
    return <ExperienciasLanding />;
  }
}