import { FC, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import TopNav from '@/components/layout/TopNav';
import DifficultyBadge from '@/components/quest/DifficultyBadge';
import CountdownTimer from '@/components/quest/CountdownTimer';
import { useQuestStore } from '@/stores/appStore';

const QuestDetail: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { acceptQuest, activeQuests, quests } = useQuestStore();

  const quest = [...quests, ...activeQuests].find(q => q.id === id) || MOCK_QUESTS.find(q => q.id === id);
  const isAccepted = activeQuests.some(q => q.id === id);

  const handleAccept = useCallback(() => {
    if (!id) return;
    acceptQuest(id);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f5ff', '#b537ff', '#39ff14'],
    });
    setTimeout(() => navigate('/my-quests'), 1500);
  }, [id, acceptQuest, navigate]);

  if (!quest) {
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
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          BACK
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
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

          {/* Meta */}
          <div className="flex gap-6 mb-8 font-mono text-sm text-muted-foreground border-y border-border py-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <CountdownTimer endTime={quest.endTime} />
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" strokeWidth={1.5} />
              {quest.minScore}+ XP Required
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-lg text-foreground mb-3 uppercase tracking-tight">Description</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">{quest.description}</p>
          </div>

          {/* Requirements */}
          {quest.requirements && (
            <div className="mb-8">
              <h2 className="font-display font-bold text-lg text-foreground mb-3 uppercase tracking-tight">Requirements</h2>
              <ul className="space-y-2">
                {quest.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-kwestly-green mt-0.5 shrink-0" strokeWidth={1.5} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deliverables */}
          {quest.deliverables && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-lg text-foreground mb-3 uppercase tracking-tight">Deliverables</h2>
              <p className="font-mono text-sm text-muted-foreground">{quest.deliverables}</p>
            </div>
          )}

          {/* CTA */}
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
              className="w-full py-4 font-mono font-bold text-lg bg-primary text-primary-foreground border-2 border-primary glow-cyan-strong transition-all"
            >
              ACCEPT QUEST ⚡
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestDetail;
