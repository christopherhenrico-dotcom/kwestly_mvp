import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import pb from '@/services/pocketbase';
import type { Quest, User } from '@/types';
import type { QuestDifficulty } from '@/types';

// Filter type
export type QuestFilter = 'all' | QuestDifficulty;

// Extended Quest interface with computed fields
export interface DisplayQuest extends Quest {
  ttl: number;
  endTime: number;
  minScore: number;
  requirements?: string[];
  deliverables?: string;
  postedBy?: string;
  status?: 'open' | 'active' | 'submitted' | 'completed' | 'failed' | 'cancelled';
}

interface QuestState {
  quests: DisplayQuest[];
  activeQuests: DisplayQuest[];
  filter: QuestFilter;
  searchQuery: string;
  setFilter: (f: QuestFilter) => void;
  setSearchQuery: (q: string) => void;
  getFilteredQuests: () => DisplayQuest[];
  setQuests: (quests: DisplayQuest[]) => void;
  setActiveQuests: (quests: DisplayQuest[]) => void;
  acceptQuest: (id: string) => void;
  submitQuest: (id: string) => void;
}

// Helper to transform Quest to DisplayQuest
export function transformQuest(quest: Quest): DisplayQuest {
  return {
    ...quest,
    ttl: quest.ttl_hours * 3600000, // Convert hours to milliseconds
    endTime: quest.expires_at
      ? new Date(quest.expires_at).getTime()
      : Date.now() + (quest.ttl_hours * 3600000),
    minScore: quest.min_score,
    requirements: quest.description
      ? quest.description.split('\n').filter((line) => line.trim().startsWith('-')).map((line) => line.trim().replace(/^- /, ''))
      : [],
    deliverables: quest.submission_notes || 'Submit your work via PR link',
    postedBy: quest.expand?.poster_id?.username || 'Unknown',
    status: quest.status || 'open',
  };
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: [],
      activeQuests: [],
      filter: 'all',
      searchQuery: '',
      setFilter: (f) => set({ filter: f }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setQuests: (quests) => set({ quests }),
      setActiveQuests: (quests) => set({ activeQuests: quests }),
      acceptQuest: (id) => {
        const quest = get().quests.find((q) => q.id === id);
        if (quest) {
          set((state) => ({
            quests: state.quests.filter((q) => q.id !== id),
            activeQuests: [...state.activeQuests, { ...quest, status: 'active' }],
          }));
        }
      },
      submitQuest: (id) => {
        set((state) => ({
          activeQuests: state.activeQuests.map((q) =>
            q.id === id ? { ...q, status: 'submitted' as const } : q
          ),
        }));
      },
      getFilteredQuests: () => {
        const { quests, filter, searchQuery } = get();
        let filtered = quests;
        if (filter !== 'all') filtered = filtered.filter((q) => q.difficulty === filter);
        if (searchQuery)
          filtered = filtered.filter((q) =>
            q.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return filtered;
      },
    }),
    {
      name: 'quest-store',
    }
  )
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: pb.authStore.record as User | null,
  isAuthenticated: pb.authStore.isValid,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: () => {
    // This is a placeholder - actual login happens via OAuth or password
    set({ isAuthenticated: true });
  },
  logout: () => {
    pb.authStore.clear();
    set({ user: null, isAuthenticated: false });
  },
}));

// Subscribe to auth store changes
pb.authStore.onChange((token, record) => {
  useAuthStore.setState({
    user: record as User | null,
    isAuthenticated: !!token,
  });
});
