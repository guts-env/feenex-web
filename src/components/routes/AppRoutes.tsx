import React, { lazy } from 'react';
import {
  Route,
  Routes as RouterRoutes,
} from 'react-router-dom';
import PublicRoute from '@/components/routes/PublicRoutes';
import PrivateRoute from '@/components/routes/PrivateRoute';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AcceptInvite = lazy(() => import('@/pages/AcceptInvite'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

const AppRoutes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<PublicRoute element={<Login />} />} />
      <Route path="/register" element={<PublicRoute element={<Register />} />} />
      <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
      <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />
      <Route path="/accept-invite" element={<PublicRoute element={<AcceptInvite />} />} />
      <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
    </RouterRoutes>
  );
};

export default AppRoutes;
