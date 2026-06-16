import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { sellerService } from '../../services/sellerService';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'];

export const Analytics: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['sellerAnalytics'],
    queryFn: sellerService.getAnalytics,
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;
  }

  const analytics = data?.data;

  if (!analytics || analytics.totalListings === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">No Data Available</h2>
        <p className="text-muted-foreground">Create some listings to start seeing your analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualize your listings and inventory distribution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Listings by Category */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="font-bold mb-6">Listings by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.listingsByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quantity by Category */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="font-bold mb-6">Quantity by Category (kg)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.quantityByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.quantityByCategory.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="font-bold mb-6">Listing Status Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" opacity={0.2} />
                <XAxis type="number" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
