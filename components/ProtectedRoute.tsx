
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

interface Props {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { customerAuth, adminAuth, vendorAuth, deliveryAuth } = useAppContext();
  const location = useLocation();

  const getAuth = () => {
    switch (requiredRole) {
      case 'admin': return adminAuth;
      case 'vendor': return vendorAuth;
      case 'delivery': return deliveryAuth;
      case 'customer':
      default: return customerAuth;
    }
  };

  const auth = getAuth();

  if (!auth) {
    // Determine where to redirect based on role
    const loginPath = requiredRole && requiredRole !== 'customer' 
      ? `/${requiredRole}/login` 
      : '/login';
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
