import api from './api';

export const paymentService = {
  async createPaymentOrder(orderId: string) {
    const response = await api.post('/payments/create-order', { orderId });
    return response.data;
  },

  async verifyPayment(data: {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) {
    const response = await api.post('/payments/verify', data);
    return response.data;
  },
};
