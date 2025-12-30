// src/context/ToastContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  Toast, 
  ToastProvider as RadixToastProvider, 
  ToastViewport, 
  ToastTitle, 
  ToastDescription, 
  ToastClose 
} from '@/components/ui/Toast';

type ToastType = {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

type ToastContextType = {
  toast: (props: Omit<ToastType, 'id'>) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// In ToastContext.tsx
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = useCallback(({ title, description, variant = 'default' }: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, title, description, variant });
  }, []);

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      <RadixToastProvider>
        {children}
        <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-[390px] max-w-[100vw] m-0" />
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          {toast && (
            <Toast 
              key={toast.id} 
              variant={toast.variant} 
              className="w-[350px]"
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setToast(null);
                }
              }}
            >
              <div className="grid gap-1">
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
              </div>
              <ToastClose />
            </Toast>
          )}
        </div>
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}