/**
 * Página de Recomendações IA
 * Página principal para o sistema de recomendações personalizadas
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import RecommendationAgent from '../components/RecommendationAgent';
import { ProtectedRoute } from '../components/ProtectedRoute';
import DashboardLayout from '../components/Layout/DashboardLayout';

export default function Recommendations() {
  return (
    <ProtectedRoute>
      <Helmet>
        <title>Recomendações IA - DUO PASS Club</title>
        <meta 
          name="description" 
          content="Descubra experiências personalizadas para casais na Suíça com nossa assistente IA Sofia. Recomendações baseadas no seu histórico e preferências." 
        />
        <meta name="keywords" content="recomendações, IA, experiências casais, Suíça, personalizado" />
      </Helmet>
      
      <DashboardLayout title="Recomendações IA">
        <RecommendationAgent />
      </DashboardLayout>
    </ProtectedRoute>
  );
};