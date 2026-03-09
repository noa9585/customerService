import React from 'react';
import { Navigate } from 'react-router-dom';
import parseJwt from '../utils/jwt';

interface AuthGuardProps {
  children: React.ReactNode;
  userType?: 'customer' | 'representative'; // optional: restrict by user type
}

/**
 * AuthGuard Component
 * Wraps protected routes and ensures user has valid authentication token
 * Also decodes token and provides user info to children via context (if needed)
 * 
 * Usage:
 * <AuthGuard userType="customer">
 *   <NewChat />
 * </AuthGuard>
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, userType }) => {
  const token = localStorage.getItem('token');

  // No token = redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Try to decode token
  let decoded: any = null;
  try {
    decoded = parseJwt(token);
  } catch (e) {
    console.warn('Invalid or expired token', e);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  // Optional: check user type (if specified)
  if (userType && decoded.role !== userType) {
    console.warn(`User type mismatch. Expected: ${userType}, Got: ${decoded.role}`);
    return <Navigate to="/" replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default AuthGuard;
