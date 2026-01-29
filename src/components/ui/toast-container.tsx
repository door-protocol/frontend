'use client';

import { useEffect, useState } from 'react';
import { useToast, Toast, removeToast } from '@/hooks/useToast';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { subscribe } = useToast();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, [subscribe]);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return (
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return (
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        );
      case 'info':
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 sm:w-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg animate-fade-in ${getStyles(toast.type)}`}
        >
          <div className="mt-0.5 flex-shrink-0">{getIcon(toast.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium break-words">{toast.message}</p>
            {toast.link && (
              <a
                href={toast.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block break-all"
              >
                {toast.link.label}
              </a>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
