'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, Calendar } from 'lucide-react';

interface PositionCardProps {
  tranche: 'senior' | 'junior';
  balance: string;
  claimableYield: string;
  apy: number;
  depositEpoch: number;
  currentEpoch: number;
}

export default function PositionCard({
  tranche,
  balance,
  claimableYield,
  apy,
  depositEpoch,
  currentEpoch,
}: PositionCardProps) {
  const isSenior = tranche === 'senior';
  const totalValue = Number(balance) + Number(claimableYield);

  // Calculate progress (mock: based on epoch difference)
  const epochProgress = ((currentEpoch - depositEpoch) / 12) * 100; // Assuming 12 epochs = 1 period

  return (
    <Card
      className={
        isSenior
          ? 'border-blue-200 dark:border-blue-900'
          : 'border-orange-200 dark:border-orange-900'
      }
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isSenior ? '🛡️' : '⚔️'}
            {isSenior ? 'DOOR-FIX (Senior)' : 'DOOR-BOOST (Junior)'}
          </CardTitle>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSenior
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                : 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400'
            }`}
          >
            Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Balance */}
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Deposited Amount
          </p>
          <p className="text-2xl font-bold">${formatNumber(Number(balance))}</p>
        </div>

        {/* Yield */}
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Claimable Yield
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              +${formatNumber(Number(claimableYield))}
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>

        {/* APY */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {isSenior ? 'Target APY' : 'Current APY'}
          </span>
          <span
            className={`text-lg font-bold ${
              isSenior
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-orange-600 dark:text-orange-400'
            }`}
          >
            {apy.toFixed(1)}%
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              Epoch Progress
            </span>
            <span className="font-medium">{epochProgress.toFixed(0)}%</span>
          </div>
          <Progress value={epochProgress} className="h-2" />
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3 w-3" />
            Deposited at Epoch #{depositEpoch} • Current: #{currentEpoch}
          </div>
        </div>

        {/* Total Value */}
        <div className="pt-4 border-t dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Value</span>
            <span className="text-xl font-bold">
              ${formatNumber(totalValue)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="outline" size="sm">
            Early Withdraw
          </Button>
          <Button variant="default" size="sm">
            Claim Yield
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
