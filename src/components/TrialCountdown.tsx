import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TrialCountdown: React.FC = () => {
  const { trialStatus, trialExpiresAt } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (trialStatus !== 'active' || !trialExpiresAt) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const expiration = new Date(trialExpiresAt);
      const distance = expiration.getTime() - now.getTime();

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('Expirado');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [trialStatus, trialExpiresAt]);

  if (trialStatus !== 'active') {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow-md">
      <p className="font-bold">Sua Golden Week termina em:</p>
      <p className="text-lg">{timeLeft}</p>
    </div>
  );
};

export default TrialCountdown;