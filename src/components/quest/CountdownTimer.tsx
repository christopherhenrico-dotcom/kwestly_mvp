import { FC } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownTimerProps {
  endTime: number;
  onExpire?: () => void;
}

const CountdownTimer: FC<CountdownTimerProps> = ({ endTime }) => {
  const { formatted, isUrgent, isWarning, isExpired } = useCountdown(endTime);

  if (isExpired) {
    return <span className="font-mono text-sm text-kwestly-red font-bold">EXPIRED</span>;
  }

  return (
    <span className={`font-mono text-sm font-medium ${
      isUrgent ? 'text-kwestly-red animate-pulse-glow' :
      isWarning ? 'text-kwestly-gold' :
      'text-muted-foreground'
    }`}>
      ⏱ {formatted}
    </span>
  );
};

export default CountdownTimer;
