'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SidebarConfig from './sidebar-config';
import { SidebarItem } from './SidebarItem';
import { useAppSelector } from '@/redux/selector';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Avatar } from '@nextui-org/react';

const Sidebar = ({ open, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMenuItemActive = (href, subItems) => {
    // If the current path exactly matches the href
    if (pathname === href) {
      return true;
    }

    // If any subitem is active, main menu should be considered active
    if (subItems && subItems.some((item) => isMenuItemActive(item.href))) {
      return true;
    }

    // If the current path starts with the href followed by '/'
    if (pathname.startsWith(href) && pathname[href.length] === '/') {
      return true;
    }

    return false;
  };

  if (!isAuthenticated) return null;

  const handleMenuItemClick = () => {
    if (window.innerWidth <= 480) {
      toggleSidebar();
    }
  };

  const renderSidebarItems = () => {
    const items = SidebarConfig.map((item) => {
      return { ...item };
    });

    if (!items) {
      return null;
    }

    return items.map((item, index) => {
      return (
        <SidebarItem
          key={index}
          title={item.name}
          icon={item.icon}
          href={item.href}
          isActive={isMenuItemActive(item.href)}
          disabled={item.disabled ? item.disabled : false}
          isOpen={open}
          onClick={handleMenuItemClick}
          isMenuItemActive={isMenuItemActive}
        />
      );
    });
  };

  return (
    <div
      className={`min-h-screen ${
        open
          ? `${
              isMobile ? 'fixed left-0 top-0 z-50' : ''
            } sidebar-transition w-72 bg-green-900`
          : isMobile
            ? 'fixed left-0 top-0 z-50 h-full w-full bg-green-900 px-4 text-gray-100 duration-500'
            : 'sidebar-transition w-16 bg-green-900'
      } ${isMobile && !open ? 'hidden' : ''} text-gray-100 duration-500`}
      style={{
        zIndex: isMobile && !open ? '-1' : !isMobile && !open ? '20' : '50',
      }}>
      {open ? (
        <div className='h-22'>
          <div className='mt-5 flex flex-col items-center justify-center '>
            <div className='flex-none sm:flex sm:items-center'>
              <Avatar
                as='button'
                className='h-15 w-15 rounded-full border-4 border-gray-200'
                color='primary'
                size='sm'
                src={``}
                showFallback
              />
            </div>
            <h3 className='mt-3 text-center'>Admin</h3>
          </div>
        </div>
      ) : (
        <div className='mt-22'></div>
      )}

      <div
        className={`relative flex flex-col gap-20 transition-all duration-300`}>
        <div
          className='menu-btn z-10	 cursor-pointer'
          onClick={() => toggleSidebar()}>
          <ChevronLeftIcon
            className={`h-3 w-3  ${
              open ? 'rotate-180' : ''
            } text-green-800 transition-all duration-300`}
          />
        </div>

        <div
          className='hide-scrollbar relative mt-4 flex max-h-full flex-col pb-5'
          style={{
            maxHeight: 'calc(100vh - 40px)',
            overflowY: 'auto',
          }}>
          {renderSidebarItems()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
