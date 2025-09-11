import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/stores/useUserStore';

interface PublicRouteProps {
  element: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const { token } = useUserStore(useShallow((state) => ({ token: state.token })));

  if (token) {
    return <Navigate to="/" />;
  }

  return <>{element}</>;
};

export default PublicRoute;
