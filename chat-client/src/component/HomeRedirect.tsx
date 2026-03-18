// HomeRedirect.tsx — קורא מ-Redux במקום localStorage ישירות
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

const HomeRedirect: React.FC = () => {
  const { userType, isAuthenticated } = useSelector((state: RootState) => state.auth);

if (!isAuthenticated) return <Navigate to="/contact-us" replace />;
  if (userType === 'admin') return <Navigate to="/admin" replace />;
  if (userType === 'representative') return <Navigate to="/representative-dashboard" replace />;
  return <Navigate to="/contact-us" replace />;
};

export default HomeRedirect;
