import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { useNotification } from './NotificationContext';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const createBooking = useCallback(
    async (bookingData) => {
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings((prev) => [newBooking, ...prev]);

      addNotification(
        `New booking requested with ${newBooking.tutorName} for ${newBooking.subject} (${newBooking.date})`,
        'success'
      );

      return newBooking;
    },
    [addNotification]
  );

  const updateBookingStatus = useCallback(
    async (id, status) => {
      const updated = await bookingService.updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );

      const statusMsg =
        status === 'Confirmed'
          ? 'accepted'
          : status === 'Declined'
            ? 'declined'
            : status.toLowerCase();

      addNotification(
        `Booking #${id.slice(-4)} has been ${statusMsg}.`,
        status === 'Confirmed' ? 'success' : 'info'
      );

      return updated;
    },
    [addNotification]
  );

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        createBooking,
        updateBookingStatus,
        refreshBookings: loadBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}
