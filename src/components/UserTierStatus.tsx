import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { Star, Crown, Shield } from 'lucide-react';

const UserTierStatus: React.FC = () => {
  const { tier, trialStatus } = useAuth();

  let tierName = '';
  let tierIcon: React.ReactNode = null;
  let tierColor = '';

  if (trialStatus === 'active') {
    tierName = 'Golden Week Trial';
    tierIcon = <Crown className="w-4 h-4 mr-2" />;
    tierColor = 'bg-yellow-400 text-black';
  } else if (tier === 'freemium') {
    tierName = 'Freemium';
    tierIcon = <Shield className="w-4 h-4 mr-2" />;
    tierColor = 'bg-gray-500 text-white';
  } else if (tier === 'premium') {
    tierName = 'Premium';
    tierIcon = <Star className="w-4 h-4 mr-2" />;
    tierColor = 'bg-blue-500 text-white';
  } else if (tier === 'golden') {
    tierName = 'Golden Member';
    tierIcon = <Crown className="w-4 h-4 mr-2" />;
    tierColor = 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
  }

  if (!tierName) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mb-4">
        <Badge className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center ${tierColor}`}>
            {tierIcon}
            {tierName}
        </Badge>
    </div>
  );
};

export default UserTierStatus;