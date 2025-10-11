import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '@shopify/polaris';

// @cursor:start(toast-bus)
interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
}

interface ToastOptions {
  duration?: number;
  isError?: boolean;
}

interface ToastState {
  active: boolean;
  content: string;
  isError: boolean;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    active: false,
    content: '',
    isError: false
  });

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    setToast({
      active: true,
      content: message,
      isError: options.isError || false
    });

    // Auto-dismiss after duration
    setTimeout(() => {
      setToast(prev => ({ ...prev, active: false }));
    }, options.duration || 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, { isError: false });
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, { isError: true });
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast(message, { isError: false });
  }, [showToast]);

  const handleDismiss = () => {
    setToast(prev => ({ ...prev, active: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning }}>
      {children}
      {toast.active && (
        <Toast
          content={toast.content}
          onDismiss={handleDismiss}
          error={toast.isError}
        />
      )}
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
// @cursor:end(toast-bus)
