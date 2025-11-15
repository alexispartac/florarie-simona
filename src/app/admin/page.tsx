'use client';
import React from 'react';
import { SidebarDemo } from './components/SideBar';
import Link from 'next/link';


const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-20 w-full text-center py-7 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700">
            <Link href="/admin/products" className="flex items-center justify-center gap-2">
              STOC SI PRODUSE SIMPLE
            </Link>
          </div>
          <div className="h-20 w-full text-center py-7 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700">
            <Link href="/admin/products-composed" className="flex items-center justify-center gap-2">
              PRODUSE COMPUSE
            </Link>
          </div>
          <div className="h-20 w-full text-center py-7 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700">
            <Link href="/admin/orders" className="flex items-center justify-center gap-2">
              COMENZI
            </Link>
          </div>
          <div className="h-20 w-full text-center py-7 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700">
            <Link href="/admin/clients" className="flex items-center justify-center gap-2">
              CLIENTI
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="h-full w-full text-center py-7">
              <Link href="/admin/close-period" className="flex items-center justify-center gap-2">
                Setare perioada de inchidere 
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="h-full w-full text-center py-7">
              <Link href="/admin/open-ads" className="flex items-center justify-center gap-2">
                Setare panou de deschidere
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="h-full w-full text-center py-7">
              <Link href="/admin/newsletter" className="flex items-center justify-center gap-2">
                Trimitere newsletter
              </Link>
            </div>
          </div>
        </div>

        <div>
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
  );
};

export default page;