import { FC, useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import { useQuestStore } from '@/stores/appStore';
import { MOCK_QUESTS } from '@/data/mockData';

const Admin: FC = () => {
  const [tab, setTab] = useState<'post' | 'review'>('post');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bounty, setBounty] = useState('');
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [timeLimit, setTimeLimit] = useState('4');
  const [minScore, setMinScore] = useState('100');

  const submissions = useQuestStore(s => s.activeQuests.filter(q => q.status === 'submitted'));

  const handlePublish = () => {
    alert(`Quest "${title}" published! (Mock)`);
    setTitle(''); setDescription(''); setBounty('');
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
              {[
                { label: 'Title', value: title, set: setTitle, type: 'text' },
                { label: 'Bounty (USDC)', value: bounty, set: setBounty, type: 'number' },
                { label: 'Time Limit (hours)', value: timeLimit, set: setTimeLimit, type: 'number' },
                { label: 'Min Score Required', value: minScore, set: setMinScore, type: 'number' },
              ].map(field => (
                <div key={field.label}>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}

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

              <div>
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={6}
                  className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                onClick={handlePublish}
                disabled={!title || !bounty}
                className={`w-full py-4 font-mono font-bold text-lg border-2 transition-all ${
                  title && bounty
                    ? 'bg-primary text-primary-foreground border-primary glow-cyan'
                    : 'bg-secondary text-muted-foreground border-border cursor-not-allowed'
                }`}
              >
                PUBLISH QUEST
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.length === 0 && (
                <p className="font-mono text-sm text-muted-foreground py-10 text-center">No pending submissions.</p>
              )}
              {submissions.map(sub => (
                <div key={sub.id} className="border border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-foreground font-bold">{sub.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">${sub.bounty} USDC</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 font-mono text-xs font-bold border border-kwestly-green text-kwestly-green hover:bg-kwestly-green/10 transition-colors">
                      APPROVE
                    </button>
                    <button className="px-4 py-2 font-mono text-xs font-bold border border-kwestly-red text-kwestly-red hover:bg-kwestly-red/10 transition-colors">
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
