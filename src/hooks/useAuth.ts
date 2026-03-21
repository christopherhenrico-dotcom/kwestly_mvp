import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import type { User } from '@/types';

// Query keys
export const authKeys = {
  user: ['auth', 'user'] as const,
};

// Hook to get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity,
    initialData: () => authService.getCurrentUser(),
  });
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  return authService.isAuthenticated();
}

// Hook to login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user, user);
    },
  });
}

// Hook to register
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => authService.register(email, password, username),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user, user);
    },
  });
}

// Hook to logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user, null);
      queryClient.clear();
    },
  });
}

// Hook to update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      authService.updateProfile(userId, data),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user, user);
    },
  });
}

// Hook to refresh user
export function useRefreshUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refreshUser(),
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(authKeys.user, user);
      }
    },
  });
}

// Hook for GitHub OAuth
export function useGithubAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.loginWithGithub(),
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(authKeys.user, user);
      }
    },
  });
}
