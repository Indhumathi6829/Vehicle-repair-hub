import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if they try to access an unauthorized route
    const dashboardRoute = {
      CUSTOMER: '/customer',
      SHOP_OWNER: '/owner',
      MECHANIC: '/mechanic',
      ADMIN: '/admin',
    }[user.role] || '/login';

    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default RoleRoute;
