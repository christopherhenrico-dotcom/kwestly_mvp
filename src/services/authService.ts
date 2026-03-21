import pb from './pocketbase';
import type { User } from '@/types';

export const authService = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  // Get current user
  getCurrentUser(): User | null {
    return pb.authStore.record as User | null;
  },

  // Get auth token
  getToken(): string | null {
    return pb.authStore.token;
  },

  // Login with email/password
  async login(email: string, password: string): Promise<User> {
    const result = await pb.collection('users').authWithPassword(email, password);
    return result.record as User;
  },

  // Register with email/password
  async register(email: string, password: string, username: string): Promise<User> {
    const result = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      username,
    });

    // Auto-login after registration
    await this.login(email, password);
    return result as User;
  },

  // Logout
  logout(): void {
    pb.authStore.clear();
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    await pb.collection('users').requestPasswordReset(email);
  },

  // OAuth login with GitHub
  async loginWithGithub(): Promise<void> {
    await pb.collection('users').authWithOAuth2({
      provider: 'github',
      scopes: ['read:user', 'user:email'],
    });
  },

  // Get OAuth2 URL for redirect flow
  async getGithubAuthUrl(): Promise<{ url: string; codeVerifier: string }> {
    const result = await pb.collection('users').listAuthMethods();
    const githubProvider = result.oauth2?.find((p) => p.name === 'github');

    if (!githubProvider) {
      throw new Error('GitHub OAuth not configured');
    }

    // Store code verifier for later use
    localStorage.setItem('pb_code_verifier', githubProvider.codeVerifier);

    return {
      url: githubProvider.authUrl,
      codeVerifier: githubProvider.codeVerifier,
    };
  },

  // Complete OAuth2 login with code
  async completeGithubLogin(code: string, codeVerifier: string): Promise<User> {
    const result = await pb.collection('users').authWithOAuth2Code(
      'github',
      code,
      codeVerifier,
      window.location.origin + '/dashboard'
    );
    return result.record as User;
  },

  // Update user profile
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const result = await pb.collection('users').update(userId, data);
    return result as User;
  },

  // Refresh current user data
  async refreshUser(): Promise<User | null> {
    if (!this.isAuthenticated()) return null;
    const result = await pb.collection('users').authRefresh();
    return result.record as User;
  },
};

export default authService;
