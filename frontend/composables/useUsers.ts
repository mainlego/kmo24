import type { User, UserResponse } from '~/types';

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const useUsers = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  const getUsers = async (filters: UserFilters = {}) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });

      const response = await apiFetch<UsersResponse>(`/users?${query.toString()}`);
      return response;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке пользователей');
      throw err;
    }
  };

  const getUserById = async (id: string) => {
    try {
      const response = await apiFetch<UserResponse>(`/users/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке пользователя');
      throw err;
    }
  };

  const createUser = async (userData: Partial<User> & { password: string }) => {
    try {
      const response = await apiFetch<UserResponse>('/users', {
        method: 'POST',
        body: userData,
      });
      showSuccess('Пользователь успешно создан');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании пользователя');
      throw err;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const response = await apiFetch<UserResponse>(`/users/${id}`, {
        method: 'PUT',
        body: userData,
      });
      showSuccess('Пользователь успешно обновлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении пользователя');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiFetch(`/users/${id}`, {
        method: 'DELETE',
      });
      showSuccess('Пользователь успешно удален');
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении пользователя');
      throw err;
    }
  };

  const getUserStats = async () => {
    try {
      const response = await apiFetch<{
        success: boolean;
        data: {
          totalUsers: number;
          activeUsers: number;
          inactiveUsers: number;
          adminUsers: number;
          managerUsers: number;
          regularUsers: number;
          newUsersLast30Days: number;
        };
      }>('/users/stats');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке статистики');
      throw err;
    }
  };

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
  };
};
