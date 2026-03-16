import { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import TopNav from '@/components/layout/TopNav';
import { useQuestStore } from '@/stores/appStore';
import { ArrowLeft } from 'lucide-react';

const Submit: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeQuests, submitQuest } = useQuestStore();
  const quest = activeQuests.find(q => q.id === id);
  const [prLink, setPrLink] = useState('');
  const [notes, setNotes] = useState('');

  if (!quest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground">
        Quest not found or not accepted.
      </div>
    );
  }

  const isValid = prLink.startsWith('https://github.com/');

  const handleSubmit = () => {
    if (!id || !isValid) return;
    submitQuest(id);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#39ff14', '#00f5ff'] });
    setTimeout(() => navigate('/my-quests'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> BACK
        </button>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">{quest.title}</h1>
        <p className="font-mono text-sm text-muted-foreground mb-8">Submit your work for review</p>

        <div className="space-y-6">
          <div>
            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              GitHub PR Link *
            </label>
            <input
              type="url"
              value={prLink}
              onChange={e => setPrLink(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Any context for the reviewer..."
              className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <motion.button
            whileHover={isValid ? { scale: 1.01 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-4 font-mono font-bold text-lg border-2 transition-all ${
              isValid
                ? 'bg-kwestly-green/10 text-kwestly-green border-kwestly-green hover:bg-kwestly-green/20'
                : 'bg-secondary text-muted-foreground border-border cursor-not-allowed'
            }`}
          >
            SUBMIT WORK 🚀
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Submit;
