import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboardLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }) {
  const session = await getSession();

  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  return <AdminDashboardLayoutClient>{children}</AdminDashboardLayoutClient>;
}

