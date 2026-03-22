import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import TopNav from '@/components/layout/TopNav';
import DifficultyBadge from '@/components/quest/DifficultyBadge';
import CountdownTimer from '@/components/quest/CountdownTimer';
import { useQuest } from '@/hooks/useQuests';
import { useAcceptQuest } from '@/hooks/useQuests';
import { transformQuest } from '@/stores/appStore';
import pb from '@/services/pocketbase';

const QuestDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quest, isLoading } = useQuest(id!);
  const acceptQuest = useAcceptQuest();

  const isAccepted = quest?.worker_id === pb.authStore.record?.id;
  const displayQuest = quest ? transformQuest(quest) : null;

  const handleAccept = () => {
    if (!id) return;
    acceptQuest.mutate(id, {
      onSuccess: () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f5ff', '#b537ff', '#39ff14'],
        });
        setTimeout(() => navigate('/my-quests'), 1500);
      },
      onError: (error) => {
        console.error('Failed to accept quest:', error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!quest || !displayQuest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground">
        Quest not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          BACK
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <DifficultyBadge difficulty={quest.difficulty} />
              <h1 className="font-display text-3xl font-bold text-foreground mt-3">{quest.title}</h1>
            </div>
            <div className="text-right">
              <div className="font-mono text-4xl font-bold text-kwestly-cyan text-glow-cyan">
                ${quest.bounty}
              </div>
              <span className="font-mono text-sm text-muted-foreground">USDC</span>
            </div>
          </div>

          <div className="flex gap-6 mb-8 font-mono text-sm text-muted-foreground border-y border-border py-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <CountdownTimer endTime={displayQuest.endTime} />
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" strokeWidth={1.5} />
              {quest.min_score}+ XP Required
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-bold text-lg text-foreground mb-3 uppercase tracking-tight">Description</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">{quest.description}</p>
          </div>

          {displayQuest.requirements && displayQuest.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display font-bold text-lg text-foreground mb-3 uppercase tracking-tight">Requirements</h2>
              <ul className="space-y-2">
                {displayQuest.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-kwestly-green mt-0.5 shrink-0" strokeWidth={1.5} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {displayQuest.deliverables && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-lg text-foreground mb-3 uppercase tracking-tight">Deliverables</h2>
              <p className="font-mono text-sm text-muted-foreground">{displayQuest.deliverables}</p>
            </div>
          )}

          {isAccepted ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/quest/${quest.id}/submit`)}
              className="w-full py-4 font-mono font-bold text-lg border-2 border-kwestly-green bg-kwestly-green/10 text-kwestly-green transition-all hover:bg-kwestly-green/20"
            >
              SUBMIT WORK →
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAccept}
              disabled={acceptQuest.isPending}
              className="w-full py-4 font-mono font-bold text-lg bg-primary text-primary-foreground border-2 border-primary glow-cyan-strong transition-all disabled:opacity-50"
            >
              {acceptQuest.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                'ACCEPT QUEST ⚡'
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestDetail;
