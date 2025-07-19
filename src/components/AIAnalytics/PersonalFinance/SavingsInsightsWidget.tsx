import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { aiAnalyticsService } from '../../../services/aiAnalyticsService';

type SavingsInsight = { description: string; amount: number };

type Props = {
  userId: string;
};

export default function SavingsInsightsWidget({ userId }: Props) {
  const [insights, setInsights] = useState<SavingsInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiAnalyticsService.getSavingsOpportunities(userId).then(setInsights).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Carregando...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><DollarSign className="mr-2" /> Sugestões de Economia</h3>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="flex justify-between items-center">
            <span>{insight.description}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">R${insight.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}