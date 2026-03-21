import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questService } from '@/services';
import type { Quest } from '@/types';

// Query keys
export const questKeys = {
  all: ['quests'] as const,
  lists: () => [...questKeys.all, 'list'] as const,
  list: (filter: string) => [...questKeys.lists(), filter] as const,
  details: () => [...questKeys.all, 'detail'] as const,
  detail: (id: string) => [...questKeys.details(), id] as const,
  open: () => [...questKeys.all, 'open'] as const,
  active: () => [...questKeys.all, 'active'] as const,
  posted: () => [...questKeys.all, 'posted'] as const,
};

// Hook to get all quests
export function useQuests(filter?: string) {
  return useQuery({
    queryKey: questKeys.list(filter || 'all'),
    queryFn: () => questService.getQuests(filter ? { filter } : undefined),
  });
}

// Hook to get a single quest
export function useQuest(id: string) {
  return useQuery({
    queryKey: questKeys.detail(id),
    queryFn: () => questService.getQuest(id),
    enabled: !!id,
  });
}

// Hook to get open quests
export function useOpenQuests() {
  return useQuery({
    queryKey: questKeys.open(),
    queryFn: () => questService.getOpenQuests(),
  });
}

// Hook to get active quests
export function useActiveQuests() {
  return useQuery({
    queryKey: questKeys.active(),
    queryFn: () => questService.getActiveQuests(),
  });
}

// Hook to get posted quests
export function usePostedQuests() {
  return useQuery({
    queryKey: questKeys.posted(),
    queryFn: () => questService.getPostedQuests(),
  });
}

// Hook to create a quest
export function useCreateQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Quest>) => questService.createQuest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questKeys.lists() });
    },
  });
}

// Hook to accept a quest
export function useAcceptQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questId: string) => questService.acceptQuest(questId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: questKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: questKeys.open() });
      queryClient.invalidateQueries({ queryKey: questKeys.active() });
    },
  });
}

// Hook to submit quest work
export function useSubmitQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questId,
      data,
    }: {
      questId: string;
      data: { submission_url?: string; submission_notes?: string };
    }) => questService.submitQuest(questId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: questKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: questKeys.active() });
    },
  });
}

// Hook to update a quest
export function useUpdateQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Quest> }) =>
      questService.updateQuest(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: questKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: questKeys.lists() });
    },
  });
}

// Hook to delete a quest
export function useDeleteQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questService.deleteQuest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questKeys.lists() });
    },
  });
}
