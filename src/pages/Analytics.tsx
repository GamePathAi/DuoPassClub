import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  RefreshCw,
  Calendar,
  Download,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import KPICard from '../components/Analytics/KPICard';
import AnalyticsCharts from '../components/Analytics/AnalyticsCharts';
import InsightsPanel from '../components/Analytics/InsightsPanel';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/Layout/DashboardLayout';

export default function BusinessAnalytics() {
  const {
    loading,
    error,
    refreshing,
    selectedPeriod,
    hasAccess,
    lastUpdated,
    kpiCards,
    chartData,
    alerts,
    performanceInsights,
    insights,
    setSelectedPeriod,
    runAnalysis,
  } = useAnalytics();

  // Redirect if user doesn't have access
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  const periodOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'yearly', label: 'Anual' }
  ] as const;

  const handleRefresh = async () => {
    await runAnalysis();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality to be implemented');
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Analytics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 rounded-lg mb-8">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Analytics DUO PASS
                  </h1>
                  <p className="text-sm text-gray-600">
                    Business Intelligence & Insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
              {lastUpdated && (
                <div className="text-xs text-gray-500">
                  Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
                </div>
              )}
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-md hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Analisando...' : 'Atualizar'}</span>
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d' | '1y')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">
                {alerts.length} alerta{alerts.length > 1 ? 's' : ''} crítico{alerts.length > 1 ? 's' : ''}
              </span>
            </motion.div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">{error}</span>
            </div>
          </motion.div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <KPICard key={card.title} card={card} index={index} />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Insights Ativos
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {insights.length}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {performanceInsights.length}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Alertas
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {alerts.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="mb-8">
          <AnalyticsCharts chartData={chartData} />
        </div>

        {/* Insights Panel */}
        <InsightsPanel
          insights={insights}
          alerts={alerts}
          performanceInsights={performanceInsights}
        />
      </div>
    </DashboardLayout>
  );
};

export default BusinessAnalytics;