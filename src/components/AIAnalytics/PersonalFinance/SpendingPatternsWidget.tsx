import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { aiAnalyticsService } from '../../../services/aiAnalyticsService';

type PatternData = { peakTime: string; avgTicket: number; frequency: number; bestTime: string };

type Props = {
  userId: string;
};

export default function SpendingPatternsWidget({ userId }: Props) {
  const [data, setData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiAnalyticsService.getSpendingPatterns(userId).then(setData).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Carregando...</div>;

  if (!data) return <div className="p-4 bg-white rounded-lg shadow">Nenhum dado disponível</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><TrendingUp className="mr-2" /> Padrões de Gastos</h3>
      <p>Você gasta mais em experiências: {data.peakTime}</p>
      <p>Seu ticket médio: R${data.avgTicket} (15% acima da média)</p>
      <p>Frequência de compra: {data.frequency}x por semana</p>
      <p>Melhor época para suas compras: {data.bestTime}</p>
    </div>
  );
}