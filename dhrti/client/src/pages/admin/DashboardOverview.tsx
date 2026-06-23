import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ShieldCheck, Activity } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const DashboardOverview: React.FC = () => {
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getUsers,
  });

  const users = usersData?.data || [];
  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.verificationStatus === 'verified').length;
  const pendingVerifications = users.filter(u => u.verificationStatus === 'pending').length;

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Verified Users</p>
              <h3 className="text-2xl font-bold">{verifiedUsers}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
              <h3 className="text-2xl font-bold">{pendingVerifications}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
