import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { aiAnalyticsService } from '../../../services/aiAnalyticsService';

type TimingData = { bestTime: string; busyDays: string; availability: number };

type Props = {
  offerId: string;
};

export default function OptimalTimingWidget({ offerId }: Props) {
  const [data, setData] = useState<TimingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiAnalyticsService.getOptimalTiming(offerId).then(setData).finally(() => setLoading(false));
  }, [offerId]);

  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Carregando...</div>;

  if (!data) return <div className="p-4 bg-white rounded-lg shadow">Nenhum dado disponível</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><Clock className="mr-2" /> Melhor Horário</h3>
      <p>Melhor horário para usar voucher: {data.bestTime} (menos fila)</p>
      <p>Disponibilidade atual: {data.availability}% (boa chance de conseguir mesa)</p>
      <div className="mt-2">
        <p>Dias mais movimentados: {data.busyDays}</p>
      </div>
    </div>
  );
}