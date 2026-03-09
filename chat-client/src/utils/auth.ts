import parseJwt from './jwt';

/**
 * Auth Utilities
 * Centralized token management helpers to avoid code duplication across hooks
 */

/**
 * Get decoded token from localStorage
 * @returns Decoded token object or null if no valid token
 */
export const getDecodedToken = (): any | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return parseJwt(token);
  } catch (e) {
    console.warn('Failed to decode token:', e);
    return null;
  }
};

/**
 * Store token in localStorage
 * @param token JWT token string
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Check if token exists and is valid
 * @returns true if valid token exists
 */
export const hasValidToken = (): boolean => {
  return getDecodedToken() !== null;
};

/**
 * Get user ID from token
 * @returns User ID (sub claim) or null
 */
export const getUserIdFromToken = (): string | null => {
  const decoded = getDecodedToken();
  return decoded?.sub || null;
};

/**
 * Get user role from token
 * @returns User role or null
 */
export const getUserRoleFromToken = (): string | null => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};
