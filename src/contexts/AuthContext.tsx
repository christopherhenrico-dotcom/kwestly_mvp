import { useAuth as clerkUseAuth, useUser } from '@clerk/react';
import type { User } from '@/types';

export function useAuth() {
  const { isLoaded, isSignedIn, signOut, getToken, userId } = clerkUseAuth();
  const { user } = useUser();

  const clerkUser: User | null = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    name: user.fullName || user.username || '',
    github_username: user.username || '',
    avatar_url: user.imageUrl || '',
    execution_score: 0,
    total_earned: 0,
    quests_completed: 0,
    rank: 'bronze',
  } : null;

  return {
    user: clerkUser,
    userId,
    isLoading: !isLoaded,
    isAuthenticated: !!isSignedIn,
    logout: () => signOut(),
    getToken,
    refreshUser: async () => {},
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
