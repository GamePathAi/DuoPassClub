import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Crown, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GoldenWeekSection() {
  const { user, trialStatus } = useAuth();
  const [voucherCount, setVoucherCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && trialStatus === 'active') {
      const fetchVoucherCount = async () => {
        const { count, error } = await supabase
          .from('vouchers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao contar vouchers:', error);
        } else {
          setVoucherCount(count ?? 0);
        }
      };

      fetchVoucherCount();
    }
  }, [user, trialStatus]);

  if (trialStatus !== 'active') {
    return null;
  }

  const remainingVouchers = 4 - voucherCount;

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg mb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Sua Golden Week está ativa!</h2>
          </div>
          <p className="text-yellow-100">Você tem acesso a 4 resgates de ofertas Premium. Aproveite!</p>
        </div>
        <button 
          onClick={() => navigate('/pricing')}
          className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition flex items-center gap-2"
        >
          Fazer Upgrade <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-4">
        <div className="w-full bg-yellow-200 rounded-full h-2.5">
          <div 
            className="bg-white h-2.5 rounded-full"
            style={{ width: `${(voucherCount / 4) * 100}%` }}
          ></div>
        </div>
        <p className="text-right text-sm mt-1 font-semibold">
          {voucherCount} de 4 resgates utilizados. Restam {remainingVouchers}!
        </p>
      </div>
    </div>
  );
}