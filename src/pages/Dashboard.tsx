import { FC, useState, useMemo } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import QuestCard from '@/components/quest/QuestCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Zap, TrendingUp, Clock, Trophy, 
  ChevronDown, Sparkles, Target, Flame 
} from 'lucide-react';
import api from '@/services/api';
import { useQuestStore } from '@/stores/appStore';
import { useAuth } from '@/contexts/AuthContext';

const difficulties = ['all', 'easy', 'medium', 'hard', 'elite'] as const;
const difficultyColors = {
  all: 'text-primary',
  easy: 'text-kwestly-green',
  medium: 'text-kwestly-gold',
  hard: 'text-orange-500',
  elite: 'text-kwestly-red',
};

const Dashboard: FC = () => {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery, filter, setFilter } = useQuestStore();
  const [showFilters, setShowFilters] = useState(false);

  const { data: quests = [], isLoading } = useQuery({
    queryKey: ['quests', 'open'],
    queryFn: () => api.getQuests({ status: 'open' }),
  });

  const stats = useMemo(() => {
    if (!user) return { completed: 0, active: 0, earnings: 0 };
    return {
      completed: user.quests_completed || 0,
      active: 3,
      earnings: user.total_earned || 0,
    };
  }, [user]);

  const filteredQuests = useMemo(() => {
    let filtered = quests;
    
    if (filter !== 'all') {
      filtered = filtered.filter((q: any) => q.difficulty === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((q: any) => 
        q.title?.toLowerCase().includes(query) ||
        q.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [quests, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  Welcome back, Commander
                </p>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
                  Quest <span className="gradient-text">Terminal</span>
                </h1>
                <p className="font-mono text-sm text-muted-foreground mt-2">
                  Browse available missions and start earning
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <QuickStat 
                  icon={Trophy}
                  label="Completed"
                  value={stats.completed}
                  color="text-kwestly-gold"
                />
                <QuickStat 
                  icon={Flame}
                  label="Active"
                  value={stats.active}
                  color="text-kwestly-red"
                />
                <QuickStat 
                  icon={Zap}
                  label="Earned"
                  value={`$${stats.earnings}`}
                  color="text-kwestly-green"
                />
              </div>
            </div>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="glass-card p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search quests by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-input pl-12 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none rounded-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`glass-button px-4 py-3 font-mono text-sm flex items-center gap-2 rounded-lg ${
                    filter !== 'all' ? 'border-kwestly-cyan text-kwestly-cyan' : ''
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {filter !== 'all' && (
                    <span className="w-2 h-2 bg-kwestly-cyan rounded-full" />
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Filter Pills */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-border/30">
                      {difficulties.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setFilter(diff)}
                          className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            filter === diff
                              ? 'bg-primary/20 text-primary border border-primary/50'
                              : 'glass-button text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {diff === 'all' ? 'All Levels' : diff}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quest Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">
                  Available Missions
                </h2>
                <span className="px-2 py-0.5 bg-primary/10 text-primary font-mono text-xs rounded-full">
                  {filteredQuests.length}
                </span>
              </div>
              
              {searchQuery && (
                <p className="font-mono text-xs text-muted-foreground">
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/2 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredQuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredQuests.map((quest: any, i: number) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={{ ...quest, status: quest.status }} 
                    index={i} 
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {searchQuery ? 'No quests match your search' : 'No quests available'}
                </h3>
                <p className="font-mono text-sm text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search or filters'
                    : 'Check back soon for new missions'
                  }
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

interface QuickStatProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

function QuickStat({ icon: Icon, label, value, color }: QuickStatProps) {
  return (
    <div className="glass-card px-4 py-3 flex items-center gap-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <p className={`font-mono text-lg font-bold ${color}`}>{value}</p>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

export default Dashboard;
