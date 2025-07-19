import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import MonthlySpendingWidget from './PersonalFinance/MonthlySpendingWidget';
import SavingsInsightsWidget from './PersonalFinance/SavingsInsightsWidget';
import SpendingPatternsWidget from './PersonalFinance/SpendingPatternsWidget';
import SocialInsightsWidget from './Social/SocialInsightsWidget';
import OptimalTimingWidget from './Social/OptimalTimingWidget';
import ExperienceOptimizerWidget from './Social/ExperienceOptimizerWidget';

type Props = {
  userId: string;
  offerId?: string; // Opcional, para MVP usar exemplo
};

export default function AIAnalyticsContainer({ userId, offerId = 'example-offer-id' }: Props) {
  return (
    <ErrorBoundary fallback={<div className="p-8 text-center text-red-500">Erro ao carregar insights. Por favor, tente novamente mais tarde.</div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MonthlySpendingWidget userId={userId} />
        <SavingsInsightsWidget userId={userId} />
        <SpendingPatternsWidget userId={userId} />
        <SocialInsightsWidget userId={userId} />
        <OptimalTimingWidget offerId={offerId} />
        <ExperienceOptimizerWidget offerId={offerId} />
      </div>
    </ErrorBoundary>
  );
}