import { FC } from 'react';

const difficulties = {
  easy: { label: 'EASY', color: 'bg-kwestly-green/20 text-kwestly-green border-kwestly-green/30', stars: 1 },
  medium: { label: 'MEDIUM', color: 'bg-kwestly-gold/20 text-kwestly-gold border-kwestly-gold/30', stars: 2 },
  hard: { label: 'HARD', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', stars: 3 },
  elite: { label: 'ELITE', color: 'gradient-elite text-primary-foreground border-kwestly-gold/50', stars: 4 },
};

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'elite';
}

const DifficultyBadge: FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const config = difficulties[difficulty];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold border ${config.color}`}>
      {'★'.repeat(config.stars)}{'☆'.repeat(4 - config.stars)} {config.label}
    </span>
  );
};

export default DifficultyBadge;
