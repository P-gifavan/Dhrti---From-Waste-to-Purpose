import type { Listing } from './listing';
import type { User } from './auth';

export interface OrderRequest {
  _id: string;
  listingId: Listing;
  buyerId: User;
  sellerId: User;
  quantityKg: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  totalListings: number;
  totalQuantity: number;
  listingsByCategory: { name: string; value: number }[];
  quantityByCategory: { name: string; value: number }[];
  statusData: { name: string; value: number }[];
  summary: {
    active: number;
    draft: number;
    sold: number;
  };
}

export interface BuyerAnalyticsData {
  totalRequests: number;
  requestsByCategory: { name: string; value: number }[];
  quantityByCategory: { name: string; value: number }[];
  statusData: { name: string; value: number }[];
  summary: {
    pending: number;
    accepted: number;
    rejected: number;
    completed: number;
  };
}
