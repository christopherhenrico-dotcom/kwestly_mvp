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

  const statusOverlay: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: 'IN PROGRESS', color: 'text-kwestly-cyan border-kwestly-cyan', bg: 'bg-kwestly-cyan/10' },
    submitted: { label: 'PENDING REVIEW', color: 'text-accent-purple border-accent-purple', bg: 'bg-accent-purple/10' },
    completed: { label: 'COMPLETED', color: 'text-kwestly-green border-kwestly-green', bg: 'bg-kwestly-green/10' },
    failed: { label: 'FAILED', color: 'text-kwestly-red border-kwestly-red', bg: 'bg-kwestly-red/10' },
  };

  const status = quest.status ? statusOverlay[quest.status] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px hsl(0 0% 0% / 0.3)' }}
      onClick={() => navigate(`/quest/${quest.id}`)}
      className={`glass-card group cursor-pointer overflow-hidden ${
        status ? `border-${status.color.split('-')[1]}/30` : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <DifficultyBadge difficulty={quest.difficulty} />
          {showStatus && status && (
            <span className={`font-mono text-xs px-2 py-1 border ${status.color} ${status.bg}`}>
              {status.label}
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
          {quest.title}
        </h3>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="font-mono text-3xl font-bold text-primary text-glow-cyan">${quest.bounty}</span>
          <span className="font-mono text-sm text-muted-foreground">USDC</span>
        </div>

        <div className="flex items-center justify-between text-sm pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CountdownTimer endTime={quest.endTime} />
          </div>
          <span className="font-mono text-muted-foreground flex items-center gap-1">
            <span className="text-primary">⚡</span> {quest.minScore}+ XP
          </span>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-primary/50 via-accent-purple/50 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default QuestCard;
