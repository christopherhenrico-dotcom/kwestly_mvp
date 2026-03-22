import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@/services';
import type { Submission, SubmissionStatus } from '@/types';

// Query keys
export const submissionKeys = {
  all: ['submissions'] as const,
  lists: () => [...submissionKeys.all, 'list'] as const,
  list: (filter: string) => [...submissionKeys.lists(), filter] as const,
  details: () => [...submissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...submissionKeys.details(), id] as const,
  my: () => [...submissionKeys.all, 'my'] as const,
  pending: () => [...submissionKeys.all, 'pending'] as const,
  quest: (questId: string) => [...submissionKeys.all, 'quest', questId] as const,
};

// Hook to get all submissions
export function useSubmissions(filter?: string) {
  return useQuery({
    queryKey: submissionKeys.list(filter || 'all'),
    queryFn: () => submissionService.getSubmissions(filter ? { filter } : undefined),
  });
}

// Hook to get a single submission
export function useSubmission(id: string) {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => submissionService.getSubmission(id),
    enabled: !!id,
  });
}

// Hook to get my submissions
export function useMySubmissions() {
  return useQuery({
    queryKey: submissionKeys.my(),
    queryFn: () => submissionService.getMySubmissions(),
  });
}

// Hook to get pending submissions
export function usePendingSubmissions() {
  return useQuery({
    queryKey: submissionKeys.pending(),
    queryFn: () => submissionService.getPendingSubmissions(),
  });
}

// Hook to get submissions for a quest
export function useQuestSubmissions(questId: string) {
  return useQuery({
    queryKey: submissionKeys.quest(questId),
    queryFn: () => submissionService.getQuestSubmissions(questId),
    enabled: !!questId,
  });
}

// Hook to create a submission
export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      file,
    }: {
      data: Partial<Submission>;
      file?: File;
    }) => submissionService.createSubmission(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: submissionKeys.my() });
    },
  });
}

// Hook to review a submission
export function useReviewSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      status,
      rejectionReason,
    }: {
      submissionId: string;
      status: 'approved' | 'rejected';
      rejectionReason?: string;
    }) => submissionService.reviewSubmission(submissionId, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: submissionKeys.pending() });
    },
  });
}

// Hook to delete a submission
export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: submissionKeys.my() });
    },
  });
}
