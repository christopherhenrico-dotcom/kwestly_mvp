import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import { Loader2 } from 'lucide-react';
import api from '@/services/api';

const Leaderboard: FC = () => {
  const [tab, setTab] = useState<'score' | 'earnings'>('score');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sort = tab === 'score' ? 'execution_score' : 'total_earned';
        const data = await api.getLeaderboard(sort);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const rankColors: Record<number, string> = {
    1: 'text-kwestly-gold',
    2: 'text-gray-300',
    3: 'text-orange-400',
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">Leaderboard</h1>

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

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="glass-card">
              <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-border/30 font-mono text-xs text-muted-foreground uppercase">
                <span>Rank</span>
                <span className="col-span-2">User</span>
                <span>{tab === 'score' ? 'Score' : 'Earned'}</span>
                <span>Quests</span>
              </div>

              {users.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`grid grid-cols-5 gap-4 px-6 py-4 border-b border-border/30 last:border-0 font-mono text-sm ${i < 3 ? 'bg-white/5' : ''}`}
                >
                  <span className={`font-bold ${rankColors[i + 1] || 'text-muted-foreground'}`}>#{i + 1}</span>
                  <span className="col-span-2 text-foreground font-medium flex items-center gap-2">
                    {user.avatar_url && <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full" />}
                    {user.name || user.github_username || 'Anonymous'}
                  </span>
                  <span className={tab === 'score' ? 'text-primary' : 'text-kwestly-green'}>
                    {tab === 'score' ? user.execution_score : `$${user.total_earned}`}
                  </span>
                  <span className="text-muted-foreground">{user.quests_completed}</span>
                </motion.div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-10 font-mono text-muted-foreground">No data yet.</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
