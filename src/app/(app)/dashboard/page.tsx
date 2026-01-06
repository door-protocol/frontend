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
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Monitor your protocol metrics and performance
          </p>
        </div>
      </div>

      {/* Epoch Timer */}
      <div className="animate-fade-in-up">
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TVL */}
        <Card className="group hover:shadow-2xl transition-all duration-500 ease-in-out border-2 hover:border-zinc-300 dark:hover:border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <span className="text-lg">💰</span>
              </div>
              Total Value Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-2">
              ${formatCompactNumber(Number(stats.tvl))}
            </p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-green-600 dark:text-green-400 font-medium">
                ↗ +5.2%
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                this week
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Senior APY */}
        <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out border-2 hover:border-blue-200 dark:hover:border-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <span className="text-lg">🛡️</span>
              </div>
              Senior APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.seniorAPY}%
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Target: <span className="font-medium">{stats.seniorAPY}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Junior APY */}
        <Card className="group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out border-2 hover:border-orange-200 dark:hover:border-orange-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <span className="text-lg">⚔️</span>
              </div>
              Junior APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {stats.juniorAPY}%
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Range: <span className="font-medium">15-30%</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tranche Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                🛡️
              </div>
              Senior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                TVL
              </span>
              <span className="font-bold text-lg">
                ${formatCompactNumber(Number(stats.seniorTVL))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                APY
              </span>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                {stats.seniorAPY}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Ratio
              </span>
              <span className="font-bold text-lg">
                {(100 - stats.juniorRatio).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 dark:border-orange-900/30 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20 dark:to-transparent hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/30">
                ⚔️
              </div>
              Junior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                TVL
              </span>
              <span className="font-bold text-lg">
                ${formatCompactNumber(Number(stats.juniorTVL))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                APY
              </span>
              <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
                {stats.juniorAPY}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Ratio
              </span>
              <span className="font-bold text-lg">
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
