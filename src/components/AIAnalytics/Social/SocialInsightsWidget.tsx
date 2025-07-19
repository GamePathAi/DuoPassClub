import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { aiAnalyticsService } from '../../../services/aiAnalyticsService';

type SocialInsight = { friendName: string; activity: string };

type Props = {
  userId: string;
};

export default function SocialInsightsWidget({ userId }: Props) {
  const [insights, setInsights] = useState<SocialInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiAnalyticsService.getFriendActivity(userId).then(setInsights).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Carregando...</div>;

  if (!insights || insights.length === 0) return <div className="p-4 bg-white rounded-lg shadow">Nenhum insight social disponível</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><Users className="mr-2" /> Insights Sociais</h3>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i}>{insight.friendName} {insight.activity}</li>
        ))}
      </ul>
    </div>
  );
}