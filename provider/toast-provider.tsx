'use client';

import { Toast, ToastContextType } from '@/types';
import clsx from 'clsx';
import { createContext, ReactNode, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<Toast>>([]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove sau 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 overflow-hidden rounded bg-white">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              'animate-fade-in flex items-center justify-center border-0 border-l-4 px-4 py-2 shadow-lg',
              toast.type === 'success' ? 'border-green-500' : '',
              toast.type === 'error' ? 'border-red-500' : '',
              toast.type === 'info' ? 'border-blue-500' : ''
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
