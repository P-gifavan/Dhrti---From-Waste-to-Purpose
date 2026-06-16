import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { sellerService } from '../../services/sellerService';
import type { Listing } from '../../types/listing';

const listingSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  wasteCategory: z.enum(['recyclable_plastic', 'paper', 'metal']),
  description: z.string().optional(),
  quantityKg: z.coerce.number().min(1, 'Quantity must be greater than 0'),
  pricePerKg: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  condition: z.string().min(2, 'Condition is required'),
  status: z.enum(['active', 'draft', 'sold']).default('active'),
});



export const MyListings: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['sellerListings'],
    queryFn: sellerService.getListings,
  });

  type ListingFormValues = z.infer<typeof listingSchema>;
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ListingFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(listingSchema) as any,
    defaultValues: { status: 'active', wasteCategory: 'recyclable_plastic' }
  });

  const createMutation = useMutation({
    mutationFn: sellerService.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerListings'] });
      queryClient.invalidateQueries({ queryKey: ['sellerAnalytics'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Listing> }) => sellerService.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerListings'] });
      queryClient.invalidateQueries({ queryKey: ['sellerAnalytics'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sellerService.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerListings'] });
      queryClient.invalidateQueries({ queryKey: ['sellerAnalytics'] });
    },
  });

  const openModal = (listing?: Listing) => {
    if (listing) {
      setEditingId(listing._id);
      setValue('title', listing.title);
      setValue('wasteCategory', listing.wasteCategory);
      setValue('description', listing.description || '');
      setValue('quantityKg', listing.quantityKg);
      setValue('pricePerKg', listing.pricePerKg);
      setValue('city', listing.city);
      setValue('state', listing.state);
      setValue('condition', listing.condition);
      setValue('status', listing.status);
    } else {
      setEditingId(null);
      reset({ status: 'active', wasteCategory: 'recyclable_plastic', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: z.infer<typeof listingSchema>) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your available waste materials.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Listing
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Quantity / Price</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading listings...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No listings found. Create one to get started!</td></tr>
              ) : (
                data?.data?.map((listing) => (
                  <tr key={listing._id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{listing.title}</td>
                    <td className="px-6 py-4 capitalize">{listing.wasteCategory.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      {listing.quantityKg.toLocaleString()} kg<br/>
                      <span className="text-xs text-muted-foreground">₹{listing.pricePerKg}/kg</span>
                    </td>
                    <td className="px-6 py-4">{listing.city}, {listing.state}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        listing.status === 'active' ? 'bg-green-500/10 text-green-600' :
                        listing.status === 'sold' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-gray-500/10 text-gray-600'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openModal(listing)} className="text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => { if(confirm('Delete listing?')) deleteMutation.mutate(listing._id); }} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Listing' : 'Create Listing'}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input {...register('title')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
                  {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Waste Category</label>
                  <select {...register('wasteCategory')} className="w-full rounded-md border border-border px-3 py-2 bg-background">
                    <option value="recyclable_plastic">Recyclable Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="metal">Metal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <input {...register('condition')} placeholder="e.g. Clean, Mixed, Baled" className="w-full rounded-md border border-border px-3 py-2 bg-background" />
                  {errors.condition && <p className="text-destructive text-xs mt-1">{errors.condition.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                  <input type="number" {...register('quantityKg')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
                  {errors.quantityKg && <p className="text-destructive text-xs mt-1">{errors.quantityKg.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price per kg (₹)</label>
                  <input type="number" step="0.01" {...register('pricePerKg')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
                  {errors.pricePerKg && <p className="text-destructive text-xs mt-1">{errors.pricePerKg.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input {...register('city')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input {...register('state')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
                  {errors.state && <p className="text-destructive text-xs mt-1">{errors.state.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select {...register('status')} className="w-full rounded-md border border-border px-3 py-2 bg-background">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea {...register('description')} rows={3} className="w-full rounded-md border border-border px-3 py-2 bg-background resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 font-medium rounded-lg hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
