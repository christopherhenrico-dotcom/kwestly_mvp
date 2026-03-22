import api from './api';
import type { Quest } from '@/types';

export const questService = {
  async getQuests(options?: {
    filter?: string;
    sort?: string;
    expand?: string;
  }): Promise<Quest[]> {
    const params: any = {};
    if (options?.filter) {
      if (options.filter.includes('status')) {
        const match = options.filter.match(/status\s*=\s*"([^"]+)"/);
        if (match) params.status = match[1];
      }
      if (options.filter.includes('worker_id')) {
        const match = options.filter.match(/worker_id\s*=\s*"([^"]+)"/);
        if (match) params.worker_id = match[1];
      }
      if (options.filter.includes('poster_id')) {
        const match = options.filter.match(/poster_id\s*=\s*"([^"]+)"/);
        if (match) params.poster_id = match[1];
      }
    }
    return api.getQuests(params) as Promise<Quest[]>;
  },

  async getQuest(id: string): Promise<Quest> {
    return api.getQuest(id) as Promise<Quest>;
  },

  async getOpenQuests(): Promise<Quest[]> {
    return this.getQuests({
      filter: 'status = "open"',
    });
  },

  async getActiveQuests(): Promise<Quest[]> {
    return this.getQuests({
      filter: 'status = "active"',
    });
  },

  async getMyQuests(): Promise<Quest[]> {
    return this.getQuests({});
  },

  async getPostedQuests(): Promise<Quest[]> {
    return this.getQuests({});
  },

  async createQuest(data: Partial<Quest>): Promise<Quest> {
    return api.createQuest(data as any) as Promise<Quest>;
  },

  async updateQuest(id: string, data: Partial<Quest>): Promise<Quest> {
    return data as Quest;
  },

  async deleteQuest(id: string): Promise<void> {
    await api.deleteQuest(id);
  },

  async acceptQuest(questId: string): Promise<Quest> {
    return api.acceptQuest(questId) as Promise<Quest>;
  },

  async submitQuest(
    questId: string,
    data: { submission_url?: string; submission_notes?: string }
  ): Promise<Quest> {
    return api.submitQuest(questId, data as any) as Promise<Quest>;
  },
};

export default questService;
