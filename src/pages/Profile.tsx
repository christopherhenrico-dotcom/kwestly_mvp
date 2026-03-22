import { FC } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, DollarSign, Github, Star, GitPullRequest, Code, Users, Loader2 } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import ExecutionScoreBadge from '@/components/user/ExecutionScoreBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useExecutionScore } from '@/hooks/useExecutionScore';

const Profile: FC = () => {
  const { user } = useAuth();
  const { score, activity, loading, error } = useExecutionScore();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  const displayName = user.name || user.github_username || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const executionScore = score?.totalScore || user.execution_score || 0;
  const questsCompleted = user.quests_completed || 0;
  const totalEarned = user.total_earned || 0;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-6 mb-10">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-20 h-20 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-secondary border border-border flex items-center justify-center font-mono text-2xl text-muted-foreground">
                {initials}
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{displayName}</h1>
              {user.github_username && (
                <a
                  href={`https://github.com/${user.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-1"
                >
                  <Github className="w-4 h-4" />
                  @{user.github_username}
                </a>
              )}
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

          <h2 className="font-display text-xl font-bold uppercase tracking-tighter text-foreground mb-4">GitHub Stats</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 font-mono text-sm text-muted-foreground border border-border">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Code}
                label="Commits"
                value={activity?.commits || 0}
                points={score?.breakdown.commits || 0}
                color="text-primary"
              />
              <StatCard
                icon={GitPullRequest}
                label="PRs Merged"
                value={activity?.prsMerged || 0}
                points={score?.breakdown.prsMerged || 0}
                color="text-kwestly-green"
              />
              <StatCard
                icon={Users}
                label="Followers"
                value={activity?.followers || 0}
                points={Math.round((activity?.followers || 0) * 2)}
                color="text-accent-purple"
              />
              <StatCard
                icon={Star}
                label="Stars Earned"
                value={activity?.stars || 0}
                points={Math.round((activity?.stars || 0) * 0.5)}
                color="text-kwestly-gold"
              />
            </div>
          )}

          <h2 className="font-display text-xl font-bold uppercase tracking-tighter text-foreground mb-4">Score Breakdown</h2>
          {score && (
            <div className="border border-border bg-card p-6 mb-8">
              <div className="space-y-4">
                <ScoreBar label="Commits" value={score.breakdown.commits} max={2000} color="bg-primary" />
                <ScoreBar label="Pull Requests" value={score.breakdown.prsMerged} max={1500} color="bg-kwestly-green" />
                <ScoreBar label="Repositories" value={score.breakdown.repos} max={500} color="bg-accent-purple" />
                <ScoreBar label="Reviews" value={score.breakdown.reviews} max={800} color="bg-kwestly-gold" />
                <ScoreBar label="Engagement" value={score.breakdown.engagement} max={1000} color="bg-kwestly-cyan" />
              </div>
              <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                <span className="font-mono text-lg font-bold text-foreground">Total Score</span>
                <span className="font-mono text-2xl font-bold text-primary">{score.totalScore}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  points: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, points, color }: StatCardProps) {
  return (
    <div className="border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      </div>
      <div className={`font-mono text-2xl font-bold ${color}`}>{value}</div>
      <div className="font-mono text-xs text-muted-foreground">+{points} points</div>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

function ScoreBar({ label, value, max, color }: ScoreBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-foreground">{value}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default Profile;
