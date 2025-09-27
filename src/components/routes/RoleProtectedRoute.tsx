import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/stores/useUserStore';
import { RoleEnum, RoutesEnum } from '@/constants/enums';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: RoleEnum[];
  redirectTo?: string;
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectTo = RoutesEnum.EXPENSES,
}: RoleProtectedRouteProps) {
  const { user } = useUserStore(useShallow((state) => ({ user: state.user })));

  const userRole = user?.role?.name;

  if (!user || !userRole) {
    return <Navigate to={RoutesEnum.LOGIN} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
