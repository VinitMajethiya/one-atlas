import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (type: ToastType, message: string, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message, description, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, description, duration }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, duration);
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  }))
}));

export function useToast() {
  const { addToast, removeToast, toasts } = useToastStore();
  return {
    toasts,
    toast: (message: string, type: ToastType = 'info', description?: string, duration?: number) => {
      addToast(type, message, description, duration);
    },
    removeToast
  };
}
