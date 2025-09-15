import React, { lazy } from 'react';
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import PublicRoute from '@/components/routes/PublicRoutes';
import PrivateRoute from '@/components/routes/PrivateRoute';
import AppLayout from '@/components/layout/AppLayout';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const AcceptInvite = lazy(() => import('@/pages/AcceptInvite'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
// const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Expenses = lazy(() => import('@/pages/Expenses/ExpensesTable'));
const Organization = lazy(() => import('@/pages/Organization'));
const Settings = lazy(() => import('@/pages/Settings'));

const AppRoutes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<PublicRoute element={<Login />} />} />
      <Route path="/register" element={<PublicRoute element={<Register />} />} />
      <Route path="/accept-invite" element={<PublicRoute element={<AcceptInvite />} />} />
      <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
      <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />
      <Route element={<PrivateRoute element={<AppLayout />} />}>
        <Route path="/" element={<Navigate to="/expenses" replace />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/expenses" replace />} />
      </Route>
    </RouterRoutes>
  );
};

export default AppRoutes;
