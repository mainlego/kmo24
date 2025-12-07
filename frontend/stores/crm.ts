import { defineStore } from 'pinia';
import { useLeads, type Lead } from '~/composables/useLeads';

interface CRMState {
  leads: Lead[];
  stats: {
    total: number;
    new: number;
    won: number;
    totalDeals: number;
    byStatus: Array<{ _id: string; count: number; totalBudget: number }>;
    todayLeads: number;
    overdueLeads: number;
    bySource: Array<{ _id: string; count: number }>;
    byPriority: Array<{ _id: string; count: number }>;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useCRMStore = defineStore('crm', {
  state: (): CRMState => ({
    leads: [],
    stats: null,
    loading: false,
    error: null,
  }),

  getters: {
    totalLeads: (state) => state.leads.length,

    activeDeals: (state) =>
      state.leads.filter(l => ['contacted', 'qualified', 'negotiation'].includes(l.status)).length,

    totalValue: (state) =>
      state.leads.reduce((sum, lead) => sum + (lead.budget || lead.dealValue || 0), 0),

    conversionRate: (state) => {
      const total = state.leads.length;
      if (total === 0) return 0;
      const won = state.leads.filter(l => l.status === 'won').length;
      return Math.round((won / total) * 100);
    },

    salesFunnel: (state) => {
      const statuses = ['new', 'contacted', 'qualified', 'negotiation', 'won'];
      return statuses.map(status => ({
        stage: status,
        count: state.leads.filter(l => l.status === status).length,
        value: state.leads
          .filter(l => l.status === status)
          .reduce((sum, l) => sum + (l.budget || l.dealValue || 0), 0),
      }));
    },

    // Возвращает функцию для фильтрации лидов по статусу
    leadsByStatus: (state) => {
      return (status: string) => state.leads.filter(l => l.status === status);
    },
  },

  actions: {
    async fetchLeads(filters?: any) {
      this.loading = true;
      this.error = null;
      try {
        const { getLeads } = useLeads();
        const response = await getLeads(filters);

        // Преобразуем данные для обратной совместимости
        this.leads = response.data.map((lead: any) => ({
          ...lead,
          id: lead._id, // добавляем id для обратной совместимости
          dealValue: lead.budget, // маппинг budget на dealValue
          manager: lead.assignedTo?.firstName
            ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
            : 'Не назначен',
          companyType: lead.tags?.[0] || 'Не указан',
        }));
      } catch (err: any) {
        this.error = err.message || 'Ошибка при загрузке лидов';
        console.error('Error fetching leads:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      try {
        const { getLeadStats } = useLeads();
        const stats = await getLeadStats();
        this.stats = stats;
      } catch (err: any) {
        console.error('Error fetching stats:', err);
      }
    },

    async addLead(leadData: Partial<Lead>) {
      try {
        const { createLead } = useLeads();
        const response = await createLead({
          ...leadData,
          budget: leadData.dealValue || leadData.budget, // маппинг обратно
        });

        const newLead = {
          ...response,
          id: response._id,
          dealValue: response.budget,
          manager: response.assignedTo?.firstName
            ? `${response.assignedTo.firstName} ${response.assignedTo.lastName}`
            : 'Не назначен',
          companyType: response.tags?.[0] || 'Не указан',
        };

        this.leads.push(newLead);
        return newLead;
      } catch (err: any) {
        this.error = err.message || 'Ошибка при создании лида';
        throw err;
      }
    },

    async updateLead(id: string, updates: Partial<Lead>) {
      try {
        const { updateLead } = useLeads();
        const response = await updateLead(id, {
          ...updates,
          budget: updates.dealValue || updates.budget,
        });

        const index = this.leads.findIndex(l => l._id === id || l.id === id);
        if (index !== -1) {
          this.leads[index] = {
            ...response,
            id: response._id,
            dealValue: response.budget,
            manager: response.assignedTo?.firstName
              ? `${response.assignedTo.firstName} ${response.assignedTo.lastName}`
              : 'Не назначен',
            companyType: response.tags?.[0] || 'Не указан',
          };
        }

        return response;
      } catch (err: any) {
        this.error = err.message || 'Ошибка при обновлении лида';
        throw err;
      }
    },

    async deleteLead(id: string) {
      try {
        const { deleteLead } = useLeads();
        await deleteLead(id);
        this.leads = this.leads.filter(l => l._id !== id && l.id !== id);
      } catch (err: any) {
        this.error = err.message || 'Ошибка при удалении лида';
        throw err;
      }
    },

    async exportLeads() {
      try {
        const { exportLeads } = useLeads();
        await exportLeads();
      } catch (err: any) {
        this.error = err.message || 'Ошибка при экспорте лидов';
        throw err;
      }
    },

    // Методы для обратной совместимости
    addNote(leadId: string, note: string) {
      const { addInteraction } = useLeads();
      return addInteraction(leadId, 'note', note);
    },

    updateStatus(leadId: string, status: Lead['status']) {
      return this.updateLead(leadId, { status });
    },

    // Алиас для канбан доски
    async updateLeadStatus(leadId: string, status: Lead['status']) {
      return this.updateLead(leadId, { status });
    },
  },
});