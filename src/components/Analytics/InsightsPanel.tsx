import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  TrendingUp,
  Target,
  Zap,
  Bell,
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb
} from 'lucide-react';
import { BusinessInsight } from '../../services/analytics-agent';

interface InsightsPanelProps {
  insights: BusinessInsight[];
  alerts: BusinessInsight[];
  performanceInsights: BusinessInsight[];
}

export default function InsightsPanel({ 
  insights, 
  alerts, 
  performanceInsights 
}: InsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'performance'>('all');

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      case 'optimization':
        return <Target className="w-4 h-4" />;
      case 'prediction':
        return <Zap className="w-4 h-4" />;
      case 'alert':
        return <Bell className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'text-green-600 bg-green-100';
      case 'optimization':
        return 'text-orange-600 bg-orange-100';
      case 'prediction':
        return 'text-purple-600 bg-purple-100';
      case 'alert':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayInsights = () => {
    switch (activeTab) {
      case 'alerts':
        return alerts;
      case 'performance':
        return performanceInsights;
      default:
        return insights;
    }
  };

  const InsightCard: React.FC<{ insight: BusinessInsight; index: number }> = ({ insight, index }) => {
    const isExpanded = expandedInsight === insight.id;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`border-l-4 rounded-lg p-4 mb-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          getPriorityColor(insight.priority_level)
        }`}
        onClick={() => setExpandedInsight(isExpanded ? null : insight.id || null)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {getPriorityIcon(insight.priority_level)}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                getTypeColor(insight.insight_type)
              }`}>
                {getTypeIcon(insight.insight_type)}
                <span className="capitalize">{insight.insight_type}</span>
              </div>
              {insight.confidence_score && (
                <div className="text-xs text-gray-500">
                  Confiança: {(insight.confidence_score * 100).toFixed(0)}%
                </div>
              )}
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-2">
              {insight.title}
            </h4>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              {isExpanded ? insight.description : `${insight.description.substring(0, 150)}...`}
            </p>
            
            <AnimatePresence>
              {isExpanded && insight.recommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-white rounded-lg border border-gray-200"
                >
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-orange-500" />
                    Recomendações
                  </h5>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {insight.recommendations}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {insight.created_at && formatDate(insight.created_at)}
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {insight.affected_metrics && insight.affected_metrics.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {insight.affected_metrics.map((metric, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header with tabs */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Insights de Negócio
        </h2>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todos ({insights.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Alertas ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Performance ({performanceInsights.length})
          </button>
        </div>
      </div>
      
      {/* Insights content */}
      <div className="p-6">
        {getDisplayInsights().length > 0 ? (
          <div className="space-y-4">
            {getDisplayInsights().map((insight, index) => (
              <InsightCard
                key={insight.id || index}
                insight={insight}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum insight disponível
            </h3>
            <p className="text-gray-600">
              Execute uma nova análise para gerar insights atualizados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;