import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { aiAnalyticsService } from '../../../services/aiAnalyticsService';

type OptimizationTip = { tip: string };

type Props = {
  offerId: string;
};

export default function ExperienceOptimizerWidget({ offerId }: Props) {
  const [tips, setTips] = useState<OptimizationTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiAnalyticsService.getExperienceOptimization(offerId).then(setTips).finally(() => setLoading(false));
  }, [offerId]);

  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Carregando...</div>;

  if (!tips || tips.length === 0) return <div className="p-4 bg-white rounded-lg shadow">Nenhum dado disponível</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><Star className="mr-2" /> Otimização de Experiências</h3>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-center"><Star className="h-4 w-4 mr-2 text-yellow-500" /> {tip.tip}</li>
        ))}
      </ul>
    </div>
  );
}