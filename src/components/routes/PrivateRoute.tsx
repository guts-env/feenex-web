import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';
import { useShallow } from 'zustand/react/shallow';

interface PrivateRouteProps {
  element: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { token } = useUserStore(useShallow((state) => ({ token: state.token })));

  if (!token) {
    return (
      <Navigate
        to={'/login'}
        replace
      />
    );
  }

  return <>{element}</>;
};

export default PrivateRoute;
