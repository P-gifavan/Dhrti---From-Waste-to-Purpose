import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { listingService } from '../services/listingService';
import { ArrowRight, Recycle, Package, Trash2, Leaf, ShieldCheck, Factory, Users, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { data: recentListingsData, isLoading } = useQuery({
    queryKey: ['recentListings'],
    queryFn: () => listingService.getListings({ limit: 6 }),
  });

  const categories = [
    { title: 'Recyclable Plastic', icon: Recycle, desc: 'PET, HDPE, LDPE, and PVC plastic waste ready for processing.' },
    { title: 'Paper Waste', icon: Package, desc: 'Corrugated cardboard, mixed paper, and newsprint for recycling.' },
    { title: 'Metallic Waste', icon: Trash2, desc: 'Ferrous and non-ferrous metals like aluminum, steel, and copper.' },
  ];

  const stats = [
    { label: 'Suppliers Registered', value: '500+', icon: Users },
    { label: 'Buyers Connected', value: '300+', icon: Factory },
    { label: 'Waste Diverted', value: '10M+ kg', icon: Leaf },
    { label: 'Transactions', value: '2,500+', icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Transform Waste <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Into Opportunity</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Dhrti is the premier B2B marketplace connecting verified waste suppliers with industrial buyers to build a sustainable, circular economy.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/marketplace" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              Explore Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/signup" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all">
              Become a Supplier
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Supported Waste Categories</h2>
            <p className="text-muted-foreground">We facilitate the trade of high-impact recyclable materials.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <cat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <stat.icon className="w-6 h-6 text-primary mb-4 opacity-80" />
                <h4 className="text-4xl font-black mb-2">{stat.value}</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recent Listings</h2>
              <p className="text-muted-foreground">Latest raw materials posted by verified suppliers.</p>
            </div>
            <Link to="/marketplace" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-accent/50 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : recentListingsData?.data?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListingsData.data.map(listing => (
                <div key={listing._id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                      {(listing.wasteCategory ?? 'uncategorized').replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{(listing.quantityKg || 0).toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium font-mono">₹{listing.pricePerKg || 0}/kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{listing.city}, {listing.state}</span>
                    </div>
                  </div>
                  <Link to="/marketplace" className="block w-full py-2.5 text-center bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-accent/30 rounded-2xl">
              <p className="text-muted-foreground">No recent listings found.</p>
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Dhrti */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Dhrti?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">We're building the infrastructure for a circular economy, making waste trading transparent, efficient, and reliable.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Trusted Marketplace', desc: 'Secure platform with verified businesses and transparent pricing.' },
              { title: 'Verified Buyers', desc: 'Connect with reputable manufacturers ready to purchase at scale.' },
              { title: 'Circular Economy', desc: 'Directly contribute to keeping materials in use and out of landfills.' },
              { title: 'End-to-End Support', desc: 'From listing creation to successful delivery, we support your trade.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-6 backdrop-blur-sm">
                <ShieldCheck className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
