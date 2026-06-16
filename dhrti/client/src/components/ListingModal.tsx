import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, MapPin, Package, CheckCircle2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';

interface ListingModalProps {
  listing: any;
  onClose: () => void;
}

export const ListingModal: React.FC<ListingModalProps> = ({ listing, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(listing.minOrderQuantity || 1);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const orderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
      setTimeout(() => onClose(), 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  });

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!address) {
      setError('Shipping address is required');
      return;
    }

    if (quantity < (listing.minOrderQuantity || 1)) {
      setError(`Minimum order quantity is ${listing.minOrderQuantity || 1}kg`);
      return;
    }

    if (quantity > listing.quantityKg) {
      setError(`Only ${listing.quantityKg}kg available`);
      return;
    }

    orderMutation.mutate({
      listingId: listing._id,
      quantityKg: quantity,
      shippingAddress: address,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Listing Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Order Placed Successfully!</h3>
              <p className="text-muted-foreground">The supplier has been notified. You can track this in your Orders dashboard.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                    {listing.wasteCategory?.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {listing.condition}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{listing.title}</h3>
                <p className="text-muted-foreground">{listing.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" /> Location
                  </div>
                  <p className="font-semibold">{listing.city}, {listing.state}</p>
                </div>
                <div className="bg-accent/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="w-4 h-4" /> Available Qty
                  </div>
                  <p className="font-semibold">{listing.quantityKg?.toLocaleString()} kg</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                <span className="font-medium text-primary">Price per kg</span>
                <span className="text-2xl font-bold font-mono text-primary">₹{listing.pricePerKg}</span>
              </div>

              {/* Order Form */}
              {user?.role === 'buyer' && (
                <form onSubmit={handleOrder} className="space-y-4 pt-4 border-t border-border">
                  <h4 className="font-semibold text-lg mb-4">Place Order</h4>
                  
                  {error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                      <input
                        type="number"
                        min={listing.minOrderQuantity || 1}
                        max={listing.quantityKg}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full rounded-md border border-border py-2 px-3 bg-background"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min: {listing.minOrderQuantity || 1}kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Total Amount</label>
                      <div className="w-full rounded-md border border-border py-2 px-3 bg-accent text-lg font-mono font-bold">
                        ₹{(quantity * listing.pricePerKg).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Shipping Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-border py-2 px-3 bg-background resize-none"
                      placeholder="Enter full delivery address..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={orderMutation.isPending}
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {orderMutation.isPending ? 'Processing...' : 'Confirm Order'}
                  </button>
                </form>
              )}
              
              {!user && (
                <div className="p-4 bg-accent rounded-xl text-center">
                  <p className="text-muted-foreground mb-3">Please log in to place an order.</p>
                  <a href="/login" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">Log In</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
