import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { buyerService } from '../../services/buyerService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7'];

export const Analytics: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['buyerAnalytics'],
    queryFn: buyerService.getAnalytics,
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading Analytics...</div>;

  const analytics = data?.data;

  if (!analytics || analytics.totalRequests === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Procurement Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Visual insights into your purchasing behavior.</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-10 text-center shadow-sm">
          <p className="text-muted-foreground">No data available. Make some procurement requests to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Procurement Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Visual insights into your purchasing behavior.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantity by Category */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Quantity Sourced by Category (kg)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.quantityByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.quantityByCategory.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests by Category */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Total Requests by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.requestsByCategory} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" opacity={0.2} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {analytics.requestsByCategory.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-lg mb-6">Order Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip cursor={{ fill: '#8884d8', opacity: 0.1 }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {analytics.statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'pending' ? '#eab308' : 
                        entry.name === 'accepted' ? '#3b82f6' : 
                        entry.name === 'completed' ? '#22c55e' : 
                        '#ef4444'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
