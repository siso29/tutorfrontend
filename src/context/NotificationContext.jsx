import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    let active = true;
    apiClient.get('/notifications')
      .then((data) => {
        if (!active || !Array.isArray(data.notifications)) return;
        setInbox(data.notifications.map((n) => ({
          id: n.id, text: n.body, title: n.title, time: new Date(n.created_at).toLocaleString(),
          unread: !n.read_at, type: n.type || 'info', link: n.link,
        })));
      })
      .catch(() => { /* Demo and offline sessions keep local notifications. */ });
    return () => { active = false; };
  }, []);

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
    apiClient.patch('/notifications/read-all', {}).catch(() => {});
  }, []);

  const clearNotification = useCallback((id) => {
    setInbox((prev) => prev.filter((n) => n.id !== id));
    apiClient.delete(`/notifications/${id}`).catch(() => {});
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
