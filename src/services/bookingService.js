import { apiClient } from './apiClient';
import { getStorage, setStorage } from './storage';
import { INITIAL_BOOKINGS } from './mockData';

const BOOKINGS_KEY = 'tutorConnectBookingsList';

function getLocalBookings() {
  return getStorage(BOOKINGS_KEY, INITIAL_BOOKINGS);
}

function saveLocalBookings(bookings) {
  setStorage(BOOKINGS_KEY, bookings);
}

export const bookingService = {
  async getAllBookings() {
    try {
      const data = await apiClient.get('/bookings');
      if (Array.isArray(data)) {
        saveLocalBookings(data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocalBookings();
  },

  async createBooking(bookingData) {
    const newBooking = {
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...bookingData,
    };

    try {
      const res = await apiClient.post('/bookings', newBooking);
      if (res && res.booking) return res.booking;
    } catch {
      // Fallback
    }

    const current = getLocalBookings();
    const updated = [newBooking, ...current];
    saveLocalBookings(updated);
    return newBooking;
  },

  async updateBookingStatus(id, status) {
    try {
      await apiClient.patch(`/bookings/${id}/status`, { status });
    } catch {
      // Fallback
    }

    const current = getLocalBookings();
    const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
    saveLocalBookings(updated);
    return updated.find((b) => b.id === id);
  },

  getBookingsForUser(userId, role, tutorId = null) {
    const bookings = getLocalBookings();
    if (role === 'admin') return bookings;
    if (role === 'tutor') {
      return bookings.filter(
        (b) => Number(b.tutorId) === Number(tutorId) || b.tutorName?.toLowerCase().includes('dawit')
      );
    }
    // Learner / Guardian
    return bookings.filter((b) => b.learnerId === userId || !b.learnerId || b.guardianName?.includes('Abel'));
  },
};
