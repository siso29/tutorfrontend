import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync across tabs/windows if localStorage changes
    function handleStorageChange(e) {
      if (e.key === 'tutorConnectUser') {
        setUser(authService.getCurrentUser());
      }
      if (e.key === 'tutorConnectToken') {
        setToken(authService.getToken());
      }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      setToken(result.token);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const result = await authService.register(data);
      setUser(result.user);
      setToken(result.token);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const demoLogin = useCallback((role) => {
    const loggedUser = authService.demoLogin(role);
    setUser(loggedUser);
    setToken(authService.getToken());
    return loggedUser;
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = authService.updateProfile(updates);
    if (updated) {
      setUser(updated);
    }
    return updated;
  }, []);

  const role = user?.role || 'guest';
  const isTutor = role === 'tutor';
  const isAdmin = role === 'admin';
  const isGuardian = role === 'guardian' || role === 'student' || role === 'learner';
  const isStudent = role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        role,
        isTutor,
        isAdmin,
        isGuardian,
        isStudent,
        login,
        register,
        logout,
        demoLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
