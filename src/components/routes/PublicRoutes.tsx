import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/stores/useUserStore';
import { RoutesEnum, RoleEnum } from '@/constants/enums';
import { Splash } from '@/App';

interface PublicRouteProps {
  element: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const { token, user } = useUserStore(useShallow((state) => ({
    token: state.token,
    user: state.user
  })));

  if (token) {
    // If we have a token but no user data, show loading
    if (!user) {
      return <Splash />;
    }

    const userRole = user.role?.name;

    if (userRole === RoleEnum.BUSINESS_ADMIN || userRole === RoleEnum.PERSONAL_ADMIN) {
      return <Navigate to={RoutesEnum.DASHBOARD} replace />;
    } else {
      return <Navigate to={RoutesEnum.EXPENSES} replace />;
    }
  }

  return <>{element}</>;
};

export default PublicRoute;
