import type { User } from '@/types';

export function getClerkUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = (window as any).__clerk_user;
    if (!user) return null;
    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      name: user.fullName || user.username || '',
      github_username: user.username || '',
      avatar_url: user.imageUrl || '',
      execution_score: 0,
      total_earned: 0,
      quests_completed: 0,
      rank: 'bronze',
    };
  } catch {
    return null;
  }
}

export const authService = {
  async getToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    try {
      const clerk = (window as any).__Clerk__;
      if (clerk && typeof clerk.getToken === 'function') {
        return await clerk.getToken();
      }
      return null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const user = (window as any).__clerk_user;
    return !!user;
  },

  getCurrentUser(): User | null {
    return getClerkUser();
  },

  async refreshUser(): Promise<User | null> {
    return getClerkUser();
  },

  async updateProfile(_userId: string, data: Partial<User>): Promise<User> {
    return { ...getClerkUser(), ...data } as User;
  },
};

export default authService;
