import React, { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/stores/useUserStore';
import AuthService from '@/api/services/AuthService/service';
import { RoutesEnum } from '@/constants/enums';
import { Splash } from '@/App';

interface PrivateRouteProps {
  element: ReactNode;
}

let hasAttemptedRefresh = false;

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { token, setToken } = useUserStore(
    useShallow((state) => ({ token: state.token, setToken: state.setToken })),
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!token && !hasAttemptedRefresh) {
          hasAttemptedRefresh = true;
          const response = await AuthService.refreshAccessToken();
          if (response?.accessToken) {
            setToken(response.accessToken);
          }
        }
      } catch {
        /* empty */
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [token, setToken]);

  if (isInitializing) {
    return <Splash />;
  }

  if (!token) {
    return <Navigate to={RoutesEnum.LOGIN} replace />;
  }

  return <>{element}</>;
};

export default PrivateRoute;
