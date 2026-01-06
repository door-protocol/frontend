'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RatioGauge from '@/components/core/RatioGauge';
import EpochTimer, { EpochState } from '@/components/core/EpochTimer';
import { formatCompactNumber } from '@/lib/utils';
import {
  mockVaultStats,
  mockCurrentEpoch,
  mockDORData,
} from '@/mock/vaultData';
import { MIN_JUNIOR_RATIO } from '@/lib/utils/constants';

export default function DashboardPage() {
  const stats = mockVaultStats;
  const epoch = mockCurrentEpoch;
  const dor = mockDORData;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Epoch Timer */}
      <EpochTimer
        currentEpoch={epoch.epochId}
        epochState={
          epoch.state === 'OPEN'
            ? EpochState.OPEN
            : epoch.state === 'LOCKED'
              ? EpochState.LOCKED
              : EpochState.SETTLED
        }
        endTime={epoch.endTime}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TVL */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Value Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${formatCompactNumber(Number(stats.tvl))}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +5.2% this week
            </p>
          </CardContent>
        </Card>

        {/* Senior APY */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Senior APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.seniorAPY}%
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Target: {stats.seniorAPY}%
            </p>
          </CardContent>
        </Card>

        {/* Junior APY */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Junior APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.juniorAPY}%
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Range: 15-30%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tranche Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🛡️ Senior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                TVL
              </span>
              <span className="font-medium">
                ${formatCompactNumber(Number(stats.seniorTVL))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                APY
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {stats.seniorAPY}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Ratio
              </span>
              <span className="font-medium">
                {(100 - stats.juniorRatio).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚔️ Junior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                TVL
              </span>
              <span className="font-medium">
                ${formatCompactNumber(Number(stats.juniorTVL))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                APY
              </span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {stats.juniorAPY}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Ratio
              </span>
              <span className="font-medium">
                {stats.juniorRatio.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tranche Ratio Gauge */}
      <Card>
        <CardHeader>
          <CardTitle>Tranche Ratio</CardTitle>
        </CardHeader>
        <CardContent>
          <RatioGauge
            seniorRatio={100 - stats.juniorRatio}
            juniorRatio={stats.juniorRatio}
            minJuniorRatio={MIN_JUNIOR_RATIO}
          />
        </CardContent>
      </Card>

      {/* DOR Rate */}
      <Card>
        <CardHeader>
          <CardTitle>DOR Benchmark Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Current DOR
              </span>
              <span className="text-2xl font-bold">{dor.currentRate}%</span>
            </div>
            <div className="border-t dark:border-zinc-800 pt-3 space-y-2 text-sm">
              {dor.sources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between text-zinc-600 dark:text-zinc-400"
                >
                  <span>
                    • {source.name} ({source.weight}%)
                  </span>
                  <span>{source.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
