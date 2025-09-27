import React, { lazy } from 'react';
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import PublicRoute from '@/components/routes/PublicRoutes';
import PrivateRoute from '@/components/routes/PrivateRoute';
import { RoleProtectedRoute } from '@/components/routes/RoleProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import { RoutesEnum, RoleEnum } from '@/constants/enums';
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
const HelpCenter = lazy(() => import('@/pages/HelpCenter'));
const ExpenseGuide = lazy(() => import('@/pages/HelpCenter/ExpenseGuide'));
const OrganizationGuide = lazy(() => import('@/pages/HelpCenter/OrganizationGuide'));
const SubscriptionGuide = lazy(() => import('@/pages/HelpCenter/SubscriptionGuide'));

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
        <Route
          path={RoutesEnum.DASHBOARD}
          element={
            <RoleProtectedRoute allowedRoles={[RoleEnum.BUSINESS_ADMIN, RoleEnum.PERSONAL_ADMIN]}>
              <Dashboard />
            </RoleProtectedRoute>
          }
        />
        <Route path={RoutesEnum.EXPENSES} element={<Expenses />} />
        <Route
          path={RoutesEnum.SUBSCRIPTIONS}
          element={
            <RoleProtectedRoute allowedRoles={[RoleEnum.BUSINESS_ADMIN, RoleEnum.PERSONAL_ADMIN]}>
              <Subscriptions />
            </RoleProtectedRoute>
          }
        />
        <Route
          path={RoutesEnum.ORGANIZATION}
          element={
            <RoleProtectedRoute allowedRoles={[RoleEnum.BUSINESS_ADMIN]}>
              <Organization />
            </RoleProtectedRoute>
          }
        />
        <Route
          path={RoutesEnum.SETTINGS}
          element={
            <RoleProtectedRoute allowedRoles={[RoleEnum.BUSINESS_ADMIN, RoleEnum.PERSONAL_ADMIN]}>
              <Settings />
            </RoleProtectedRoute>
          }
        />
        <Route path={RoutesEnum.SUPPORT} element={<Support />} />
        <Route path={RoutesEnum.HELP_CENTER} element={<HelpCenter />} />
        <Route path="/help-center/expenses/:guideId?" element={<ExpenseGuide />} />
        <Route path="/help-center/expenses" element={<ExpenseGuide />} />
        <Route path="/help-center/organization/:guideId?" element={<OrganizationGuide />} />
        <Route path="/help-center/organization" element={<OrganizationGuide />} />
        <Route path="/help-center/subscriptions/:guideId?" element={<SubscriptionGuide />} />
        <Route path="/help-center/subscriptions" element={<SubscriptionGuide />} />
        <Route path="*" element={<Navigate to={RoutesEnum.EXPENSES} replace />} />
      </Route>
    </RouterRoutes>
  );
};

export default AppRoutes;
