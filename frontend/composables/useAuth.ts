import type { User, LoginCredentials, RegisterData, AuthResponse, UserResponse } from '~/types';

export const useAuth = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();
  const { mergeCart } = useCart();

  const user = useState<User | null>('auth.user', () => null);
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'manager');

  /**
   * Вход
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
      });

      if (process.client) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      user.value = response.data.user;
      showSuccess(`Добро пожаловать, ${response.data.user.firstName}!`);

      // Слияние гостевой корзины с пользовательской
      await mergeCart();

      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при входе');
      throw err;
    }
  };

  /**
   * Регистрация
   */
  const register = async (data: RegisterData) => {
    try {
      const response = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: data,
      });

      if (process.client) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      user.value = response.data.user;
      showSuccess('Регистрация прошла успешно!');

      // Слияние гостевой корзины с пользовательской
      await mergeCart();

      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при регистрации');
      throw err;
    }
  };

  /**
   * Выход
   */
  const logout = async () => {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
      });

      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }

      user.value = null;
      showSuccess('Вы успешно вышли из системы');

      // Редирект на главную
      navigateTo('/');
    } catch (err: any) {
      showError(err.message || 'Ошибка при выходе');
      throw err;
    }
  };

  /**
   * Получить текущего пользователя
   */
  const fetchCurrentUser = async () => {
    try {
      if (!process.client) return null;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        user.value = null;
        return null;
      }

      const response = await apiFetch<UserResponse>('/auth/me');
      user.value = response.data;
      return response.data;
    } catch (err: any) {
      // Если токен невалидный, очищаем хранилище
      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      user.value = null;
      return null;
    }
  };

  /**
   * Обновить токен
   */
  const refreshToken = async () => {
    try {
      if (!process.client) return null;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await apiFetch<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
      });

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      user.value = response.data.user;
      return response.data;
    } catch (err: any) {
      // Если refresh токен невалидный, очищаем хранилище
      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      user.value = null;
      return null;
    }
  };

  /**
   * Обновить профиль
   */
  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await apiFetch<UserResponse>('/auth/profile', {
        method: 'PUT',
        body: updates,
      });

      user.value = response.data;
      showSuccess('Профиль успешно обновлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении профиля');
      throw err;
    }
  };

  /**
   * Изменить пароль
   */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: { currentPassword, newPassword },
      });

      showSuccess('Пароль успешно изменен');
    } catch (err: any) {
      showError(err.message || 'Ошибка при изменении пароля');
      throw err;
    }
  };

  /**
   * Запрос на восстановление пароля
   */
  const forgotPassword = async (email: string) => {
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });

      showSuccess('Инструкции отправлены на email');
    } catch (err: any) {
      showError(err.message || 'Ошибка при отправке инструкций');
      throw err;
    }
  };

  /**
   * Сброс пароля
   */
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword },
      });

      showSuccess('Пароль успешно изменен');
      navigateTo('/login');
    } catch (err: any) {
      showError(err.message || 'Ошибка при сбросе пароля');
      throw err;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshToken,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  };
};
