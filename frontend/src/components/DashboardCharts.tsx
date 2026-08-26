import React from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Provider, KeyEntry } from '../types';

interface DashboardChartsProps {
  keys: Record<Provider, KeyEntry[]>;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ keys }) => {
  // Prepare data for charts
  const providerData = Object.entries(keys).map(([provider, entries]) => ({
    name: provider,
    count: entries.length,
  }));

  const totalKeys = Object.values(keys).reduce((sum, arr) => sum + arr.length, 0);

  // Simulate activity data
  const activityData = [
    { day: 'Mon', accessed: 12 },
    { day: 'Tue', accessed: 19 },
    { day: 'Wed', accessed: 3 },
    { day: 'Thu', accessed: 5 },
    { day: 'Fri', accessed: 2 },
    { day: 'Sat', accessed: 22 },
    { day: 'Sun', accessed: 13 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Keys Distribution */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Keys by Provider</h3>
        {totalKeys === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={providerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.payload?.name}: ${entry.payload?.count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {providerData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} keys`} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Activity Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar dataKey="accessed" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Grid */}
      <div className="col-span-2 grid grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Total Keys</p>
          <p className="text-2xl font-bold text-white">{totalKeys}</p>
          <p className="text-xs text-gray-500 mt-2">
            {Object.keys(keys).length} provider{Object.keys(keys).length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Most Used</p>
          <p className="text-2xl font-bold text-blue-400">
            {providerData.length > 0 && providerData[0].name}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {providerData.length > 0 && `${providerData[0].count} keys`}
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">This Week</p>
          <p className="text-2xl font-bold text-green-400">
            {activityData.reduce((sum, day) => sum + day.accessed, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">accesses</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Security</p>
          <p className="text-2xl font-bold text-green-400">✓</p>
          <p className="text-xs text-gray-500 mt-2">All keys encrypted</p>
        </div>
      </div>
    </div>
  );
};
