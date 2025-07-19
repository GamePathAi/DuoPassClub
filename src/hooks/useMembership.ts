import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseConfig';
import { useAuth } from '../contexts/AuthContext';

type MembershipTier = 'free' | 'premium' | 'golden';

interface Membership {
  tier: MembershipTier;
  maxOffers: number;
  redeemedThisMonth: number;
  canRedeem: boolean;
}

export const useMembership = () => {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembership = async () => {
      if (!user) {
        setMembership(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Simulação - substituir por query real ao Supabase
        const { data } = await supabase
          .from('user_memberships')
          .select('tier, max_offers, redeemed_count')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setMembership({
            tier: data.tier || 'free',
            maxOffers: data.max_offers || 5,
            redeemedThisMonth: data.redeemed_count || 0,
            canRedeem: (data.redeemed_count || 0) < (data.max_offers || 5)
          });
        } else {
          setMembership({
            tier: 'free',
            maxOffers: 5,
            redeemedThisMonth: 0,
            canRedeem: true
          });
        }
      } catch (err) {
        setError('Erro ao carregar membership');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [user]);

  const retry = () => {
    fetchMembership();
  };

  return { membership, loading, error, retry };
};