import { apiClient } from './apiClient';
import { getStorage, setStorage, removeStorage } from './storage';
import { INITIAL_USERS } from './mockData';

const TOKEN_KEY = 'tutorConnectToken';
const USER_KEY = 'tutorConnectUser';
const USERS_LIST_KEY = 'tutorConnectUsersList';

// Ensure user list exists in local storage
function getUsersList() {
  return getStorage(USERS_LIST_KEY, INITIAL_USERS);
}

function saveUsersList(users) {
  setStorage(USERS_LIST_KEY, users);
}

export const authService = {
  getCurrentUser() {
    return getStorage(USER_KEY, null);
  },

  getToken() {
    return getStorage(TOKEN_KEY, null);
  },

  isAuthenticated() {
    return !!getStorage(TOKEN_KEY, null);
  },

  async login(email, password) {
    try {
      // 1. Try real backend
      const data = await apiClient.post('/auth/login', { email, password });
      if (data && data.token && data.user) {
        setStorage(TOKEN_KEY, data.token);
        setStorage(USER_KEY, data.user);
        return { success: true, user: data.user, token: data.token, fromBackend: true };
      }
    } catch (error) {
      if (!error.isNetworkError && error.status && error.status !== 404) {
        // If the backend actively rejected with 401/400, propagate the error
        throw error;
      }
      // If network error (backend not running yet), fall back to local mock accounts
      console.info('Backend not reachable; verifying via local offline user repository.');
    }

    // 2. Offline / Local fallback
    const users = getUsersList();
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      const token = `mock-jwt-token-${Date.now()}`;
      setStorage(TOKEN_KEY, token);
      setStorage(USER_KEY, existing);
      return { success: true, user: existing, token, fromBackend: false };
    }

    // If no existing user found, allow automatic login for demo with default role
    const newUser = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email: email.trim(),
      role: 'guardian',
      status: 'Active',
      avatar: email.substring(0, 2).toUpperCase(),
    };
    users.push(newUser);
    saveUsersList(users);

    const token = `mock-jwt-token-${Date.now()}`;
    setStorage(TOKEN_KEY, token);
    setStorage(USER_KEY, newUser);
    return { success: true, user: newUser, token, fromBackend: false };
  },

  async register({ fullName, email, password, role }) {
    const backendRole = role === 'tutor' ? 'tutor' : role === 'admin' ? 'admin' : 'guardian';

    try {
      // 1. Try real backend
      const data = await apiClient.post('/auth/register', {
        fullName,
        email,
        password,
        role: backendRole,
      });

      if (data && data.token && data.user) {
        setStorage(TOKEN_KEY, data.token);
        setStorage(USER_KEY, data.user);
        return { success: true, user: data.user, token: data.token, fromBackend: true };
      }
    } catch (error) {
      if (!error.isNetworkError && error.status && error.status !== 404) {
        throw error;
      }
      console.info('Backend not reachable; registering in local offline repository.');
    }

    // 2. Offline / Local fallback
    const users = getUsersList();
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim(),
      role: backendRole,
      status: 'Active',
      avatar: fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'TC',
    };

    users.push(newUser);
    saveUsersList(users);

    const token = `mock-jwt-token-${Date.now()}`;
    setStorage(TOKEN_KEY, token);
    setStorage(USER_KEY, newUser);

    return { success: true, user: newUser, token, fromBackend: false };
  },

  logout() {
    removeStorage(TOKEN_KEY);
    removeStorage(USER_KEY);
  },

  demoLogin(role) {
    const users = getUsersList();
    const user = users.find((u) => u.role === role) || users[0];
    const token = `demo-token-${role}-${Date.now()}`;
    setStorage(TOKEN_KEY, token);
    setStorage(USER_KEY, user);
    return user;
  },

  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updated = { ...currentUser, ...updates };
    setStorage(USER_KEY, updated);

    const users = getUsersList();
    const index = users.findIndex((u) => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updated;
      saveUsersList(users);
    }

    return updated;
  },
};
