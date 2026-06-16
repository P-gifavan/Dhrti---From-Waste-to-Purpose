import api from './api';
import type { LoginCredentials, SignupCredentials } from '../types/auth';

export const authService = {
  async login(data: LoginCredentials) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async signup(data: SignupCredentials) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async googleLogin(data: { credential: string; role?: string }) {
    const response = await api.post('/auth/google', data);
    return response.data;
  },
};
