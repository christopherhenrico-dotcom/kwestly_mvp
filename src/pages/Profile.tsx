import { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Zap, DollarSign, Github, Star, GitPullRequest, 
  Code, Users, Loader2, TrendingUp, Target, Award,
  ExternalLink, RefreshCw
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import ExecutionScoreBadge from '@/components/user/ExecutionScoreBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useExecutionScore } from '@/hooks/useExecutionScore';

const Profile: FC = () => {
  const { user } = useAuth();
  const { score, activity, loading, error, refresh } = useExecutionScore();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = user.name || user.github_username || user.email?.split('@')[0] || 'Anonymous';
  const executionScore = score?.totalScore || user.execution_score || 0;
  const questsCompleted = user.quests_completed || 0;
  const totalEarned = user.total_earned || 0;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Your <span className="gradient-text">Profile</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Track your progress and achievements
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={displayName}
                    className="w-24 h-24 rounded-2xl border-2 border-primary/30 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-2 border-primary/30 bg-primary/10 flex items-center justify-center">
                    <span className="font-cyber text-3xl text-primary font-bold">
                      {displayName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2">
                  <ExecutionScoreBadge score={executionScore} size="large" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  {displayName}
                </h2>
                {user.github_username && (
                  <a
                    href={`https://github.com/${user.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 mb-3"
                  >
                    <Github className="w-4 h-4" />
                    @{user.github_username}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <p className="font-mono text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <QuickStat icon={Zap} value={questsCompleted} label="Completed" />
                <QuickStat icon={Trophy} value={executionScore} label="Score" color="text-primary" />
                <QuickStat icon={DollarSign} value={`$${totalEarned}`} label="Earned" color="text-kwestly-green" />
              </div>
            </div>
          </motion.div>

          {/* GitHub Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <Github className="w-5 h-5 text-primary" />
                GitHub Activity
              </h3>
              <button
                onClick={refresh}
                disabled={loading}
                className="p-2 glass-button rounded-lg"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="h-8 w-8 bg-primary/20 rounded-lg mb-2" />
                    <div className="h-6 w-16 bg-primary/20 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="glass-card p-8 text-center">
                <p className="font-mono text-sm text-muted-foreground">{error}</p>
                <button
                  onClick={refresh}
                  className="mt-4 px-4 py-2 glass-button rounded-lg font-mono text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  label="Stars"
                  value={activity?.stars || 0}
                  points={Math.round((activity?.stars || 0) * 0.5)}
                  color="text-kwestly-gold"
                />
              </div>
            )}
          </motion.div>

          {/* Score Breakdown */}
          {score && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Execution Score Breakdown
              </h3>

              <div className="glass-card p-6">
                <div className="space-y-4">
                  <ScoreBar 
                    label="Code Commits" 
                    value={score.breakdown.commits} 
                    max={2000} 
                    color="bg-primary" 
                    icon={Code}
                  />
                  <ScoreBar 
                    label="Pull Requests" 
                    value={score.breakdown.prsMerged} 
                    max={1500} 
                    color="bg-kwestly-green" 
                    icon={GitPullRequest}
                  />
                  <ScoreBar 
                    label="Repositories" 
                    value={score.breakdown.repos} 
                    max={500} 
                    color="bg-accent-purple" 
                    icon={Award}
                  />
                  <ScoreBar 
                    label="Code Reviews" 
                    value={score.breakdown.reviews} 
                    max={800} 
                    color="bg-kwestly-gold" 
                    icon={TrendingUp}
                  />
                  <ScoreBar 
                    label="Engagement" 
                    value={score.breakdown.engagement} 
                    max={1000} 
                    color="bg-kwestly-cyan" 
                    icon={Users}
                  />
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-border/30 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">Total Execution Score</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Rank: <span className={`font-bold ${
                        score.rank === 'elite' ? 'text-kwestly-gold' :
                        score.rank === 'gold' ? 'text-primary' :
                        score.rank === 'silver' ? 'text-gray-300' :
                        'text-orange-600'
                      }`}>{score.rank.toUpperCase()}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-cyber text-3xl font-bold text-primary text-glow-cyan">
                      {score.totalScore.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

interface QuickStatProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color?: string;
}

function QuickStat({ icon: Icon, value, label, color = 'text-foreground' }: QuickStatProps) {
  return (
    <div className="text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
      <p className={`font-cyber text-lg font-bold ${color}`}>{value}</p>
      <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  points: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, points, color }: StatCardProps) {
  return (
    <div className="glass-card p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color.replace('text-', 'bg-')}/10`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className={`font-cyber text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
      <p className="font-mono text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-mono text-[10px] text-primary">+{points.toLocaleString()} pts</p>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ElementType;
}

function ScoreBar({ label, value, max, color, icon: Icon }: ScoreBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm text-foreground">{label}</span>
        </div>
        <span className="font-mono text-sm text-muted-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

export default Profile;
