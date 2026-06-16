import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, CheckCircle, TrendingUp, Bookmark, Activity } from 'lucide-react';
import { buyerService } from '../../services/buyerService';
import { Link } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['buyerAnalytics'],
    queryFn: buyerService.getAnalytics,
  });

  const { data: savedListings, isLoading: savedLoading } = useQuery({
    queryKey: ['savedListings'],
    queryFn: buyerService.getSavedListings,
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['buyerRequests'],
    queryFn: buyerService.getRequests,
  });

  const summary = analytics?.data?.summary || { pending: 0, accepted: 0, completed: 0, rejected: 0 };
  const totalRequests = analytics?.data?.totalRequests || 0;
  const savedCount = savedListings?.data?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Buyer Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your procurement requests and saved materials.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Requests</span>
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analyticsLoading ? '-' : totalRequests}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Accepted</span>
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analyticsLoading ? '-' : summary.accepted}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Completed</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analyticsLoading ? '-' : summary.completed}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Saved Listings</span>
            <Bookmark className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {savedLoading ? '-' : savedCount}
          </div>
        </div>
      </div>

      {/* Recent Activity Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-accent/20">
            <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Procurement Requests
            </h3>
            <Link to="/buyer/requests" className="text-xs text-primary font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80">
            {requestsLoading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : requests?.data?.length ? (
              <ul className="divide-y divide-border">
                {requests.data.slice(0, 5).map(req => (
                  <li key={req._id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium">{req.listingId?.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' :
                        req.status === 'accepted' ? 'bg-blue-500/10 text-blue-600' :
                        req.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>Supplier: {req.sellerId?.companyName || req.sellerId?.fullName}</span>
                      <span>{req.quantityKg} kg</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">No recent requests found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
