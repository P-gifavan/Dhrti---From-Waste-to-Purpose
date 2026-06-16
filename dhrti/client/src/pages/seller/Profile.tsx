import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  contactNumber: z.string().optional(),
  gstNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const { fetchProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: data?.data ? {
      fullName: data.data.fullName,
      companyName: data.data.companyName || '',
      city: data.data.city || '',
      state: data.data.state || '',
      contactNumber: data.data.contactNumber || '',
      gstNumber: data.data.gstNumber || '',
    } : undefined
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      fetchProfile();
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
  });

  const onSubmit = (formData: ProfileFormValues) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your personal and company information.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 text-green-600 rounded-lg text-sm font-medium border border-green-500/20">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input {...register('fullName')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
            {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input {...register('companyName')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
            {errors.companyName && <p className="text-destructive text-xs mt-1">{errors.companyName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input {...register('city')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
              {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input {...register('state')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
              {errors.state && <p className="text-destructive text-xs mt-1">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <input {...register('contactNumber')} className="w-full rounded-md border border-border px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GST Number (Optional)</label>
              <input {...register('gstNumber')} className="w-full rounded-md border border-border px-3 py-2 bg-background uppercase" />
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-border">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
