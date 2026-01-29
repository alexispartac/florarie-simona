// Create this file at /src/components/admin/AdminTabs.tsx
'use client';

import { useState } from 'react';
import { Package, ShoppingCart, Users, Settings, Folder, Calendar } from 'lucide-react';
import OrdersTab from './OrdersTab';
import ProductsTab from './ProductsTab';
import CollectionsTab from './CollectionsTab';
import EventsTab from './EventsTab';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

type Tab = {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState('orders');
//   const pathname = usePathname();

  const tabs: Tab[] = [
    {
      id: 'orders',
      name: 'Orders',
      icon: <ShoppingCart className="h-4 w-4 mr-2" />,
      component: <OrdersTab />,
    },
    {
      id: 'products',
      name: 'Products',
      icon: <Package className="h-4 w-4 mr-2" />,
      component: <ProductsTab />,
    },
    {
      id: 'colections',
      name: 'Collections',
      icon: <Folder className="h-4 w-4 mr-2" />,
      component: <CollectionsTab />,
    },
    {
      id: 'events',
      name: 'Evenimente',
      icon: <Calendar className="h-4 w-4 mr-2" />,
      component: <EventsTab />,
    },
    {
      id: 'users',
      name: 'Users',
      icon: <Users className="h-4 w-4 mr-2" />,
      component: <div className="p-6 text-[var(--muted-foreground)]">Users management coming soon</div>,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      component: <div className="p-6 text-[var(--muted-foreground)]">Settings coming soon</div>,
    },
  ];

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
      <div className="border-b border-[var(--border)]">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="bg-[var(--card)]">
        {activeComponent}
      </div>
    </div>
  );
}