import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { aiAnalyticsService } from '../../../services/aiAnalyticsService';

type Props = {
  userId: string;
};

export default function MonthlySpendingWidget({ userId }: Props) {
  const [data, setData] = useState<{ total: number; avgTicket: number; topCategory: string; trend: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiAnalyticsService.getMonthlySpending(userId).then(setData).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Carregando...</div>;

  if (!data) return <div className="p-4 bg-white rounded-lg shadow">Nenhum dado disponível</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><BarChart2 className="mr-2" /> Gastos Mensais</h3>
      <p>Você gastou R${data.total} em experiências este mês</p>
      <p>Comparado ao mês passado: {data.trend > 0 ? '+' : ''}{data.trend}% 📈</p>
      <p>Categoria que mais gasta: {data.topCategory} (40%)</p>
      <p>Seu ticket médio: R${data.avgTicket}</p>
      {/* Gráfico simples de barras para últimos 6 meses - simulado */}
      <div className="mt-4 h-32 bg-gray-100 rounded flex items-end justify-around">
        {[100, 150, 120, 200, 180, 245].map((val, i) => (
          <div key={i} className="bg-blue-500 w-8" style={{ height: `${(val / 300) * 100}%` }}></div>
        ))}
      </div>
    </div>
  );
}