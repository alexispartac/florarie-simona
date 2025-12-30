// Create this file at /src/components/admin/AdminTabs.tsx
'use client';

import { useState } from 'react';
import { Package, ShoppingCart, Users, Settings } from 'lucide-react';
import OrdersTab from './OrdersTab';
import ProductsTab from './ProductsTab';
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
      id: 'users',
      name: 'Users',
      icon: <Users className="h-4 w-4 mr-2" />,
      component: <div className="p-6 text-gray-500">Users management coming soon</div>,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      component: <div className="p-6 text-gray-500">Settings coming soon</div>,
    },
  ];

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="bg-white">
        {activeComponent}
      </div>
    </div>
  );
}