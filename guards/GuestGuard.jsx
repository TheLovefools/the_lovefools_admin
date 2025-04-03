import { useEffect, ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function GuestGuard({ children }) {
  const isAuthenticated = Boolean(getCookie('isAuthenticated'));
  const router = useRouter();
  const pathname = usePathname();
  const [requestedLocation, setRequestedLocation] = useState(null);
  useEffect(() => {
    if (isAuthenticated) {
      // router.push('/'); // Redirect to login if not authenticated
      if (pathname == '/login') {
        router.push('/');
      } else if (
        pathname !== '/login' &&
        requestedLocation &&
        pathname !== requestedLocation
      ) {
        setRequestedLocation(null);
        router.push(requestedLocation);
      }
    }
  }, [isAuthenticated]);

  return !isAuthenticated ? children : null;
}
