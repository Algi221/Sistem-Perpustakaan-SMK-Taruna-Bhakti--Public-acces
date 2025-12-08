'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import MainLayout from '@/components/MainLayout';

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="h-16"></div>
    </header>
  );
}

export default function DarkModeWrapper({ children }) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <MainLayout>
        {children}
      </MainLayout>
    </>
  );
}
