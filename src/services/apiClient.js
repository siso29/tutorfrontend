// Central API client configured for backend integration
import { getStorage } from './storage';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Fetch wrapper with timeout and JWT authentication header
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getStorage('tutorConnectToken', null);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);
  config.signal = controller.signal;

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || data.error || `HTTP error ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    // Mark network/offline errors so callers can fall back to local store
    if (error.name === 'AbortError' || error instanceof TypeError) {
      error.isNetworkError = true;
    }
    throw error;
  }
}

export const apiClient = {
  get: (url, options) => apiRequest(url, { method: 'GET', ...options }),
  post: (url, body, options) =>
    apiRequest(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (url, body, options) =>
    apiRequest(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (url, body, options) =>
    apiRequest(url, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (url, options) => apiRequest(url, { method: 'DELETE', ...options }),
};
