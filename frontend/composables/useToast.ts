import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export const useToast = () => {
  const show = (message: string, type: ToastType = 'info', duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;

    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration = 5000) => {
    return show(message, 'success', duration);
  };

  const error = (message: string, duration = 7000) => {
    return show(message, 'error', duration);
  };

  const warning = (message: string, duration = 6000) => {
    return show(message, 'warning', duration);
  };

  const info = (message: string, duration = 5000) => {
    return show(message, 'info', duration);
  };

  const clear = () => {
    toasts.value = [];
  };

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear,
  };
};
