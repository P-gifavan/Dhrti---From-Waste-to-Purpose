import React from 'react';
import { ShoppingCart, Award, TrendingDown, Scale } from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Buyer Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Settle buy orders, trace supply sources, and review ESG carbon offsets.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Procured Material</span>
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">84 Tons</div>
          <p className="text-[10px] text-muted-foreground">HDPE and clear PET flakes</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Active Bids</span>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">5 Bids</div>
          <p className="text-[10px] text-muted-foreground">Across 3 regional suppliers</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Avg Price Paid</span>
            <TrendingDown className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">$595 / Ton</div>
          <p className="text-[10px] text-emerald-600 font-semibold">-4% vs market index</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Sustainability Score</span>
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">Grade A</div>
          <p className="text-[10px] text-muted-foreground">100% supply trace reports</p>
        </div>
      </div>

      {/* Main Content Area Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-foreground mb-2">My Procurement Pipeline (Placeholder)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track listings you have bid on, material weights audited at loading bays, and active shipping logs directly.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mt-4 border-t border-border pt-4">
            Component State: Locked / Phase 1 Skeleton
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-foreground mb-2">ESG Offset Certificates (Placeholder)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When trades are audited, blockchain-verified traceability documents and carbon-saving logs will become downloadable here.
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
