import pb from './pocketbase';
import type { User } from '@/types';

const USERS_COLLECTION = 'users';

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  earned: number;
  questsCompleted: number;
}

export const leaderboardService = {
  async getTopByScore(limit = 20): Promise<LeaderboardEntry[]> {
    const result = await pb.collection(USERS_COLLECTION).getList(1, limit, {
      sort: '-execution_score',
    });
    return result.items.map((user, index) => {
      const u = user as unknown as User;
      return {
        rank: index + 1,
        user: u,
        score: u.execution_score || 0,
        earned: u.total_earned || 0,
        questsCompleted: u.quests_completed || 0,
      };
    });
  },

  async getTopByEarnings(limit = 20): Promise<LeaderboardEntry[]> {
    const result = await pb.collection(USERS_COLLECTION).getList(1, limit, {
      sort: '-total_earned',
    });
    return result.items.map((user, index) => {
      const u = user as unknown as User;
      return {
        rank: index + 1,
        user: u,
        score: u.execution_score || 0,
        earned: u.total_earned || 0,
        questsCompleted: u.quests_completed || 0,
      };
    });
  },
};

export default leaderboardService;
