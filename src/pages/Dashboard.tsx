import { FC } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import FilterBar from '@/components/quest/FilterBar';
import QuestCard from '@/components/quest/QuestCard';
import { useQuestStore } from '@/stores/appStore';

const Dashboard: FC = () => {
  const getFilteredQuests = useQuestStore(s => s.getFilteredQuests);
  const quests = getFilteredQuests();

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
              {quests.length} quests available
            </p>
          </div>

          <FilterBar />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {quests.map((quest, i) => (
              <QuestCard key={quest.id} quest={quest} index={i} />
            ))}
          </div>

          {quests.length === 0 && (
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
