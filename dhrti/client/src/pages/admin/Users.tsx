import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Trash2 } from 'lucide-react';

export const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading users...</div>;

  const users = usersData?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Name</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Email</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Role</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.verificationStatus === 'verified' ? 'bg-green-500/10 text-green-600' :
                    user.verificationStatus === 'rejected' ? 'bg-destructive/10 text-destructive' :
                    'bg-yellow-500/10 text-yellow-600'
                  }`}>
                    {user.verificationStatus || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
