import { useAuth, useUser } from '@clerk/react';
import type { User } from '@/types';

let cachedUser: User | null = null;

export function useCurrentUser() {
  const { user: clerkUser } = useUser();
  
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name: clerkUser.fullName || clerkUser.username || '',
    github_username: clerkUser.username || '',
    avatar_url: clerkUser.imageUrl || '',
    execution_score: cachedUser?.execution_score || 0,
    total_earned: cachedUser?.total_earned || 0,
    quests_completed: cachedUser?.quests_completed || 0,
    rank: cachedUser?.rank || 'bronze',
  } : null;

  if (user) {
    cachedUser = user;
  }

  return user;
}

export function useIsAuthenticated() {
  const { isSignedIn } = useAuth();
  return !!isSignedIn;
}

export function useLogout() {
  const { signOut } = useAuth();
  return {
    mutate: async () => {
      await signOut();
    },
    isPending: false,
  };
}

export function useAuthToken() {
  const { getToken } = useAuth();
  return {
    getToken,
    mutateAsync: async () => {
      return await getToken();
    },
  };
}
