
'use client';

import { useRouter } from 'next/navigation';
import { AdminTabs } from '../components/AdminTabs';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <nav className="bg-[var(--card)] shadow border-b border-[var(--border)] sticky top-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[var(--foreground)]">Panou Administrare</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-[var(--destructive)] cursor-pointer hover:text-[var(--destructive)]/80 px-3 py-2 rounded-md text-sm font-medium bg-[var(--destructive)]/10 hover:bg-[var(--destructive)]/20 transition-colors shadow-sm"
              >
                Deconectare
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <main>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <AdminTabs/>
          </div>
        </main>
      </div>
    </div>
  );
}