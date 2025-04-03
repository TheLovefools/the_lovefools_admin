/* eslint-disable react-hooks/exhaustive-deps */
// Layout.tsx
import React, { ReactNode, useLayoutEffect } from 'react';
import AuthLayout from './AuthLayout';
import DashboardLayout from './DashboardLayout';
import Loader from '../common/Loader';
import { useAppDispatch, useAppSelector } from '@/redux/selector';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import {
  handleAuth,
  handleLogin,
  setInitialized,
} from '@/redux/auth/auth-slice';

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  useLayoutEffect(() => {
    const isAuthenticated = Boolean(getCookie('isAuthenticated'));
    dispatch(setInitialized(true));

    if (!isAuthenticated) {
      return router.push('/login');
    }

    dispatch(handleAuth());

    return () => {};
  }, []);

  if (!isInitialized) return <Loader />;

  return (
    <div className='flex h-screen overflow-hidden'>
      {isAuthenticated ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        <AuthLayout>{children}</AuthLayout>
      )}
    </div>
  );
};

export default Layout;
