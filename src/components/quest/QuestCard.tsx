import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DifficultyBadge from './DifficultyBadge';
import CountdownTimer from './CountdownTimer';
import type { DisplayQuest } from '@/stores/appStore';

interface QuestCardProps {
  quest: DisplayQuest;
  index?: number;
  showStatus?: boolean;
}

const QuestCard: FC<QuestCardProps> = ({ quest, index = 0, showStatus }) => {
  const navigate = useNavigate();

  const statusOverlay: Record<string, { label: string; color: string }> = {
    active: { label: 'IN PROGRESS', color: 'border-kwestly-cyan' },
    submitted: { label: 'PENDING REVIEW', color: 'border-kwestly-purple' },
    completed: { label: 'COMPLETED', color: 'border-kwestly-green' },
    failed: { label: 'FAILED', color: 'border-kwestly-red' },
  };

  const status = quest.status ? statusOverlay[quest.status] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/quest/${quest.id}`)}
      className={`group relative cursor-pointer border bg-card p-6 transition-all duration-200 hover:border-primary ${
        status ? status.color : 'border-border'
      }`}
    >
      <div className="scanline absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between mb-4">
        <DifficultyBadge difficulty={quest.difficulty} />
        {showStatus && status && (
          <span className={`font-mono text-xs px-2 py-1 border ${status.color}`}>
            {status.label}
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">
        {quest.title}
      </h3>

      <div className="font-mono text-2xl font-bold text-kwestly-cyan text-glow-cyan mb-4">
        ${quest.bounty} <span className="text-sm text-muted-foreground">USDC</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <CountdownTimer endTime={quest.endTime} />
        <span className="font-mono text-muted-foreground">
          ⚡ {quest.minScore}+ XP
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="font-mono text-xs text-primary tracking-wider">
          GRAB QUEST →
        </span>
      </div>
    </motion.div>
  );
};

export default QuestCard;
