import pb from './pocketbase';
import type { Quest, QuestStatus } from '@/types';

const QUESTS_COLLECTION = 'quests';

export const questService = {
  // Get all quests with optional filtering
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
    return result.items as Quest[];
  },

  // Get a single quest by ID
  async getQuest(id: string): Promise<Quest> {
    const result = await pb.collection(QUESTS_COLLECTION).getOne(id, {
      expand: 'poster_id,worker_id',
    });
    return result as Quest;
  },

  // Create a new quest
  async createQuest(data: Partial<Quest>): Promise<Quest> {
    const result = await pb.collection(QUESTS_COLLECTION).create(data);
    return result as Quest;
  },

  // Update a quest
  async updateQuest(id: string, data: Partial<Quest>): Promise<Quest> {
    const result = await pb.collection(QUESTS_COLLECTION).update(id, data);
    return result as Quest;
  },

  // Delete a quest
  async deleteQuest(id: string): Promise<void> {
    await pb.collection(QUESTS_COLLECTION).delete(id);
  },

  // Accept a quest (update status and worker)
  async acceptQuest(questId: string): Promise<Quest> {
    const userId = pb.authStore.record?.id;
    if (!userId) throw new Error('User not authenticated');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Default 24 hours

    const result = await pb.collection(QUESTS_COLLECTION).update(questId, {
      status: 'active' as QuestStatus,
      worker_id: userId,
      accepted_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });
    return result as Quest;
  },

  // Submit quest work
  async submitQuest(
    questId: string,
    submissionData: {
      submission_url?: string;
      submission_notes?: string;
    }
  ): Promise<Quest> {
    const result = await pb.collection(QUESTS_COLLECTION).update(questId, {
      status: 'submitted' as QuestStatus,
      submission_url: submissionData.submission_url,
      submission_notes: submissionData.submission_notes,
      submitted_at: new Date().toISOString(),
    });
    return result as Quest;
  },

  // Get open quests
  async getOpenQuests(): Promise<Quest[]> {
    return this.getQuests({
      filter: 'status = "open"',
      sort: '-created',
    });
  },

  // Get active quests for current user
  async getActiveQuests(): Promise<Quest[]> {
    const userId = pb.authStore.record?.id;
    if (!userId) throw new Error('User not authenticated');

    return this.getQuests({
      filter: `worker_id = "${userId}" && (status = "active" || status = "submitted")`,
      sort: '-accepted_at',
    });
  },

  // Get quests posted by current user
  async getPostedQuests(): Promise<Quest[]> {
    const userId = pb.authStore.record?.id;
    if (!userId) throw new Error('User not authenticated');

    return this.getQuests({
      filter: `poster_id = "${userId}"`,
      sort: '-created',
    });
  },
};

export default questService;
