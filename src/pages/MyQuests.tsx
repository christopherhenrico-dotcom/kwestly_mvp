import { FC, useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import QuestCard from '@/components/quest/QuestCard';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const tabs = [
  { key: 'active', label: 'IN PROGRESS' },
  { key: 'submitted', label: 'SUBMITTED' },
  { key: 'completed', label: 'COMPLETED' },
  { key: 'open', label: 'POSTED' },
];

const MyQuests: FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { user, userId } = useAuth();

  const { data: workerQuests = [], isLoading: workerLoading } = useQuery({
    queryKey: ['my-quests', 'worker'],
    queryFn: () => api.getQuests({ worker_id: userId || undefined }),
    enabled: !!userId,
  });

  const { data: allQuests = [], isLoading: allLoading } = useQuery({
    queryKey: ['my-quests', 'all'],
    queryFn: () => api.getQuests(),
    enabled: !!userId,
  });

  const isLoading = workerLoading || allLoading;

  const filteredQuests = activeTab === 'open' 
    ? allQuests.filter((q: any) => q.poster_id === userId)
    : workerQuests.filter((q: any) => q.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">My Quests</h1>

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
              {filteredQuests.map((quest: any, i: number) => (
                <QuestCard key={quest.id} quest={{ ...quest, status: quest.status }} index={i} showStatus />
              ))}
            </div>
          )}

          {!isLoading && filteredQuests.length === 0 && (
            <div className="text-center py-20 font-mono text-muted-foreground glass-card">
              {activeTab === 'active' ? 'No active quests. Hit the Terminal to grab one.' : `No ${activeTab} quests.`}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyQuests;
