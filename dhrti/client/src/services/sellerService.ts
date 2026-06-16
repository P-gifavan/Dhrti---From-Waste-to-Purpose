import api from './api';
import type { Listing } from '../types/listing';
import type { OrderRequest, AnalyticsData } from '../types/seller';

export const sellerService = {
  // Listings
  async getListings(): Promise<{ success: boolean; data: Listing[] }> {
    const response = await api.get('/seller/listings');
    return response.data;
  },
  async createListing(data: Partial<Listing>): Promise<{ success: boolean; data: Listing }> {
    const response = await api.post('/seller/listings', data);
    return response.data;
  },
  async updateListing(id: string, data: Partial<Listing>): Promise<{ success: boolean; data: Listing }> {
    const response = await api.put(`/seller/listings/${id}`, data);
    return response.data;
  },
  async deleteListing(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/seller/listings/${id}`);
    return response.data;
  },

  // Requests
  async getRequests(): Promise<{ success: boolean; data: OrderRequest[] }> {
    const response = await api.get('/seller/requests');
    return response.data;
  },
  async updateRequestStatus(id: string, status: string): Promise<{ success: boolean; data: OrderRequest }> {
    const response = await api.put(`/seller/requests/${id}`, { status });
    return response.data;
  },

  // Analytics
  async getAnalytics(): Promise<{ success: boolean; data: AnalyticsData }> {
    const response = await api.get('/seller/analytics');
    return response.data;
  },
};
