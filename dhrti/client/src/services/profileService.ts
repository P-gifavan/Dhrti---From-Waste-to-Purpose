import api from './api';
import type { User } from '../types/auth';

export const profileService = {
  async getProfile(): Promise<{ success: boolean; data: User }> {
    const response = await api.get('/profile');
    return response.data;
  },
  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data: User }> {
    const response = await api.put('/profile', data);
    return response.data;
  },
};
