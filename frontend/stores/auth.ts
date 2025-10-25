import { defineStore } from 'pinia';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '~/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * Получить полное имя пользователя
     */
    fullName: (state): string => {
      if (!state.user) return '';
      return state.user.fullName || `${state.user.firstName} ${state.user.lastName}`;
    },

    /**
     * Проверить роль пользователя
     */
    isAdmin: (state): boolean => state.user?.role === 'admin',
    isManager: (state): boolean => state.user?.role === 'manager',
    isUser: (state): boolean => state.user?.role === 'user',
  },

  actions: {
    /**
     * Инициализация (проверка токенов при загрузке)
     */
    async init() {
      if (process.client) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
          this.isAuthenticated = true;

          // Получаем информацию о пользователе
          await this.fetchUser();
        }
      }
    },

    /**
     * Регистрация
     */
    async register(data: RegisterData) {
      this.isLoading = true;
      this.error = null;

      try {
        const { apiFetch } = useApi();
        const response = await apiFetch<AuthResponse>('/auth/register', {
          method: 'POST',
          body: data,
        });

        if (response.success && response.data) {
          this.setAuth(response.data);
        }

        return response;
      } catch (error: any) {
        this.error = error.data?.error || 'Ошибка регистрации';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Вход
     */
    async login(credentials: LoginCredentials) {
      this.isLoading = true;
      this.error = null;

      try {
        const { apiFetch } = useApi();
        const response = await apiFetch<AuthResponse>('/auth/login', {
          method: 'POST',
          body: credentials,
        });

        if (response.success && response.data) {
          this.setAuth(response.data);
        }

        return response;
      } catch (error: any) {
        this.error = error.data?.error || 'Ошибка входа';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Выход
     */
    async logout() {
      try {
        const { apiFetch } = useApi();
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: { refreshToken: this.refreshToken },
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.clearAuth();
      }
    },

    /**
     * Получение информации о пользователе
     */
    async fetchUser() {
      try {
        const { apiFetch } = useApi();
        const response = await apiFetch<{ success: boolean; data: User }>('/auth/me');

        if (response.success && response.data) {
          this.user = response.data;
          this.isAuthenticated = true;
        }
      } catch (error) {
        console.error('Fetch user error:', error);
        this.clearAuth();
      }
    },

    /**
     * Обновление профиля
     */
    async updateProfile(data: Partial<User>) {
      this.isLoading = true;
      this.error = null;

      try {
        const { apiFetch } = useApi();
        const response = await apiFetch<{ success: boolean; data: User }>('/auth/profile', {
          method: 'PUT',
          body: data,
        });

        if (response.success && response.data) {
          this.user = response.data;
        }

        return response;
      } catch (error: any) {
        this.error = error.data?.error || 'Ошибка обновления профиля';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Изменение пароля
     */
    async changePassword(currentPassword: string, newPassword: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const { apiFetch } = useApi();
        const response = await apiFetch('/auth/change-password', {
          method: 'PUT',
          body: { currentPassword, newPassword },
        });

        // После смены пароля выходим из системы
        await this.logout();

        return response;
      } catch (error: any) {
        this.error = error.data?.error || 'Ошибка изменения пароля';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Обновление токенов
     */
    async refreshTokens() {
      if (!this.refreshToken) {
        this.clearAuth();
        return;
      }

      try {
        const { apiFetch } = useApi();
        const response = await apiFetch<{
          success: boolean;
          data: { accessToken: string; refreshToken: string };
        }>('/auth/refresh', {
          method: 'POST',
          body: { refreshToken: this.refreshToken },
        });

        if (response.success && response.data) {
          this.accessToken = response.data.accessToken;
          this.refreshToken = response.data.refreshToken;

          if (process.client) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
        }
      } catch (error) {
        console.error('Refresh tokens error:', error);
        this.clearAuth();
      }
    },

    /**
     * Установка данных аутентификации
     */
    setAuth(data: { user: User; accessToken: string; refreshToken: string }) {
      this.user = data.user;
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.isAuthenticated = true;

      if (process.client) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    },

    /**
     * Очистка данных аутентификации
     */
    clearAuth() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;

      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
  },
});
