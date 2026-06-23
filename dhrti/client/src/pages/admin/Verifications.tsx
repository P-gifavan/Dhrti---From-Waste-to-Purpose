import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';

export const Verifications: React.FC = () => {
  const queryClient = useQueryClient();
  const [actionMsg, setActionMsg] = useState('');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'verified' | 'rejected' }) => 
      adminService.updateVerificationStatus(id, status),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setActionMsg(res.message);
      setTimeout(() => setActionMsg(''), 3000);
    }
  });

  if (isLoading) return <div>Loading verifications...</div>;

  const users = usersData?.data || [];
  // Only show users who have uploaded documents and are pending or rejected (or we can show all)
  const pendingUsers = users.filter(u => u.verificationStatus === 'pending' && u.verificationDocuments && u.verificationDocuments.length > 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Business Verifications</h1>
      
      {actionMsg && (
        <div className="p-4 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium">
          {actionMsg}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Company Name</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">User Name</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Documents</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pendingUsers.map(user => (
              <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{user.companyName}</td>
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {user.verificationDocuments?.map((doc, idx) => (
                      <a 
                        key={idx}
                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${doc}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-xs"
                      >
                        <FileText className="w-3 h-3" />
                        Document {idx + 1}
                      </a>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button 
                    onClick={() => updateMutation.mutate({ id: user._id, status: 'verified' })}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg transition-colors font-medium text-xs disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => updateMutation.mutate({ id: user._id, status: 'rejected' })}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors font-medium text-xs disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No pending verifications.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
