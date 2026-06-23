import api from './api';

export interface Review {
  _id?: string;
  reviewerId: any;
  reviewTargetId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export const reviewService = {
  async createReview(data: Partial<Review>): Promise<{ success: boolean; data: Review }> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async getTargetReviews(targetId: string): Promise<{ success: boolean; data: { reviews: Review[], totalReviews: number, averageRating: string } }> {
    const response = await api.get(`/reviews/target/${targetId}`);
    return response.data;
  }
};
