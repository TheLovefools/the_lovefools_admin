import React, { useEffect, useRef, useState } from 'react';
import { Navbar, NavbarContent } from '@nextui-org/react';
import { useAppDispatch, useAppSelector } from '@/redux/selector';
import { handleLogout } from '@/redux/auth/auth-slice';
import { useRouter } from 'next/navigation';
import {
  ArrowRightStartOnRectangleIcon,
  Bars3BottomRightIcon,
} from '@heroicons/react/24/outline';
import { getUserInfo } from '@/redux/user-info/userInfoSelector';
import Image from 'next/image';
import img from '../../public/images/logo.png';
import img2 from '../../public/images/logo.png';
import { deleteCookie } from 'cookies-next';
import Button from '../common/Button';
import useMediaQuery from '@/hooks/useMediaQuery';

const Header = ({ toggleSidebar }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getUserInfo);

  const logout = async () => {
    await dispatch(handleLogout());
    deleteCookie('lastPathBeforeLogin');
    router.push('/login');
  };

  const isMdScreen = useMediaQuery('(min-width: 768px)');
  const isSmScreen = useMediaQuery('(max-width: 767px)');

  return (
    <>
      <div className='z-999 dark:bg-boxdark sticky top-0 flex w-full overflow-x-hidden bg-white shadow dark:drop-shadow-none'>
        <Navbar
          isBordered
          className='w-full shadow-md'
          classNames={{
            wrapper: 'w-full max-w-full p-0 pr-6',
          }}>
          <NavbarContent className='md:hidden'>
            <div
              onClick={() => toggleSidebar()}
              className='cursor-pointer px-5'>
              <Bars3BottomRightIcon className='h-8 w-8 cursor-pointer' />
            </div>
          </NavbarContent>
          {isMdScreen && (
            <NavbarContent>
              <div
                className='mt-2 cursor-pointer pl-6'
                onClick={() => router.push('/')}>
                <Image
                  width={150}
                  height={150}
                  src={img}
                  alt='logo'
                />
              </div>
            </NavbarContent>
          )}

          {isSmScreen && (
            <NavbarContent>
              <div
                className='mt-2 mt-[-2px] cursor-pointer pl-6'
                onClick={() => router.push('/')}>
                <Image
                  style={{ maxWidth: 'none', marginLeft: '-32px' }}
                  width={120}
                  height={120}
                  src={img2}
                  alt='logo'
                />
              </div>
            </NavbarContent>
          )}

          <NavbarContent justify='end'>
            <h3 className='w-max font-semibold'>
              {user && user.fullName ? user.fullName : ''}
            </h3>
            <Button onClick={logout}>
              Logout{' '}
              <ArrowRightStartOnRectangleIcon className='text-black-500 h-5 w-5' />
            </Button>
          </NavbarContent>
        </Navbar>
      </div>
    </>
  );
};

export default Header;
