import { defineStore } from 'pinia';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyType: string;
  dealValue: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  manager: string;
  createdAt: string;
  notes: string;
}

interface CRMState {
  leads: Lead[];
}

export const useCRMStore = defineStore('crm', {
  state: (): CRMState => ({
    leads: [
      {
        id: '1',
        name: 'Алексей Петров',
        email: 'petrov@restaurant.ru',
        phone: '+7 (923) 456-78-90',
        company: 'Ресторан "Вкусно"',
        companyType: 'Ресторан',
        dealValue: 450000,
        status: 'qualified',
        manager: 'Иван Менеджеров',
        createdAt: '2025-10-25T10:30:00',
        notes: 'Интересует профессиональная печь для пиццы',
      },
      {
        id: '2',
        name: 'Мария Иванова',
        email: 'ivanova@cafe24.ru',
        phone: '+7 (923) 123-45-67',
        company: 'Кафе "24 часа"',
        companyType: 'Кафе',
        dealValue: 280000,
        status: 'proposal',
        manager: 'Иван Менеджеров',
        createdAt: '2025-10-28T14:20:00',
        notes: 'Нужен холодильный шкаф',
      },
      {
        id: '3',
        name: 'Сергей Козлов',
        email: 'kozlov@bakery.ru',
        phone: '+7 (923) 789-01-23',
        company: 'Пекарня "Свежий хлеб"',
        companyType: 'Пекарня',
        dealValue: 620000,
        status: 'negotiation',
        manager: 'Менеджер Менеджеров',
        createdAt: '2025-10-15T09:15:00',
        notes: 'Ищет подовую печь',
      },
      {
        id: '4',
        name: 'Ольга Смирнова',
        email: 'smirnova@bar.ru',
        phone: '+7 (923) 456-12-34',
        company: 'Бар "Веселый вечер"',
        companyType: 'Бар',
        dealValue: 180000,
        status: 'contacted',
        manager: 'Иван Менеджеров',
        createdAt: '2025-10-30T16:45:00',
        notes: 'Требуется барное оборудование',
      },
      {
        id: '5',
        name: 'Дмитрий Волков',
        email: 'volkov@hotel.ru',
        phone: '+7 (923) 567-89-01',
        company: 'Отель "Комфорт"',
        companyType: 'Отель',
        dealValue: 850000,
        status: 'won',
        manager: 'Менеджер Менеджеров',
        createdAt: '2025-09-20T11:00:00',
        notes: 'Куплено оборудование для ресторана отеля',
      },
      {
        id: '6',
        name: 'Елена Новикова',
        email: 'novikova@catering.ru',
        phone: '+7 (923) 234-56-78',
        company: 'Кейтеринг "Праздник"',
        companyType: 'Кейтеринг',
        dealValue: 320000,
        status: 'new',
        manager: 'Иван Менеджеров',
        createdAt: '2025-11-01T13:30:00',
        notes: 'Запрос на мобильное оборудование',
      },
      {
        id: '7',
        name: 'Павел Соколов',
        email: 'sokolov@pizzeria.ru',
        phone: '+7 (923) 345-67-89',
        company: 'Пиццерия "Итальяно"',
        companyType: 'Пиццерия',
        dealValue: 520000,
        status: 'qualified',
        manager: 'Иван Менеджеров',
        createdAt: '2025-10-20T15:00:00',
        notes: 'Нужна печь для пиццы и тестомес',
      },
      {
        id: '8',
        name: 'Анна Морозова',
        email: 'morozova@sushi.ru',
        phone: '+7 (923) 678-90-12',
        company: 'Суши-бар "Сакура"',
        companyType: 'Суши-бар',
        dealValue: 380000,
        status: 'proposal',
        manager: 'Менеджер Менеджеров',
        createdAt: '2025-10-22T11:20:00',
        notes: 'Интересует холодильная витрина',
      },
      {
        id: '9',
        name: 'Игорь Белов',
        email: 'belov@grill.ru',
        phone: '+7 (923) 890-12-34',
        company: 'Гриль-бар "Мясо"',
        companyType: 'Гриль-бар',
        dealValue: 420000,
        status: 'negotiation',
        manager: 'Иван Менеджеров',
        createdAt: '2025-10-18T09:30:00',
        notes: 'Рассматривает профессиональный гриль',
      },
      {
        id: '10',
        name: 'Татьяна Кузнецова',
        email: 'kuznetsova@confectionary.ru',
        phone: '+7 (923) 012-34-56',
        company: 'Кондитерская "Сладкий рай"',
        companyType: 'Кондитерская',
        dealValue: 290000,
        status: 'contacted',
        manager: 'Менеджер Менеджеров',
        createdAt: '2025-10-29T14:45:00',
        notes: 'Ищет кондитерскую печь',
      },
    ],
  }),

  getters: {
    totalLeads: (state) => state.leads.length,

    activeDeals: (state) =>
      state.leads.filter(l => ['qualified', 'proposal', 'negotiation'].includes(l.status)).length,

    totalValue: (state) =>
      state.leads
        .filter(l => l.status !== 'lost')
        .reduce((sum, lead) => sum + lead.dealValue, 0),

    wonDeals: (state) =>
      state.leads.filter(l => l.status === 'won').length,

    conversionRate: (state) => {
      const total = state.leads.filter(l => l.status !== 'lost').length;
      const won = state.leads.filter(l => l.status === 'won').length;
      return total > 0 ? Math.round((won / total) * 100) : 0;
    },

    leadsByStatus: (state) => (status: Lead['status']) =>
      state.leads.filter(l => l.status === status),

    salesFunnel: (state) => {
      const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won'];
      return statuses.map((status, index) => {
        const leads = state.leads.filter(l => l.status === status);
        const count = leads.length;
        const value = leads.reduce((sum, lead) => sum + lead.dealValue, 0);

        const labels: Record<Lead['status'], string> = {
          new: 'Новые лиды',
          contacted: 'Контакт установлен',
          qualified: 'Квалифицированы',
          proposal: 'Предложение отправлено',
          negotiation: 'Переговоры',
          won: 'Успешно закрыто',
          lost: 'Проиграны',
        };

        return {
          id: index + 1,
          status,
          name: labels[status],
          count,
          value,
        };
      });
    },
  },

  actions: {
    updateLeadStatus(leadId: string, newStatus: Lead['status']) {
      const lead = this.leads.find(l => l.id === leadId);
      if (lead) {
        lead.status = newStatus;
      }
    },

    deleteLead(leadId: string) {
      const index = this.leads.findIndex(l => l.id === leadId);
      if (index !== -1) {
        this.leads.splice(index, 1);
      }
    },

    addLead(lead: Lead) {
      this.leads.push(lead);
    },

    updateLead(leadId: string, updates: Partial<Lead>) {
      const lead = this.leads.find(l => l.id === leadId);
      if (lead) {
        Object.assign(lead, updates);
      }
    },
  },
});
