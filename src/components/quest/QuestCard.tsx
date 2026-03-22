import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Zap, ChevronRight, Shield } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import CountdownTimer from './CountdownTimer';
import type { DisplayQuest } from '@/stores/appStore';

interface QuestCardProps {
  quest: DisplayQuest;
  index?: number;
  showStatus?: boolean;
}

const difficultyColors = {
  easy: { bg: 'bg-kwestly-green/10', border: 'border-kwestly-green/30', text: 'text-kwestly-green' },
  medium: { bg: 'bg-kwestly-gold/10', border: 'border-kwestly-gold/30', text: 'text-kwestly-gold' },
  hard: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500' },
  elite: { bg: 'bg-kwestly-red/10', border: 'border-kwestly-red/30', text: 'text-kwestly-red' },
};

const QuestCard: FC<QuestCardProps> = ({ quest, index = 0, showStatus }) => {
  const navigate = useNavigate();
  const colors = difficultyColors[quest.difficulty] || difficultyColors.medium;

  const expiresAt = quest.endTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/quest/${quest.id}`)}
      className="group glass-card glass-card-hover p-6 cursor-pointer relative overflow-hidden"
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/20 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/20 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={quest.difficulty} />
            {showStatus && quest.status && (
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                quest.status === 'active' ? 'bg-kwestly-green/20 text-kwestly-green border border-kwestly-green/30' :
                quest.status === 'submitted' ? 'bg-kwestly-gold/20 text-kwestly-gold border border-kwestly-gold/30' :
                quest.status === 'completed' ? 'bg-primary/20 text-primary border border-primary/30' :
                'bg-secondary text-muted-foreground'
              }`}>
                {quest.status}
              </span>
            )}
          </div>
          <div className="font-cyber text-lg font-bold text-primary text-glow-cyan">
            ${quest.bounty}
            <span className="text-[10px] text-muted-foreground ml-1">USDC</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {quest.title}
        </h3>

        {/* Description */}
        <p className="font-mono text-xs text-muted-foreground mb-4 line-clamp-2">
          {quest.description || 'Complete this mission to earn rewards'}
        </p>

        {/* Requirements */}
        {quest.requirements && quest.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {quest.requirements.slice(0, 3).map((req, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 text-[10px] font-mono rounded ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {req}
              </span>
            ))}
            {quest.requirements.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                +{quest.requirements.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <CountdownTimer endTime={expiresAt} />
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{quest.minScore}+ XP</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        {quest.postedBy && quest.postedBy !== 'Unknown' && (
          <div className="flex items-center gap-2 mt-3 text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span className="font-mono text-[10px]">Posted by {quest.postedBy}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestCard;
