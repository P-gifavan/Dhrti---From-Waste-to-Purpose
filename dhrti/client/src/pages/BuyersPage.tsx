import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, PackageSearch, Activity, FileText } from 'lucide-react';

export const BuyersPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Source on Dhrti
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Procure high-quality recyclable materials consistently from verified aggregators and suppliers across the country.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <PackageSearch className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Consistent Supply</h3>
            <p className="text-muted-foreground">Filter thousands of active listings by quantity, quality, and location to ensure your production lines never halt.</p>
          </div>
          
          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Quality Assurance</h3>
            <p className="text-muted-foreground">Suppliers are bound by strict quality standards and transparency requirements, reducing procurement risks.</p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Streamlined Procurement</h3>
            <p className="text-muted-foreground">Manage your sourcing digitally. View listings, negotiate, and track history all from a single dashboard.</p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">ESG Compliance</h3>
            <p className="text-muted-foreground">Easily track your circular economy contributions and diverted waste metrics for ESG reporting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
