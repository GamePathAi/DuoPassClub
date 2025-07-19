import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Offer } from '../types';

export function useExperiences() {
  const [experiences, setExperiences] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('offers')
        .select('*, merchant:merchants(business_name, contact_info)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(`Erro ao buscar experiências: ${supabaseError.message}`);
      }

      if (data) {
        setExperiences(data as Offer[]);
      } else {
        setExperiences([]);
      }
    } catch (err: any) {
      console.error('Erro inesperado ao buscar experiências:', err);
      setError(err.message || 'Ocorreu um erro inesperado.');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, loading, error, refetch: fetchExperiences };
}