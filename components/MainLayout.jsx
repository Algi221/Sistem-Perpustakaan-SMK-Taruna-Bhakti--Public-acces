'use client';

import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import NotificationToast from './NotificationToast';
import MessageCenter from './MessageCenter';

function RightSidebarFallback() {
  return (
    <aside className="w-[320px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex-shrink-0 sticky top-0 self-start">
      <div className="p-4">
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    </aside>
  );
}

export default function MainLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Jangan tampilkan sidebar di halaman login, register, dan landing page
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isLandingPage = pathname === '/';
  
  // Tampilkan layout dengan sidebar hanya untuk user (siswa/umum) dan bukan di halaman auth atau landing page
  const showSidebar = !isAuthPage && !isLandingPage && session && (session.user.role === 'siswa' || session.user.role === 'umum');

  if (!showSidebar) {
    return (
      <>
        {children}
        {session && (session.user.role === 'siswa' || session.user.role === 'umum') && <NotificationToast />}
      </>
    );
  }

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Sidebar - Sticky, follows scroll */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="w-full">
          {children}
        </div>
      </main>
      
      {/* Right Sidebar - Sticky, follows scroll */}
      <Suspense fallback={<RightSidebarFallback />}>
        <RightSidebar />
      </Suspense>
      
      {/* Notification Toast */}
      <NotificationToast />
      
      {/* Message Center */}
      <MessageCenter />
    </div>
  );
}
