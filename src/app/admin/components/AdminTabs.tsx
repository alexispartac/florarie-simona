// Create this file at /src/components/admin/AdminTabs.tsx
'use client';

import { useState } from 'react';
import { Package, ShoppingCart, Users, Settings, Folder, Calendar, Gift, Sparkles, Tag, Store, Menu, X } from 'lucide-react';
import OrdersTab from './OrdersTab';
import ProductsTab from './ProductsTab';
import CollectionsTab from './CollectionsTab';
import EventsTab from './EventsTab';
import ExtrasTab from './ExtrasTab';
import { SeasonalCollectionsTab } from './SeasonalCollectionsTab';
import StoreSettingsTab from './StoreSettingsTab';
import Link from 'next/link';

type Tab = {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs: Tab[] = [
    {
      id: 'store-settings',
      name: 'Status Magazin',
      icon: <Store className="h-5 w-5" />,
      component: <StoreSettingsTab />,
    },
    {
      id: 'orders',
      name: 'Comenzi',
      icon: <ShoppingCart className="h-5 w-5" />,
      component: <OrdersTab />,
    },
    {
      id: 'products',
      name: 'Produse',
      icon: <Package className="h-5 w-5" />,
      component: <ProductsTab />,
    },
    {
      id: 'extras',
      name: 'Extra-uri',
      icon: <Gift className="h-5 w-5" />,
      component: <ExtrasTab />,
    },
    {
      id: 'colections',
      name: 'Colecții',
      icon: <Folder className="h-5 w-5" />,
      component: <CollectionsTab />,
    },
    {
      id: 'seasonal-collections',
      name: 'Colecții Sezon',
      icon: <Sparkles className="h-5 w-5" />,
      component: <SeasonalCollectionsTab />,
    },
    {
      id: 'events',
      name: 'Evenimente',
      icon: <Calendar className="h-5 w-5" />,
      component: <EventsTab />,
    },
    {
      id: 'discounts',
      name: 'Reduceri',
      icon: <Tag className="h-5 w-5" />,
      component: (
        <div className="p-6">
          <Link
            href="/admin/discounts"
            className="inline-flex items-center px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--hover-primary)] transition-colors"
          >
            <Tag className="h-5 w-5 mr-2" />
            Gestionează Coduri Reducere
          </Link>
        </div>
      ),
    },
    {
      id: 'users',
      name: 'Utilizatori',
      icon: <Users className="h-5 w-5" />,
      component: <div className="p-6 text-[var(--muted-foreground)]">Gestionare utilizatori disponibilă în curând</div>,
    },
    {
      id: 'settings',
      name: 'Setări',
      icon: <Settings className="h-5 w-5" />,
      component: <div className="p-6 text-[var(--muted-foreground)]">Setări disponibile în curând</div>,
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;
  const activeTabName = tabs.find(tab => tab.id === activeTab)?.name;

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 flex items-center justify-between text-[var(--foreground)] shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Menu className="h-5 w-5" />
            <span className="font-semibold">{activeTabName || 'Meniu'}</span>
          </div>
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Left Sidebar Navigation - Desktop always visible, Mobile collapsible */}
      <div className={`${
        isMobileMenuOpen ? 'block' : 'hidden lg:block'
      } w-full lg:w-64 flex-shrink-0`}>
        <nav className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden lg:sticky lg:top-6">
          <div className="p-4 border-b border-[var(--border)] hidden lg:block">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Panou Admin</h2>
          </div>
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-l-4 border-[var(--primary)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] border-l-4 border-transparent'
                } w-full py-3 px-4 font-medium text-sm flex items-center gap-3 transition-all duration-200`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
        {activeComponent}
      </div>
    </div>
  );
}