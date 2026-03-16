import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import { Trophy, Medal } from 'lucide-react';

const leaderboardData = [
  { rank: 1, username: 'zeroday_dev', score: 1420, earned: 8500, quests: 42 },
  { rank: 2, username: 'bytecrusher', score: 1280, earned: 7200, quests: 38 },
  { rank: 3, username: 'null_ptr', score: 1150, earned: 6100, quests: 31 },
  { rank: 4, username: 'cyberdev_42', score: 850, earned: 1240, quests: 12 },
  { rank: 5, username: 'rust_lord', score: 780, earned: 2800, quests: 15 },
  { rank: 6, username: 'async_queen', score: 720, earned: 2400, quests: 14 },
  { rank: 7, username: 'git_wizard', score: 690, earned: 1900, quests: 11 },
  { rank: 8, username: 'deploy_ninja', score: 620, earned: 1500, quests: 9 },
];

const rankColors: Record<number, string> = {
  1: 'text-kwestly-gold glow-gold',
  2: 'text-gray-300',
  3: 'text-orange-400',
};

const Leaderboard: FC = () => {
  const [tab, setTab] = useState<'score' | 'earnings'>('score');

  const sorted = tab === 'score'
    ? [...leaderboardData].sort((a, b) => b.score - a.score)
    : [...leaderboardData].sort((a, b) => b.earned - a.earned);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">
            Leaderboard
          </h1>

          <div className="flex gap-2 mb-6">
            {(['score', 'earnings'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all ${
                  tab === t ? 'bg-primary/10 text-primary border-primary' : 'text-muted-foreground border-border'
                }`}
              >
                {t === 'score' ? 'HIGHEST SCORES' : 'TOP EARNERS'}
              </button>
            ))}
          </div>

          <div className="border border-border">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-border font-mono text-xs text-muted-foreground uppercase">
              <span>Rank</span>
              <span className="col-span-2">User</span>
              <span>{tab === 'score' ? 'Score' : 'Earned'}</span>
              <span>Quests</span>
            </div>

            {sorted.map((user, i) => (
              <motion.div
                key={user.username}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-5 gap-4 px-6 py-4 border-b border-border last:border-0 font-mono text-sm ${
                  i < 3 ? 'bg-card' : ''
                }`}
              >
                <span className={`font-bold ${rankColors[i + 1] || 'text-muted-foreground'}`}>
                  #{i + 1}
                </span>
                <span className="col-span-2 text-foreground font-medium">{user.username}</span>
                <span className={tab === 'score' ? 'text-kwestly-purple' : 'text-kwestly-green'}>
                  {tab === 'score' ? user.score : `$${user.earned}`}
                </span>
                <span className="text-muted-foreground">{user.quests}</span>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
