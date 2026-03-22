import { FC, useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import { Loader2 } from 'lucide-react';
import { useCreateQuest, useQuests, useUpdateQuest } from '@/hooks/useQuests';
import { useAuth } from '@/contexts/AuthContext';

const Admin: FC = () => {
  const [tab, setTab] = useState<'post' | 'review'>('post');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bounty, setBounty] = useState('');
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [timeLimit, setTimeLimit] = useState('4');
  const [minScore, setMinScore] = useState('100');
  const { userId } = useAuth();

  const createQuest = useCreateQuest();
  const updateQuest = useUpdateQuest();
  const { data: allQuests = [] } = useQuests();
  
  const submittedQuests = allQuests.filter(q => q.status === 'submitted');

  const handlePublish = () => {
    if (!title || !bounty) return;
    
    createQuest.mutate(
      {
        title,
        description,
        bounty: parseFloat(bounty),
        difficulty: difficulty as 'easy' | 'medium' | 'hard' | 'elite',
        ttl_hours: parseInt(timeLimit) || 4,
        min_score: parseInt(minScore) || 100,
        status: 'open',
        poster_id: userId || '',
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setBounty('');
          setDifficulty('easy');
          setTimeLimit('4');
          setMinScore('100');
        },
        onError: (error) => {
          console.error('Failed to create quest:', error);
        },
      }
    );
  };

  const handleApprove = (questId: string) => {
    updateQuest.mutate(
      { id: questId, data: { status: 'completed' } },
      {
        onError: (error) => console.error('Failed to approve:', error),
      }
    );
  };

  const handleReject = (questId: string) => {
    updateQuest.mutate(
      { id: questId, data: { status: 'failed' } },
      {
        onError: (error) => console.error('Failed to reject:', error),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">
            Admin Panel
          </h1>

          <div className="flex gap-2 mb-6">
            {(['post', 'review'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all ${
                  tab === t ? 'bg-primary/10 text-primary border-primary' : 'text-muted-foreground border-border'
                }`}
              >
                {t === 'post' ? 'POST QUEST' : 'REVIEW SUBMISSIONS'}
              </button>
            ))}
          </div>

          {tab === 'post' ? (
            <div className="max-w-xl space-y-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Quest title..."
                  className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Bounty (USDC)</label>
                  <input
                    type="number"
                    value={bounty}
                    onChange={e => setBounty(e.target.value)}
                    placeholder="100"
                    className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Time Limit (hours)</label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={e => setTimeLimit(e.target.value)}
                    className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Min Score</label>
                  <input
                    type="number"
                    value={minScore}
                    onChange={e => setMinScore(e.target.value)}
                    className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Describe the quest requirements..."
                  className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                onClick={handlePublish}
                disabled={!title || !bounty || createQuest.isPending}
                className={`w-full py-4 font-mono font-bold text-lg border-2 transition-all ${
                  title && bounty && !createQuest.isPending
                    ? 'bg-primary text-primary-foreground border-primary glow-cyan'
                    : 'bg-secondary text-muted-foreground border-border cursor-not-allowed'
                }`}
              >
                {createQuest.isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'PUBLISH QUEST'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedQuests.length === 0 && (
                <p className="font-mono text-sm text-muted-foreground py-10 text-center">No pending submissions.</p>
              )}
              {submittedQuests.map(quest => (
                <div key={quest.id} className="border border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-foreground font-bold">{quest.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      ${quest.bounty} USDC • {quest.submission_url || 'No PR link'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(quest.id)}
                      disabled={updateQuest.isPending}
                      className="px-4 py-2 font-mono text-xs font-bold border border-kwestly-green text-kwestly-green hover:bg-kwestly-green/10 transition-colors disabled:opacity-50"
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={() => handleReject(quest.id)}
                      disabled={updateQuest.isPending}
                      className="px-4 py-2 font-mono text-xs font-bold border border-kwestly-red text-kwestly-red hover:bg-kwestly-red/10 transition-colors disabled:opacity-50"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
