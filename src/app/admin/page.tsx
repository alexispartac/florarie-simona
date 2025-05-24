import React from 'react'
import { SidebarDemo } from "./components/SideBar";
import Link from 'next/link';

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          <div
            className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
          > 
            <Link
              href="/admin/products"
              className="flex items-center justify-center gap-2">
                STOC SI PRODUSE SIMPLE 
            </Link>
          </div>
          <div
            className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
          > 
            <Link
              href="/admin/products-composed"
              className="flex items-center justify-center gap-2">
                PRODUSE COMPUSE
            </Link>
          </div>
          <div
            className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
          > 
            <Link
              href="/admin/orders"
              className="flex items-center justify-center gap-2">
                COMENZI
            </Link>
          </div>
          <div
            className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
          > 
            <Link
              href="/admin/clients"
              className="flex items-center justify-center gap-2">
                CLIENTI
            </Link>
          </div>
        </div>
        <div className="flex flex-1 gap-2">
            <div
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <div className="h-full w-full text-center py-7">
                <Link
                  href="/admin/statistics"
                  className="flex items-center justify-center gap-2">
                    STATISTICI
                </Link>
                {/* Add your statistics content here */}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const page = () => {
  return (
    <SidebarDemo>
      <Dashboard />
    </SidebarDemo>
  )
}

export default page