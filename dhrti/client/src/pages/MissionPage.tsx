import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, Target } from 'lucide-react';

export const MissionPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Our Mission
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Pioneering the circular economy by making waste trade transparent, efficient, and reliable.
          </motion.p>
        </div>

        <div className="space-y-12">
          <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0">
                <Globe2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Sustainability First</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Millions of tons of recyclable materials end up in landfills every year due to fragmented supply chains. Dhrti bridges the gap between those who generate or collect waste and the industries capable of recycling it, creating a unified digital marketplace.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Goal</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We aim to divert 100 million kilograms of plastic, paper, and metal waste from landfills by 2028. By standardizing listings and verifying businesses, we make sustainable procurement not just an ethical choice, but a financially sound business decision.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
