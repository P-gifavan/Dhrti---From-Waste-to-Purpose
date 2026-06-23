import api from './api';
import type { User } from '../types/auth';

export const adminService = {
  async getUsers(): Promise<{ success: boolean; data: User[] }> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  async updateVerificationStatus(id: string, status: 'verified' | 'rejected'): Promise<{ success: boolean; message: string; data: User }> {
    const response = await api.put(`/admin/verifications/${id}`, { status });
    return response.data;
  }
};
