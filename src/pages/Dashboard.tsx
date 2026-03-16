import { FC, useState, useEffect } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import FilterBar from '@/components/quest/FilterBar';
import QuestCard from '@/components/quest/QuestCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuestStore } from '@/stores/appStore';

const Dashboard: FC = () => {
  const [loading, setLoading] = useState(true);
  const getFilteredQuests = useQuestStore(s => s.getFilteredQuests);
  const quests = getFilteredQuests();

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground">
              Quest Terminal
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-1">
              {loading ? 'Loading...' : `${quests.length} quests available`}
            </p>
          </div>

          <FilterBar />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="border bg-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))
            ) : (
              quests.map((quest, i) => (
                <QuestCard key={quest.id} quest={quest} index={i} />
              ))
            )}
          </div>

          {!loading && quests.length === 0 && (
            <div className="text-center py-20 font-mono text-muted-foreground">
              No quests match your filter. Try adjusting.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
