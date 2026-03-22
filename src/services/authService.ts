import pb from './pocketbase';
import type { User } from '@/types';

export const authService = {
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  getCurrentUser(): User | null {
    return pb.authStore.record as User | null;
  },

  getToken(): string | null {
    return pb.authStore.token;
  },

  async login(email: string, password: string): Promise<User> {
    const result = await pb.collection('users').authWithPassword(email, password);
    return result.record as User;
  },

  async register(email: string, password: string, username: string): Promise<User> {
    const result = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      username,
    });
    await this.login(email, password);
    return result as User;
  },

  logout(): void {
    pb.authStore.clear();
  },

  async requestPasswordReset(email: string): Promise<void> {
    await pb.collection('users').requestPasswordReset(email);
  },

  async loginWithGithub(): Promise<void> {
    try {
      await pb.collection('users').authWithOAuth2({
        provider: 'github',
        scopes: ['read:user', 'user:email'],
        callbackUrl: `${window.location.origin}/auth/callback`,
      });
    } catch (error) {
      console.error('OAuth login failed:', error);
      throw error;
    }
  },

  async refreshUser(): Promise<User | null> {
    if (!this.isAuthenticated()) return null;
    const result = await pb.collection('users').authRefresh();
    return result.record as User;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const result = await pb.collection('users').update(userId, data);
    return result as User;
  },
};

export default authService;
