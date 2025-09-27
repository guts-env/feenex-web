import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/stores/useUserStore';
import { RoutesEnum, RoleEnum } from '@/constants/enums';

interface PublicRouteProps {
  element: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const { token, user } = useUserStore(useShallow((state) => ({
    token: state.token,
    user: state.user
  })));

  if (token) {
    const userRole = user?.role?.name;

    if (userRole === RoleEnum.BUSINESS_ADMIN || userRole === RoleEnum.PERSONAL_ADMIN) {
      return <Navigate to={RoutesEnum.DASHBOARD} />;
    } else {
      return <Navigate to={RoutesEnum.EXPENSES} />;
    }
  }

  return <>{element}</>;
};

export default PublicRoute;
