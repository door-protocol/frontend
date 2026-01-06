'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export enum EpochState {
  OPEN = 0,
  LOCKED = 1,
  SETTLED = 2,
}

interface EpochTimerProps {
  currentEpoch: number;
  epochState: EpochState;
  endTime: number; // Unix timestamp
}

export default function EpochTimer({
  currentEpoch,
  epochState,
  endTime,
}: EpochTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const stateLabels = {
    [EpochState.OPEN]: 'Deposits Open',
    [EpochState.LOCKED]: 'Operating',
    [EpochState.SETTLED]: 'Settled',
  };

  const stateColors = {
    [EpochState.OPEN]:
      'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400',
    [EpochState.LOCKED]:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400',
    [EpochState.SETTLED]:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Epoch #{currentEpoch}
              </p>
              <p className="font-medium">{timeLeft}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${stateColors[epochState]}`}
          >
            {stateLabels[epochState]}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
