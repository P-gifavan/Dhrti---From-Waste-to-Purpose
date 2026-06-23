import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [uploadMsg, setUploadMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

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

  const uploadMutation = useMutation({
    mutationFn: profileService.uploadVerificationDocuments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      fetchProfile();
      setUploadMsg('Documents uploaded successfully. Verification is pending.');
      setFiles(null);
      setErrorMsg('');
      setTimeout(() => setUploadMsg(''), 5000);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to upload documents.');
    }
  });

  const handleUpload = () => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('documents', file);
    });
    uploadMutation.mutate(formData);
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

      {/* Verification Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Business Verification</h2>
        
        {data?.data?.verificationStatus === 'verified' && (
          <div className="flex items-center gap-2 text-green-600 bg-green-500/10 p-4 rounded-lg mb-4 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Your business is Verified.</span>
          </div>
        )}
        {data?.data?.verificationStatus === 'pending' && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-500/10 p-4 rounded-lg mb-4 border border-yellow-500/20">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Your verification is currently Pending review by admins.</span>
          </div>
        )}
        {data?.data?.verificationStatus === 'rejected' && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-lg mb-4 border border-destructive/20">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Your last verification was Rejected. Please upload valid documents.</span>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload your GST Certificate, PAN Card, or Business Registration documents to get verified. Verified suppliers get a badge and rank higher in search results.
          </p>

          {uploadMsg && (
            <div className="p-3 bg-green-500/10 text-green-600 rounded-lg text-sm font-medium border border-green-500/20">
              {uploadMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm font-medium border border-destructive/20">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-4">
            <input 
              type="file" 
              multiple 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => setFiles(e.target.files)}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
            <button 
              onClick={handleUpload}
              disabled={!files || files.length === 0 || uploadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <UploadCloud className="w-4 h-4" />
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {data?.data?.verificationDocuments && data.data.verificationDocuments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Documents:</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {data.data.verificationDocuments.map((doc, idx) => (
                  <li key={idx}>
                    <a href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${doc}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      Document {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
