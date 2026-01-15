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
      className={`border-2 hover:shadow-2xl transition-all duration-500 ease-in-out ${
        isSenior
          ? 'border-blue-200 dark:border-blue-900 hover:shadow-blue-500/10 bg-linear-to-br from-blue-50/30 dark:from-blue-950/10 to-transparent'
          : 'border-orange-200 dark:border-orange-900 hover:shadow-orange-500/10 bg-linear-to-br from-orange-50/30 dark:from-orange-950/10 to-transparent'
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div
              className={`p-2 rounded-xl ${isSenior ? 'bg-blue-100 dark:bg-blue-950/30' : 'bg-orange-100 dark:bg-orange-950/30'}`}
            >
              {isSenior ? '🛡️' : '⚔️'}
            </div>
            {isSenior ? 'DOOR-FIX (Senior)' : 'DOOR-BOOST (Junior)'}
          </CardTitle>
          <span
            className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
              isSenior
                ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                : 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400'
            }`}
          >
            Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Balance */}
        <div className="p-4 rounded-xl bg-secondary/50 border">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Deposited Amount
          </p>
          <p className="text-3xl font-bold">${formatNumber(Number(balance))}</p>
        </div>

        {/* Yield */}
        <div className="flex items-center justify-between p-4 bg-linear-to-br from-green-50 dark:from-green-950/30 to-green-100/50 dark:to-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-900/50 shadow-lg">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Claimable Yield
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              +${formatNumber(Number(claimableYield))}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* APY */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border">
          <span className="text-sm font-medium text-muted-foreground">
            {isSenior ? 'Target APY' : 'Current APY'}
          </span>
          <span
            className={`text-2xl font-bold ${
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
            <span className="text-muted-foreground">Epoch Progress</span>
            <span className="font-medium">{epochProgress.toFixed(0)}%</span>
          </div>
          <Progress value={epochProgress} className="h-2" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Deposited at Epoch #{depositEpoch} • Current: #{currentEpoch}
          </div>
        </div>

        {/* Total Value */}
        <div className="pt-4 border-t border-border">
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
