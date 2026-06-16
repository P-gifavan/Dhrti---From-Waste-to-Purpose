import React from 'react';
import { Package, Coins, BarChart3, Scale } from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Seller Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage waste material listings, check offers, and view trade metrics.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Active Listings</span>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">12</div>
          <p className="text-[10px] text-muted-foreground">HDPE, PP, and LDPE</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Sold (PCR)</span>
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">148 Tons</div>
          <p className="text-[10px] text-emerald-600 font-semibold">+18% vs last month</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Revenue Held</span>
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">$64,520</div>
          <p className="text-[10px] text-muted-foreground">Secured in escrow</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Offer Conversion</span>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">84.2%</div>
          <p className="text-[10px] text-muted-foreground">Based on negotiation records</p>
        </div>
      </div>

      {/* Main Content Area Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-foreground mb-2">Recent Offers Received (Placeholder)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When buyers offer bids on your listings, you will see a detailed log of price offers, volume requests, and shipping conditions here.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mt-4 border-t border-border pt-4">
            Component State: Locked / Phase 1 Skeleton
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-foreground mb-2">Logistics Dispatch (Placeholder)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pending pick-up bookings, dispatch confirmations, and weight bills can be checked and authorized in this pane.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mt-4 border-t border-border pt-4">
            Component State: Locked / Phase 1 Skeleton
          </span>
        </div>
      </div>
    </div>
  );
};
