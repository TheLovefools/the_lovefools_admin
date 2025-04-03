import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export const cookiesDomainUrl =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'localhost'
    : `${process.env.NEXT_PUBLIC_API_URL}`;

const moveToNextPage = (router) => {
  const lastPathBeforeLogin = getCookie('lastPathBeforeLogin');
  if (lastPathBeforeLogin) {
    router.replace(lastPathBeforeLogin);
  } else {
    router.replace('/');
  }
};

const settingLastPath = async () => {
  if (
    typeof window !== 'undefined' &&
    (window.location.pathname === '/login' ||
      window.location.pathname === '/404')
  ) {
    // Do nothing if on specific paths
  } else {
    setCookie('lastPathBeforeLogin', window.location.pathname);
  }
};

export { moveToNextPage, settingLastPath };
