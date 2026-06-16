import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal, Package, MapPin } from 'lucide-react';
import { listingService } from '../services/listingService';
import type { GetListingsParams } from '../types/listing';
import { ListingModal } from '../components/ListingModal';

export const MarketplacePage: React.FC = () => {
  const [params, setParams] = useState<GetListingsParams>({ page: 1, limit: 12 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  
  // Custom quick debounce inline to avoid missing hook
  useEffect(() => {
    const handler = setTimeout(() => {
      setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useQuery({
    queryKey: ['listings', params],
    queryFn: () => listingService.getListings(params),
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => {
      const newParams = { ...prev, [name]: value, page: 1 };
      if (!value) delete newParams[name as keyof GetListingsParams];
      return newParams;
    });
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground mt-1">Browse available materials from verified suppliers</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search title, city, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold text-lg">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Waste Category</label>
                  <select 
                    name="wasteCategory" 
                    onChange={handleFilterChange}
                    className="w-full rounded-md border border-border py-2 px-3 bg-background text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="recyclable_plastic">Recyclable Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="metal">Metal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <select 
                    name="condition" 
                    onChange={handleFilterChange}
                    className="w-full rounded-md border border-border py-2 px-3 bg-background text-sm"
                  >
                    <option value="">Any Condition</option>
                    <option value="Clean">Clean</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Processed">Processed</option>
                    <option value="Raw">Raw</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Quantity (kg)</label>
                  <input 
                    type="number"
                    name="minQuantity" 
                    onChange={handleFilterChange}
                    placeholder="e.g. 1000"
                    className="w-full rounded-md border border-border py-2 px-3 bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input 
                    type="text"
                    name="state" 
                    onChange={handleFilterChange}
                    placeholder="e.g. Maharashtra"
                    className="w-full rounded-md border border-border py-2 px-3 bg-background text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Grid Area */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 bg-accent/50 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : data?.data?.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.map(listing => (
                    <div key={listing._id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                          {listing.wasteCategory.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {listing.description || 'No description provided.'}
                      </p>

                      <div className="space-y-3 mb-6 bg-accent/30 p-3 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Package className="w-4 h-4" /> Quantity
                          </div>
                          <span className="font-semibold">{listing.quantityKg.toLocaleString()} kg</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="w-4 h-4" /> Location
                          </div>
                          <span className="font-semibold">{listing.city}, {listing.state}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-lg font-bold font-mono">
                          ₹{listing.pricePerKg}<span className="text-sm font-normal text-muted-foreground">/kg</span>
                        </div>
                        <button 
                          onClick={() => setSelectedListing(listing)}
                          className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination && data.pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(data.pagination.page - 1)}
                      disabled={data.pagination.page === 1}
                      className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium">
                      Page {data.pagination.page} of {data.pagination.pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(data.pagination.page + 1)}
                      disabled={data.pagination.page === data.pagination.pages}
                      className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-4">
                <Filter className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No listings found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any listings matching your current filters. Try adjusting your search criteria or selecting a different category.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setParams({ page: 1, limit: 12 });
                  }}
                  className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedListing && (
        <ListingModal 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
        />
      )}
    </div>
  );
};
