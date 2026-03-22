import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import TopNav from '@/components/layout/TopNav';
import DifficultyBadge from '@/components/quest/DifficultyBadge';
import CountdownTimer from '@/components/quest/CountdownTimer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const QuestDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: quest, isLoading } = useQuery({
    queryKey: ['quest', id],
    queryFn: () => api.getQuest(id!),
    enabled: !!id,
  });

  const acceptMutation = useMutation({
    mutationFn: () => api.acceptQuest(id!),
    onSuccess: () => {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00f5ff', '#b537ff', '#39ff14'] });
      queryClient.invalidateQueries({ queryKey: ['quest', id] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      setTimeout(() => navigate('/my-quests'), 1500);
    },
  });

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

  if (!quest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground">
        Quest not found.
      </div>
    );
  }

  const isAccepted = quest.worker_id === user?.id;
  const isOwner = quest.poster_id === user?.id;

  const handleAccept = () => {
    acceptMutation.mutate();
  };

  const expiresAt = new Date(quest.expires_at).getTime();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          BACK
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <DifficultyBadge difficulty={quest.difficulty} />
              <h1 className="font-display text-3xl font-bold text-foreground mt-3">{quest.title}</h1>
            </div>
            <div className="text-right">
              <div className="font-mono text-4xl font-bold text-primary text-glow-cyan">${quest.bounty}</div>
              <span className="font-mono text-sm text-muted-foreground">USDC</span>
            </div>
          </div>

          <div className="flex gap-6 mb-8 font-mono text-sm text-muted-foreground border-y border-border py-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <CountdownTimer endTime={expiresAt} />
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

          {isAccepted ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/quest/${quest.id}/submit`)}
              className="w-full py-4 font-mono font-bold text-lg border-2 border-kwestly-green bg-kwestly-green/10 text-kwestly-green hover:bg-kwestly-green/20 transition-all"
            >
              SUBMIT WORK →
            </motion.button>
          ) : quest.status === 'open' && !isOwner ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAccept}
              disabled={acceptMutation.isPending}
              className="w-full py-4 font-mono font-bold text-lg bg-primary text-primary-foreground border-2 border-primary glow-cyan-strong hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {acceptMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'ACCEPT QUEST ⚡'}
            </motion.button>
          ) : quest.status === 'submitted' && isOwner ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/quest/${quest.id}/review`)}
              className="w-full py-4 font-mono font-bold text-lg border-2 border-kwestly-purple bg-kwestly-purple/10 text-kwestly-purple hover:bg-kwestly-purple/20 transition-all"
            >
              REVIEW SUBMISSION
            </motion.button>
          ) : (
            <div className="w-full py-4 font-mono text-lg text-center border-2 border-border text-muted-foreground">
              {quest.status === 'active' ? 'IN PROGRESS' : quest.status === 'completed' ? 'COMPLETED' : quest.status.toUpperCase()}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestDetail;
