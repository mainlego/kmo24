export interface LeadInteraction {
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  date: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'website' | 'phone' | 'email' | 'social' | 'referral' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';
  product?: {
    _id: string;
    name: string;
    slug: string;
    price: number;
  };
  message?: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  interactions: LeadInteraction[];
  company?: string;
  position?: string;
  budget?: number;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  nextContactDate?: string;
  result?: {
    dealAmount?: number;
    lostReason?: string;
    notes?: string;
  };
  isArchived: boolean;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  new: number;
  won: number;
  totalDeals: number;
  todayLeads: number;
  overdueLeads: number;
  byStatus: Array<{
    _id: string;
    count: number;
    totalBudget: number;
  }>;
  bySource: Array<{
    _id: string;
    count: number;
  }>;
  byPriority: Array<{
    _id: string;
    count: number;
  }>;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LeadResponse {
  success: boolean;
  data: Lead;
  message?: string;
}

export interface StatsResponse {
  success: boolean;
  data: LeadStats;
}

export const useLeads = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  /**
   * Получить список лидов с фильтрацией
   */
  const getLeads = async (params: {
    page?: number;
    limit?: number;
    status?: string;
    source?: string;
    priority?: string;
    assignedTo?: string;
    search?: string;
    sort?: string;
    isArchived?: boolean;
  } = {}) => {
    try {
      const query = new URLSearchParams();

      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.status) query.append('status', params.status);
      if (params.source) query.append('source', params.source);
      if (params.priority) query.append('priority', params.priority);
      if (params.assignedTo) query.append('assignedTo', params.assignedTo);
      if (params.search) query.append('search', params.search);
      if (params.sort) query.append('sort', params.sort);
      if (params.isArchived !== undefined) {
        query.append('isArchived', params.isArchived.toString());
      }

      const response = await apiFetch<LeadsResponse>(`/leads?${query.toString()}`);
      return response;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке лидов');
      throw err;
    }
  };

  /**
   * Получить лид по ID
   */
  const getLeadById = async (id: string) => {
    try {
      const response = await apiFetch<LeadResponse>(`/leads/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке лида');
      throw err;
    }
  };

  /**
   * Создать новый лид
   */
  const createLead = async (leadData: Partial<Lead>) => {
    try {
      const response = await apiFetch<LeadResponse>('/leads', {
        method: 'POST',
        body: leadData,
      });
      showSuccess(response.message || 'Лид успешно создан');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании лида');
      throw err;
    }
  };

  /**
   * Обновить лид
   */
  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const response = await apiFetch<LeadResponse>(`/leads/${id}`, {
        method: 'PUT',
        body: updates,
      });
      showSuccess(response.message || 'Лид успешно обновлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении лида');
      throw err;
    }
  };

  /**
   * Добавить взаимодействие с лидом
   */
  const addInteraction = async (leadId: string, interaction: {
    type: 'call' | 'email' | 'meeting' | 'note';
    description: string;
  }) => {
    try {
      const response = await apiFetch<LeadResponse>(`/leads/${leadId}/interactions`, {
        method: 'POST',
        body: interaction,
      });
      showSuccess(response.message || 'Взаимодействие добавлено');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при добавлении взаимодействия');
      throw err;
    }
  };

  /**
   * Удалить (архивировать) лид
   */
  const deleteLead = async (id: string) => {
    try {
      await apiFetch(`/leads/${id}`, {
        method: 'DELETE',
      });
      showSuccess('Лид успешно архивирован');
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении лида');
      throw err;
    }
  };

  /**
   * Получить статистику по лидам
   */
  const getLeadStats = async () => {
    try {
      const response = await apiFetch<StatsResponse>('/leads/stats');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке статистики');
      throw err;
    }
  };

  /**
   * Массовое обновление статуса лидов
   */
  const bulkUpdateStatus = async (leadIds: string[], status: string) => {
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: { updatedCount: number };
      }>('/leads/bulk-status', {
        method: 'POST',
        body: { leadIds, status },
      });
      showSuccess(response.message);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при массовом обновлении');
      throw err;
    }
  };

  /**
   * Экспортировать лиды в CSV
   */
  const exportLeads = async () => {
    try {
      const response = await fetch('/api/v1/leads/export', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Ошибка при экспорте');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showSuccess('Лиды успешно экспортированы');
    } catch (err: any) {
      showError(err.message || 'Ошибка при экспорте лидов');
      throw err;
    }
  };

  return {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    addInteraction,
    deleteLead,
    getLeadStats,
    bulkUpdateStatus,
    exportLeads,
  };
};