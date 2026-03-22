import { FC, useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import QuestCard from '@/components/quest/QuestCard';
import { Loader2 } from 'lucide-react';
import { useActiveQuests } from '@/hooks/useQuests';
import { useQuests } from '@/hooks/useQuests';
import { transformQuest } from '@/stores/appStore';

const tabs = [
  { key: 'active', label: 'IN PROGRESS' },
  { key: 'submitted', label: 'SUBMITTED' },
  { key: 'completed', label: 'COMPLETED' },
  { key: 'failed', label: 'FAILED' },
];

const MyQuests: FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { data: activeData = [], isLoading: activeLoading } = useActiveQuests();
  const { data: allData = [], isLoading: allLoading } = useQuests();

  const isLoading = activeLoading || allLoading;
  
  const allQuests = [...activeData, ...allData];
  const transformed = allQuests.map(transformQuest);
  const filtered = transformed.filter(q => q.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">
            My Quests
          </h1>

          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-muted-foreground border-border hover:border-muted-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((quest, i) => (
                <QuestCard key={quest.id} quest={quest} index={i} showStatus />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 font-mono text-muted-foreground">
              {activeTab === 'active' ? 'No active quests. Hit the Terminal to grab one.' : `No ${activeTab} quests.`}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyQuests;
