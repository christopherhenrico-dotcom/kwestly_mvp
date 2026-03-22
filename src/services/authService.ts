import pb from './pocketbase';
import type { User } from '@/types';

export const authService = {
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  getCurrentUser(): User | null {
    return pb.authStore.record as unknown as User;
  },

  getToken(): string | null {
    return pb.authStore.token;
  },

  async login(email: string, password: string): Promise<User> {
    const result = await pb.collection('users').authWithPassword(email, password);
    return result.record as unknown as User;
  },

  async register(email: string, password: string, name: string): Promise<User> {
    const result = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name,
    });
    await this.login(email, password);
    return result as unknown as User;
  },

  logout(): void {
    pb.authStore.clear();
  },

  async requestPasswordReset(email: string): Promise<void> {
    await pb.collection('users').requestPasswordReset(email);
  },

  async loginWithGithub(): Promise<void> {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    try {
      await pb.collection('users').authWithOAuth2({
        provider: 'github',
        redirectTo: redirectUrl,
      });
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      throw error;
    }
  },

  async refreshUser(): Promise<User | null> {
    if (!this.isAuthenticated()) return null;
    const result = await pb.collection('users').authRefresh();
    return result.record as unknown as User;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const result = await pb.collection('users').update(userId, data);
    return result as unknown as User;
  },
};

export default authService;
