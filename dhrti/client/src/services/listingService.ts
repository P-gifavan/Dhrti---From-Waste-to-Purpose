import api from './api';
import type { GetListingsResponse, GetListingsParams, Listing } from '../types/listing';

export const listingService = {
  async getListings(params?: GetListingsParams): Promise<GetListingsResponse> {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  async createListing(data: Partial<Listing>): Promise<{ success: boolean; data: Listing }> {
    const response = await api.post('/listings', data);
    return response.data;
  },
};
