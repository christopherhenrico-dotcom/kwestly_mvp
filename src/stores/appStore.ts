import { create } from 'zustand';
import { Quest, User, MOCK_QUESTS, MOCK_USER } from '@/data/mockData';

interface QuestState {
  quests: Quest[];
  activeQuests: Quest[];
  filter: string;
  searchQuery: string;
  setFilter: (f: string) => void;
  setSearchQuery: (q: string) => void;
  acceptQuest: (id: string) => void;
  submitQuest: (id: string) => void;
  getFilteredQuests: () => Quest[];
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: MOCK_QUESTS,
  activeQuests: [],
  filter: 'all',
  searchQuery: '',
  setFilter: (f) => set({ filter: f }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  acceptQuest: (id) => {
    const quest = get().quests.find(q => q.id === id);
    if (quest) {
      set(state => ({
        quests: state.quests.filter(q => q.id !== id),
        activeQuests: [...state.activeQuests, { ...quest, status: 'active' as const }],
      }));
    }
  },
  submitQuest: (id) => {
    set(state => ({
      activeQuests: state.activeQuests.map(q =>
        q.id === id ? { ...q, status: 'submitted' as const } : q
      ),
    }));
  },
  getFilteredQuests: () => {
    const { quests, filter, searchQuery } = get();
    let filtered = quests;
    if (filter !== 'all') filtered = filtered.filter(q => q.difficulty === filter);
    if (searchQuery) filtered = filtered.filter(q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered;
  },
}));

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USER,
  isAuthenticated: true,
  login: () => set({ user: MOCK_USER, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
