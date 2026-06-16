import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../services/profileService';
import { Save, User as UserIcon, Building, MapPin, Phone, FileText } from 'lucide-react';

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const { fetchProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    city: '',
    state: '',
    contactNumber: '',
    gstNumber: '',
    procurementPreferences: ''
  });

  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: data.data.fullName || '',
        companyName: data.data.companyName || '',
        city: data.data.city || '',
        state: data.data.state || '',
        contactNumber: data.data.contactNumber || '',
        gstNumber: data.data.gstNumber || '',
        procurementPreferences: data.data.procurementPreferences || ''
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      fetchProfile();
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Buyer Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details and procurement preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-accent/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{data?.data?.fullName}</h2>
              <p className="text-sm text-muted-foreground">{data?.data?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-lg text-sm font-medium">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><UserIcon className="w-4 h-4 text-muted-foreground"/> Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Building className="w-4 h-4 text-muted-foreground"/> Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground"/> Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground"/> GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full rounded-md border border-border px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground"/> Procurement Preferences</label>
              <p className="text-xs text-muted-foreground mb-2">Describe what kind of materials, conditions, or quantities you typically procure.</p>
              <textarea
                name="procurementPreferences"
                value={formData.procurementPreferences}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-border px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none transition-all resize-y"
                placeholder="e.g. Seeking high density clean plastic, recurring orders of 5 tons per month..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
