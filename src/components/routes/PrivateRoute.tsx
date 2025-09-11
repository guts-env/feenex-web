import React, { useEffect, type ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { Loader2 } from 'lucide-react';
import { RoutesEnum } from '@/constants/enums';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery } from '@tanstack/react-query';
import AuthService from '@/api/services/AuthService/service';

interface PrivateRouteProps {
  element: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const navigate = useNavigate();

  const { token, setToken } = useUserStore(useShallow((state) => ({ token: state.token, setToken: state.setToken })));

  const { data, isLoading, isError } = useQuery({
    queryKey: ['refreshToken'],
    queryFn: AuthService.refreshToken,
    enabled: !token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setToken(data.accessToken);
    }
  }, [data, isError, setToken, navigate]);

  if (isLoading) {
    return (
      <div>
        <Loader2 className="size-4 animate-spin" /> Loading...
      </div>
    );
  }

  if (!token && isError) {
    return (
      <Navigate
        to={RoutesEnum.LOGIN}
        replace
      />
    );
  }

  return <>{element}</>;
};

export default PrivateRoute;
