import pb from './pocketbase';
import type { Quest } from '@/types';

const QUESTS_COLLECTION = 'quests';

export const questService = {
  async getQuests(options?: {
    filter?: string;
    sort?: string;
    expand?: string;
  }): Promise<Quest[]> {
    const result = await pb.collection(QUESTS_COLLECTION).getList(1, 100, {
      filter: options?.filter || '',
      sort: options?.sort || '-created',
      expand: options?.expand || 'poster_id,worker_id',
    });
    return result.items as unknown as Quest[];
  },

  async getQuest(id: string): Promise<Quest> {
    const result = await pb.collection(QUESTS_COLLECTION).getOne(id, {
      expand: 'poster_id,worker_id',
    });
    return result as unknown as Quest;
  },

  async getOpenQuests(): Promise<Quest[]> {
    return this.getQuests({
      filter: 'status = "open"',
      sort: '-created',
    });
  },

  async getActiveQuests(): Promise<Quest[]> {
    const userId = pb.authStore.record?.id;
    if (!userId) return [];
    return this.getQuests({
      filter: `worker_id = "${userId}" && status = "active"`,
      sort: '-created',
    });
  },

  async getMyQuests(): Promise<Quest[]> {
    const userId = pb.authStore.record?.id;
    if (!userId) return [];
    return this.getQuests({
      filter: `worker_id = "${userId}"`,
      sort: '-created',
    });
  },

  async getPostedQuests(): Promise<Quest[]> {
    const userId = pb.authStore.record?.id;
    if (!userId) return [];
    return this.getQuests({
      filter: `poster_id = "${userId}"`,
      sort: '-created',
    });
  },

  async createQuest(data: Partial<Quest>): Promise<Quest> {
    const result = await pb.collection(QUESTS_COLLECTION).create(data as Record<string, unknown>);
    return result as unknown as Quest;
  },

  async updateQuest(id: string, data: Partial<Quest>): Promise<Quest> {
    const result = await pb.collection(QUESTS_COLLECTION).update(id, data as Record<string, unknown>);
    return result as unknown as Quest;
  },

  async deleteQuest(id: string): Promise<void> {
    await pb.collection(QUESTS_COLLECTION).delete(id);
  },

  async acceptQuest(questId: string): Promise<Quest> {
    const userId = pb.authStore.record?.id;
    if (!userId) throw new Error('Not authenticated');
    
    return this.updateQuest(questId, {
      worker_id: userId,
      status: 'active',
      accepted_at: new Date().toISOString(),
    });
  },

  async submitQuest(
    questId: string,
    data: { submission_url?: string; submission_notes?: string }
  ): Promise<Quest> {
    return this.updateQuest(questId, {
      status: 'submitted',
      submission_url: data.submission_url,
      submission_notes: data.submission_notes,
      submitted_at: new Date().toISOString(),
    });
  },
};

export default questService;
