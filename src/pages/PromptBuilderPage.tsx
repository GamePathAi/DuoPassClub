import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { PromptBuilder } from '../components/PromptBuilder';

export default function PromptBuilderPage() {
  return (
    <>
      <Helmet>
        <title>Prompt Builder Inteligente - DuoPass Club</title>
        <meta name="description" content="Ferramenta inteligente para análise e solução rápida de problemas técnicos durante demos para investidores." />
        <meta name="keywords" content="prompt builder, demo, investidores, análise técnica, soluções rápidas" />
      </Helmet>
      
      <DashboardLayout title="Prompt Builder">
        <PromptBuilder />
      </DashboardLayout>
    </>
  );
};