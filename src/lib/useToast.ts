import { useState, useCallback } from 'react';
import { Toast } from '@shopify/polaris';
import React from 'react';

// @cursor-opt:start(toast-hook)
export interface ToastState {
  content: string;
  error?: boolean;
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((content: string, error = false, duration = 5000) => {
    setToast({ content, error, duration });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, false);
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, true);
  }, [showToast]);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const ToastComponent = toast ? React.createElement(Toast, {
    content: toast.content,
    error: toast.error,
    onDismiss: hideToast,
    duration: toast.duration,
  }) : null;

  return {
    showToast,
    showSuccess,
    showError,
    hideToast,
    ToastComponent,
  };
}
// @cursor-opt:end(toast-hook)
