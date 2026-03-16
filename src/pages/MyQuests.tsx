import { FC, useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import QuestCard from '@/components/quest/QuestCard';
import { useQuestStore } from '@/stores/appStore';

const tabs = ['active', 'submitted', 'completed', 'failed'] as const;
const tabLabels: Record<string, string> = {
  active: 'IN PROGRESS',
  submitted: 'SUBMITTED',
  completed: 'COMPLETED',
  failed: 'FAILED',
};

const MyQuests: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('active');
  const activeQuests = useQuestStore(s => s.activeQuests);

  const filtered = activeQuests.filter(q => q.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">
            My Quests
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all ${
                  activeTab === tab
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-muted-foreground border-border hover:border-muted-foreground'
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((quest, i) => (
              <QuestCard key={quest.id} quest={quest} index={i} showStatus />
            ))}
          </div>

          {filtered.length === 0 && (
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
