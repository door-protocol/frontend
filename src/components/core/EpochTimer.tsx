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
    <Card className="border-2 hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <Clock className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Epoch #{currentEpoch}
              </p>
              <p className="text-2xl font-bold">{timeLeft}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${stateColors[epochState]}`}
            >
              {stateLabels[epochState]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
