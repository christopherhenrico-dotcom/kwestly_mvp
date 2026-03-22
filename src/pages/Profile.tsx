import { FC } from 'react';
import { motion } from 'framer-motion';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import ExecutionScoreBadge from '@/components/user/ExecutionScoreBadge';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Zap, DollarSign, Award, Lock } from 'lucide-react';

const achievements = [
  { title: 'First Quest', desc: 'Complete your first quest', unlocked: true, icon: Zap },
  { title: 'Speed Demon', desc: '3 Quests in 24h', unlocked: false, icon: Trophy },
  { title: 'Elite Status', desc: 'Score 1000+', unlocked: false, icon: Award },
];

const Profile: FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  const displayName = user.name || user.github_username || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const executionScore = user.execution_score || 0;
  const questsCompleted = user.quests_completed || 0;
  const totalEarned = user.total_earned || 0;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 bg-secondary border border-border flex items-center justify-center font-mono text-2xl text-muted-foreground">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{displayName}</h1>
              <p className="font-mono text-sm text-muted-foreground">Developer</p>
            </div>
            <div className="ml-auto">
              <ExecutionScoreBadge score={executionScore} size="large" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Quests Completed', value: questsCompleted, icon: Zap, color: 'text-kwestly-cyan' },
              { label: 'Execution Score', value: executionScore, icon: Trophy, color: 'text-kwestly-green' },
              { label: 'Total Earned', value: `$${totalEarned.toLocaleString()}`, icon: DollarSign, color: 'text-kwestly-gold' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border border-border bg-card p-6"
              >
                <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} strokeWidth={1.5} />
                <div className={`font-mono text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="font-mono text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="font-display text-xl font-bold uppercase tracking-tighter text-foreground mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <div key={a.title} className={`border p-4 ${a.unlocked ? 'border-kwestly-gold bg-kwestly-gold/5' : 'border-border bg-card opacity-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {a.unlocked ? <a.icon className="w-4 h-4 text-kwestly-gold" strokeWidth={1.5} /> : <Lock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
                  <span className="font-mono text-sm font-bold text-foreground">{a.title}</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
