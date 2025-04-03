'use client';
import { Suspense, useState } from 'react';
import Header from './Header';
import AuthGuard from '../../guards/AuthGuard';
import Loader from '../common/Loader';
import Sidebar from './sidebar';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthGuard>
      <section className='flex w-full'>
        <Sidebar
          open={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div
          className={`relative z-10 ml-0 flex flex-1 flex-col overflow-hidden`}>
          <Header toggleSidebar={toggleSidebar} />

          <Suspense fallback={<Loader />}>
            <main className='scrollBar bg-bg-light w-full flex-1 overflow-y-auto p-4'>
              {children}
            </main>
          </Suspense>

          {/* <Footer /> */}
        </div>
        {isSidebarOpen && (
          <div
            className='fixed inset-0 z-20 bg-black opacity-50 lg:hidden'
            onClick={toggleSidebar}
          />
        )}
      </section>
    </AuthGuard>
  );
};

export default DashboardLayout;
