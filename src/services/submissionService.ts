import pb from './pocketbase';
import type { Submission, SubmissionStatus } from '@/types';

const SUBMISSIONS_COLLECTION = 'submissions';

export const submissionService = {
  async getSubmissions(options?: {
    filter?: string;
    sort?: string;
    expand?: string;
  }): Promise<Submission[]> {
    const result = await pb.collection(SUBMISSIONS_COLLECTION).getList(1, 100, {
      filter: options?.filter || '',
      sort: options?.sort || '-created',
      expand: options?.expand || 'quest_id,worker_id,reviewed_by',
    });
    return result.items as unknown as Submission[];
  },

  async getSubmission(id: string): Promise<Submission> {
    const result = await pb.collection(SUBMISSIONS_COLLECTION).getOne(id, {
      expand: 'quest_id,worker_id,reviewed_by',
    });
    return result as unknown as Submission;
  },

  async createSubmission(
    data: Partial<Submission>,
    file?: File
  ): Promise<Submission> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });
    if (file) {
      formData.append('file', file);
    }
    const result = await pb.collection(SUBMISSIONS_COLLECTION).create(formData);
    return result as unknown as Submission;
  },

  async updateSubmission(id: string, data: Partial<Submission>): Promise<Submission> {
    const result = await pb.collection(SUBMISSIONS_COLLECTION).update(id, data as Record<string, unknown>);
    return result as unknown as Submission;
  },

  async deleteSubmission(id: string): Promise<void> {
    await pb.collection(SUBMISSIONS_COLLECTION).delete(id);
  },

  async getQuestSubmissions(questId: string): Promise<Submission[]> {
    return this.getSubmissions({
      filter: `quest_id = "${questId}"`,
      sort: '-created',
    });
  },

  async getMySubmissions(): Promise<Submission[]> {
    const userId = pb.authStore.record?.id;
    if (!userId) throw new Error('User not authenticated');
    return this.getSubmissions({
      filter: `worker_id = "${userId}"`,
      sort: '-created',
    });
  },

  async reviewSubmission(
    submissionId: string,
    status: SubmissionStatus,
    rejectionReason?: string
  ): Promise<Submission> {
    const reviewerId = pb.authStore.record?.id;
    if (!reviewerId) throw new Error('User not authenticated');
    const data: Partial<Submission> = {
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    };
    if (rejectionReason) {
      data.rejaction_reason = rejectionReason;
    }
    return this.updateSubmission(submissionId, data);
  },

  async getPendingSubmissions(): Promise<Submission[]> {
    return this.getSubmissions({
      filter: 'status = "pending"',
      sort: '-created',
    });
  },

  getFileUrl(submission: Submission): string | null {
    if (!submission.file) return null;
    return pb.files.getUrl(
      { collectionId: SUBMISSIONS_COLLECTION, id: submission.id } as unknown as { collectionId: string; id: string },
      submission.file
    );
  },
};

export default submissionService;
