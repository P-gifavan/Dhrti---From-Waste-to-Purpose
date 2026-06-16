import api from './api';

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  async submitContactForm(data: ContactData): Promise<{ success: boolean; data: unknown }> {
    const response = await api.post('/contact', data);
    return response.data;
  },
};
