import api from './api';
import type { Submission, SubmissionStatus } from '@/types';

export const submissionService = {
  async getSubmissions(options?: {
    filter?: string;
    sort?: string;
    expand?: string;
  }): Promise<Submission[]> {
    return api.getSubmissions('') as Promise<Submission[]>;
  },

  async getSubmission(id: string): Promise<Submission> {
    return {} as Submission;
  },

  async createSubmission(
    data: Partial<Submission>,
    _file?: File
  ): Promise<Submission> {
    return {} as Submission;
  },

  async updateSubmission(id: string, data: Partial<Submission>): Promise<Submission> {
    return { ...data } as Submission;
  },

  async deleteSubmission(id: string): Promise<void> {
  },

  async getQuestSubmissions(questId: string): Promise<Submission[]> {
    return api.getSubmissions(questId) as Promise<Submission[]>;
  },

  async getMySubmissions(): Promise<Submission[]> {
    return api.getMySubmissions() as Promise<Submission[]>;
  },

  async reviewSubmission(
    submissionId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ): Promise<Submission> {
    return api.reviewQuest(submissionId, { status, rejection_reason: rejectionReason }) as Promise<Submission>;
  },

  async getPendingSubmissions(): Promise<Submission[]> {
    return [];
  },

  getFileUrl(submission: Submission): string | null {
    return null;
  },
};

export default submissionService;
