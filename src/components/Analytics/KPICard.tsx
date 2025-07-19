import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Ticket, 
  UserCheck, 
  Store, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  LucideIcon
} from 'lucide-react';
import { KPICard as KPICardType } from '../../hooks/useAnalytics';

interface KPICardProps {
  card: KPICardType;
  index: number;
}

const iconMap: Record<string, LucideIcon> = {
  Users,
  Ticket,
  UserCheck,
  Store
};

export default function KPICard({ card, index }: KPICardProps) {
  const IconComponent = iconMap[card.icon] || Users;
  
  const getTrendIcon = () => {
    switch (card.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const getTrendColor = () => {
    switch (card.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header with icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        {card.change !== undefined && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {card.change > 0 ? '+' : ''}{card.change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Title */}
      <h3 className="text-gray-600 text-sm font-medium mb-2">
        {card.title}
      </h3>
      
      {/* Value */}
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-gray-900">
          {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
        </span>
      </div>
      
      {/* Trend indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Comparado ao período anterior</span>
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <span className="font-medium">
              {card.trend === 'up' ? 'Crescimento' : card.trend === 'down' ? 'Declínio' : 'Estável'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;