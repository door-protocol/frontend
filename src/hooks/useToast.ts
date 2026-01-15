import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCounter = 0;
let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener(toasts));
}

export function addToast(message: string, type: ToastType = 'info') {
  const id = `toast-${++toastCounter}`;
  toasts = [...toasts, { id, message, type }];
  notifyListeners();

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);

  return id;
}

export function removeToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id);
  notifyListeners();
}

export function useToast() {
  const [, setToasts] = useState<Toast[]>(toasts);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const toast = {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
    warning: (message: string) => addToast(message, 'warning'),
  };

  return { toast, subscribe, toasts };
}
