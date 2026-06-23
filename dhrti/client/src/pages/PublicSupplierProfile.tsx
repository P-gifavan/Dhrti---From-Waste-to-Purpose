import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, MapPin, Package } from 'lucide-react';
import api from '../services/api';
import { VerificationBadge } from '../components/VerificationBadge';

const fetchPublicProfile = async (id: string) => {
  const response = await api.get(`/profile/supplier/${id}`);
  return response.data;
};

const fetchPublicReviews = async (id: string) => {
  const response = await api.get(`/reviews/target/${id}`);
  return response.data;
};

export const PublicSupplierProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['supplierProfile', id],
    queryFn: () => fetchPublicProfile(id as string),
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['supplierReviews', id],
    queryFn: () => fetchPublicReviews(id as string),
    enabled: !!id,
  });

  if (profileLoading || reviewsLoading) return <div className="p-10 text-center">Loading profile...</div>;

  const supplier = profileData?.data;
  const reviews = reviewsData?.data?.reviews || [];
  const averageRating = reviewsData?.data?.averageRating || 0;
  const totalReviews = reviewsData?.data?.totalReviews || 0;

  if (!supplier) {
    return <div className="p-10 text-center text-destructive">Supplier not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8 pb-16">
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold uppercase shrink-0">
          {supplier.companyName?.substring(0, 2) || supplier.fullName?.substring(0, 2)}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{supplier.companyName || supplier.fullName}</h1>
            <VerificationBadge status={supplier.verificationStatus} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {supplier.city || 'Unknown'}, {supplier.state || 'Unknown'}</span>
            <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /> {averageRating} ({totalReviews} reviews)</span>
          </div>
          <p className="text-foreground leading-relaxed">
            {supplier.companyDescription || 'This supplier has not provided a description yet.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold">Reviews</h2>
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl text-muted-foreground">
              No reviews yet for this supplier.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev: any) => (
                <div key={rev._id} className="p-4 bg-card border border-border rounded-xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{rev.reviewerId?.companyName || rev.reviewerId?.fullName}</span>
                    <span className="flex items-center gap-1 text-yellow-500 text-sm"><Star className="w-4 h-4 fill-current" /> {rev.rating}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{rev.comment}</p>
                  <p className="text-xs text-muted-foreground opacity-60">{new Date(rev.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Preferred Categories</h3>
            {supplier.preferredWasteCategories && supplier.preferredWasteCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplier.preferredWasteCategories.map((cat: string) => (
                  <span key={cat} className="px-2 py-1 bg-accent text-xs font-medium rounded-md uppercase tracking-wider">
                    {cat.replace('_', ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not specified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
