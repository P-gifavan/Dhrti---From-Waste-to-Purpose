import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkMinus, MapPin, Tag } from 'lucide-react';
import { buyerService } from '../../services/buyerService';

export const SavedListings: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['savedListings'],
    queryFn: buyerService.getSavedListings,
  });

  const removeMutation = useMutation({
    mutationFn: buyerService.removeSavedListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedListings'] });
    },
  });

  const handleRemove = (id: string) => {
    removeMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Saved Listings</h1>
        <p className="text-sm text-muted-foreground mt-1">Listings you've bookmarked from the marketplace.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading saved listings...</div>
      ) : data?.data?.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center shadow-sm">
          <BookmarkMinus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold">No saved listings</h3>
          <p className="text-sm text-muted-foreground mt-1">Browse the marketplace and bookmark listings you're interested in.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((listing) => (
            <div key={listing._id} className="group bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                  <button 
                    onClick={() => handleRemove(listing._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    title="Remove from saved"
                  >
                    <BookmarkMinus className="h-5 w-5" />
                  </button>
                </div>
                
                <span className="inline-block px-2.5 py-1 bg-accent rounded-md text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  {listing.wasteCategory.replace('_', ' ')}
                </span>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Tag className="w-4 h-4" /> {listing.quantityKg.toLocaleString()} kg @ ₹{listing.pricePerKg}/kg</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {listing.city}, {listing.state}</p>
                </div>
                
                <p className="mt-4 text-xs bg-secondary p-3 rounded-lg text-foreground line-clamp-2">
                  {listing.description || 'No description provided.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
