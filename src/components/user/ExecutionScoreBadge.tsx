import { FC } from 'react';

interface ExecutionScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

function getTier(score: number) {
  if (score >= 1000) return { label: 'ELITE', color: 'from-kwestly-gold to-kwestly-purple', textColor: 'text-kwestly-gold', glow: 'glow-gold' };
  if (score >= 750) return { label: 'GOLD', color: 'from-kwestly-gold to-yellow-600', textColor: 'text-kwestly-gold', glow: 'glow-gold' };
  if (score >= 500) return { label: 'SILVER', color: 'from-gray-300 to-gray-500', textColor: 'text-gray-300', glow: '' };
  return { label: 'BRONZE', color: 'from-orange-700 to-orange-500', textColor: 'text-orange-400', glow: '' };
}

const sizes = {
  small: 'w-10 h-10 text-xs',
  medium: 'w-14 h-14 text-sm',
  large: 'w-20 h-20 text-lg',
};

const ExecutionScoreBadge: FC<ExecutionScoreBadgeProps> = ({ score, size = 'medium' }) => {
  const tier = getTier(score);

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${tier.glow}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-20`}
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
      <div className="absolute inset-[2px] bg-card"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
      <span className={`relative z-10 font-mono font-bold ${tier.textColor}`}>{score}</span>
    </div>
  );
};

export default ExecutionScoreBadge;
