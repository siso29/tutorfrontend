import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [inbox, setInbox] = useState([
    {
      id: 1,
      text: 'Welcome to TutorConnect! Find your ideal tutor or manage your lessons.',
      time: 'Just now',
      unread: true,
      type: 'info',
    },
    {
      id: 2,
      text: 'Physics session with Dawit Alemu is scheduled for Oct 24.',
      time: '1 hour ago',
      unread: true,
      type: 'booking',
    },
  ]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback((text, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      text,
      time: 'Just now',
      unread: true,
      type,
    };
    setInbox((prev) => [newNotif, ...prev]);
    addToast(text, type);
  }, [addToast]);

  const markAllAsRead = useCallback(() => {
    setInbox((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const clearNotification = useCallback((id) => {
    setInbox((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = inbox.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        inbox,
        addNotification,
        markAllAsRead,
        clearNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
