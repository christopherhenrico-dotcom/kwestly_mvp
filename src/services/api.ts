const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}/api${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  githubLogin() {
    window.location.href = `${API_URL}/api/auth/github`;
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('user');
  }

  // Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async updateProfile(data: { name?: string; avatar_url?: string; wallet_address?: string }) {
    return this.request<any>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getLeaderboard(sort = 'execution_score', limit = 20) {
    return this.request<any[]>(`/users/leaderboard/top?sort=${sort}&limit=${limit}`);
  }

  // Quests
  async getQuests(params?: { status?: string; difficulty?: string; worker_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.worker_id) searchParams.set('worker_id', params.worker_id);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<any[]>(`/quests${query}`);
  }

  async getQuest(id: string) {
    return this.request<any>(`/quests/${id}`);
  }

  async createQuest(data: { title: string; description?: string; bounty: number; difficulty?: string; min_score?: number; ttl_hours?: number }) {
    return this.request<any>('/quests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptQuest(id: string) {
    return this.request<any>(`/quests/${id}/accept`, { method: 'POST' });
  }

  async submitQuest(id: string, data: { submission_url: string; submission_notes?: string }) {
    return this.request<any>(`/quests/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async reviewQuest(id: string, data: { status: 'approved' | 'rejected'; rejection_reason?: string }) {
    return this.request<any>(`/quests/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteQuest(id: string) {
    return this.request<{ success: boolean }>(`/quests/${id}`, { method: 'DELETE' });
  }

  // Submissions
  async getSubmissions(questId: string) {
    return this.request<any[]>(`/submissions/quest/${questId}`);
  }

  async getMySubmissions() {
    return this.request<any[]>('/submissions/my');
  }

  // Transactions
  async getMyTransactions() {
    return this.request<any[]>('/transactions/my');
  }

  async getTransactionStats() {
    return this.request<any>('/transactions/stats');
  }
}

export const api = new ApiClient();
export default api;
