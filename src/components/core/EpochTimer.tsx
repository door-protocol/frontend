'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft('Epoch Ended - Awaiting Settlement');
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    // Initial update
    updateTimer();

    const interval = setInterval(updateTimer, 1000);

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
      'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  };

  const isEnded = timeLeft.includes('Ended');

  return (
    <Card
      className={`border-2 hover:shadow-xl transition-all ${
        isEnded
          ? 'border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20'
          : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-secondary">
              <Clock className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Epoch #{currentEpoch}
              </p>
              <p
                className={`text-2xl font-bold ${
                  isEnded ? 'text-orange-600 dark:text-orange-400' : ''
                }`}
              >
                {timeLeft}
              </p>
              {isEnded && (
                <p className="text-xs text-muted-foreground mt-1">
                  New epoch will start after settlement
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {epochState === EpochState.OPEN ? (
              <Link href="/deposit">
                <Button
                  className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${stateColors[epochState]} hover:opacity-80 transition-opacity`}
                >
                  {stateLabels[epochState]} →
                </Button>
              </Link>
            ) : (
              <span
                className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${stateColors[epochState]}`}
              >
                {stateLabels[epochState]}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
