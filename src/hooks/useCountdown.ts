import { useState, useEffect, useCallback } from 'react';

export function useCountdown(endTime: number) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, timeLeft]);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isUrgent = timeLeft < 1800000; // < 30 min
  const isWarning = timeLeft < 3600000 && !isUrgent; // < 1 hr

  return {
    timeLeft,
    hours,
    minutes,
    seconds,
    isUrgent,
    isWarning,
    isExpired: timeLeft <= 0,
    formatted: `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`,
  };
}
