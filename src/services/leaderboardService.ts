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
      sort: '-executionScore',
    });
    return result.items.map((user, index) => ({
      rank: index + 1,
      user: user as User,
      score: (user as User).executionScore || 0,
      earned: (user as User).totalEarned || 0,
      questsCompleted: (user as User).questsCompleted || 0,
    }));
  },

  async getTopByEarnings(limit = 20): Promise<LeaderboardEntry[]> {
    const result = await pb.collection(USERS_COLLECTION).getList(1, limit, {
      sort: '-totalEarned',
    });
    return result.items.map((user, index) => ({
      rank: index + 1,
      user: user as User,
      score: (user as User).executionScore || 0,
      earned: (user as User).totalEarned || 0,
      questsCompleted: (user as User).questsCompleted || 0,
    }));
  },
};

export default leaderboardService;
