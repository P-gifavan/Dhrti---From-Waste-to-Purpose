import type { User } from './auth';

export type WasteCategory = 'recyclable_plastic' | 'paper' | 'metal';
export type ListingStatus = 'active' | 'draft' | 'sold';

export interface Listing {
  _id: string;
  sellerId: User;
  title: string;
  wasteCategory: WasteCategory;
  description?: string;
  quantityKg: number;
  pricePerKg: number;
  city: string;
  state: string;
  condition: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface GetListingsResponse {
  success: boolean;
  data: Listing[];
  pagination: Pagination;
}

export interface GetListingsParams {
  page?: number;
  limit?: number;
  search?: string;
  wasteCategory?: string;
  condition?: string;
  city?: string;
  state?: string;
  minQuantity?: number;
  maxQuantity?: number;
}
