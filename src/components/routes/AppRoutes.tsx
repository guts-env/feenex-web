import React, { lazy } from 'react';
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import PublicRoute from '@/components/routes/PublicRoutes';
import PrivateRoute from '@/components/routes/PrivateRoute';
import AppLayout from '@/components/layout/AppLayout';
import { RoutesEnum } from '@/constants/enums';
import Subscriptions from '@/pages/Subscriptions';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const AcceptInvite = lazy(() => import('@/pages/AcceptInvite'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Expenses = lazy(() => import('@/pages/Expenses/ExpensesTable'));
const Organization = lazy(() => import('@/pages/Organization'));
const Settings = lazy(() => import('@/pages/Settings'));
const Support = lazy(() => import('@/pages/Support'));

const AppRoutes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path={RoutesEnum.LOGIN} element={<PublicRoute element={<Login />} />} />
      <Route path={RoutesEnum.REGISTER} element={<PublicRoute element={<Register />} />} />
      <Route path={RoutesEnum.ACCEPT_INVITE} element={<PublicRoute element={<AcceptInvite />} />} />
      <Route
        path={RoutesEnum.FORGOT_PASSWORD}
        element={<PublicRoute element={<ForgotPassword />} />}
      />
      <Route
        path={RoutesEnum.RESET_PASSWORD}
        element={<PublicRoute element={<ResetPassword />} />}
      />
      <Route element={<PrivateRoute element={<AppLayout />} />}>
        <Route path={RoutesEnum.DASHBOARD} element={<Dashboard />} />
        <Route path={RoutesEnum.EXPENSES} element={<Expenses />} />
        <Route path={RoutesEnum.SUBSCRIPTIONS} element={<Subscriptions />} />
        <Route path={RoutesEnum.ORGANIZATION} element={<Organization />} />
        <Route path={RoutesEnum.SETTINGS} element={<Settings />} />
        <Route path={RoutesEnum.SUPPORT} element={<Support />} />
        <Route path="*" element={<Navigate to={RoutesEnum.EXPENSES} replace />} />
      </Route>
    </RouterRoutes>
  );
};

export default AppRoutes;
