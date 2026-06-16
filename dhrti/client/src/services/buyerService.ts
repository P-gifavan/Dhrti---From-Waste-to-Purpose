import api from './api';
import type { Listing } from '../types/listing';
import type { OrderRequest, BuyerAnalyticsData } from '../types/seller';

export const buyerService = {
  // Requests
  async getRequests(): Promise<{ success: boolean; data: OrderRequest[] }> {
    const response = await api.get('/buyer/requests');
    return response.data;
  },
  async createRequest(data: { listingId: string; quantityKg: number; shippingAddress: string }): Promise<{ success: boolean; data: OrderRequest }> {
    const response = await api.post('/buyer/requests', data);
    return response.data;
  },
  async deleteRequest(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/buyer/requests/${id}`);
    return response.data;
  },

  // Saved Listings
  async getSavedListings(): Promise<{ success: boolean; data: Listing[] }> {
    const response = await api.get('/buyer/saved-listings');
    return response.data;
  },
  async saveListing(listingId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/buyer/saved-listings', { listingId });
    return response.data;
  },
  async removeSavedListing(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/buyer/saved-listings/${id}`);
    return response.data;
  },

  // Analytics
  async getAnalytics(): Promise<{ success: boolean; data: BuyerAnalyticsData }> {
    const response = await api.get('/buyer/analytics');
    return response.data;
  },
};
