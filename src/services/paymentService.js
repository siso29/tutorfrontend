import { apiClient } from './apiClient';

export const paymentService = {
  async startCheckout(bookingId) {
    if (!bookingId) throw new Error('This booking has no database ID yet. Refresh bookings and try again.');
    return apiClient.post('/payments/checkout', { bookingId: Number(bookingId) });
  },
  async verify(reference) {
    return apiClient.post(`/payments/verify/${encodeURIComponent(reference)}`, {});
  },
  async getMine() {
    return apiClient.get('/payments/mine');
  },
  async getAdminSummary() {
    return apiClient.get('/payments/admin/summary');
  },
};
