import api from './api';

export interface OrderData {
  listingId: string;
  quantityKg: number;
  shippingAddress: string;
}

export const orderService = {
  async createOrder(data: OrderData) {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async getBuyerOrders() {
    const response = await api.get('/orders/buyer');
    return response.data;
  },

  async getSupplierOrders() {
    const response = await api.get('/orders/supplier');
    return response.data;
  },

  async updateOrderStatus(id: string, status: string) {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
