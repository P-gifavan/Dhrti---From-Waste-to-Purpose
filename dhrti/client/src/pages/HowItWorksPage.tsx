import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, BellRing, Handshake, Search, Filter, MessageSquare } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'buyers'>('suppliers');

  const supplierSteps = [
    { icon: PackagePlus, title: 'Create a Listing', desc: 'Detail your available waste (plastic, paper, or metal) including quantity, condition, and location.' },
    { icon: BellRing, title: 'Receive Interest', desc: 'Your listing is broadcasted to our network of verified industrial buyers and recyclers.' },
    { icon: Handshake, title: 'Connect & Close', desc: 'Negotiate and finalize the deal directly through the platform.' },
  ];

  const buyerSteps = [
    { icon: Search, title: 'Browse Listings', desc: 'Explore thousands of active listings from verified waste aggregators and suppliers.' },
    { icon: Filter, title: 'Filter Requirements', desc: 'Narrow down by waste category, condition, quantity, and geographic location.' },
    { icon: MessageSquare, title: 'Contact Suppliers', desc: 'Reach out directly to suppliers to verify quality and arrange logistics.' },
  ];

  const steps = activeTab === 'suppliers' ? supplierSteps : buyerSteps;

  return (
    <div className="pt-24 pb-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            How Dhrti Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A seamless experience designed specifically for the complexities of B2B waste trading.
          </motion.p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-accent rounded-full p-1">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'suppliers' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              For Suppliers
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'buyers' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              For Buyers
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group"
            >
              <div className="text-6xl font-black text-accent/50 absolute top-4 right-6 pointer-events-none transition-transform group-hover:scale-110">
                0{idx + 1}
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 relative z-10">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">{step.title}</h3>
              <p className="text-muted-foreground relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
