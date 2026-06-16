import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, DollarSign, Globe } from 'lucide-react';

export const SuppliersPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Sell on Dhrti
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Unlock new revenue streams by connecting your recyclable materials directly with verified industrial buyers.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Expand Your Reach</h3>
            <p className="text-muted-foreground">Stop relying on local middlemen. Showcase your inventory to a national network of verified manufacturers and recyclers.</p>
          </div>
          
          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Better Margins</h3>
            <p className="text-muted-foreground">Transparent pricing models ensure you get fair market value for your sorted and processed waste.</p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Verified Transactions</h3>
            <p className="text-muted-foreground">Trade with confidence. All buyers on the Dhrti platform undergo stringent verification processes.</p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Market Insights</h3>
            <p className="text-muted-foreground">Gain valuable insights into market demands, pricing trends, and volume requirements to scale your operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
