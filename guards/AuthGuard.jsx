import { settingLastPath } from '@/utils/Deeplink';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = Boolean(getCookie('isAuthenticated'));

  useEffect(() => {
    if (!isAuthenticated) {
      settingLastPath();
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? children : null;
};

export default AuthGuard;
