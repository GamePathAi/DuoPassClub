import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartData } from '../../hooks/useAnalytics';

interface AnalyticsChartsProps {
  chartData: {
    revenue?: Array<{ month: string; value: number }>;
    users?: Array<{ month: string; value: number }>;
    growth: ChartData[];
    vouchers: Array<{ category: string; value: number; name?: string }>;
    partners: Array<{ category: string; name: string; value: number }>;
    [key: string]: unknown;
  };
}

const COLORS = {
  primary: '#f97316', // Orange
  secondary: '#dc2626', // Red
  accent: '#3b82f6', // Blue
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  info: '#6366f1' // Indigo
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning, COLORS.info];

export default function AnalyticsCharts({ chartData }: AnalyticsChartsProps) {
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {typeof data.value === 'number' && data.value < 1 
              ? `${data.value.toFixed(1)}%` 
              : data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Growth Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Crescimento de Usuários
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.growth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => {
                if (value) {
                  const date = new Date(value);
                  return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
                }
                return value;
              }}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Voucher Performance Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance de Vouchers
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.vouchers}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill={COLORS.accent}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Partner Performance Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Parceiros por Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.partners.slice(0, 8)} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#6b7280" 
              fontSize={12}
              width={100}
              tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill={COLORS.success}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição por Categoria
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.partners.reduce((acc: Array<{ name: string; value: number }>, partner) => {
                const existingCategory = acc.find(item => item.name === partner.category);
                if (existingCategory) {
                  existingCategory.value += 1;
                } else {
                  acc.push({ name: partner.category || 'Outros', value: 1 });
                }
                return acc;
              }, [])}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.partners.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};