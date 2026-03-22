import { FC } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import FilterBar from '@/components/quest/FilterBar';
import QuestCard from '@/components/quest/QuestCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useOpenQuests } from '@/hooks/useQuests';
import { transformQuest } from '@/stores/appStore';

const Dashboard: FC = () => {
  const { data: quests = [], isLoading } = useOpenQuests();
  const displayQuests = quests.map(transformQuest);

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
              {isLoading ? 'Loading...' : `${displayQuests.length} quests available`}
            </p>
          </div>

          <FilterBar />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border bg-card p-6">
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
              displayQuests.map((quest, i) => (
                <QuestCard key={quest.id} quest={quest} index={i} />
              ))
            )}
          </div>

          {!isLoading && displayQuests.length === 0 && (
            <div className="text-center py-20 font-mono text-muted-foreground">
              No open quests available. Check back soon.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
