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
          <h1 className="text-4xl font-bold bg-linear-to-r from-zinc-900 to-zinc-600 from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-600 text-muted-foreground mt-2">
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
        <Card className="group hover:shadow-2xl transition-all duration-500 ease-in-out border-2 hover:border-zinc-300 hover:border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 text-zinc-300 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-zinc-100 bg-muted group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <span className="text-lg">💰</span>
              </div>
              Total Value Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-zinc-900 text-zinc-100 mb-2">
              ${formatCompactNumber(Number(stats.tvl))}
            </p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-green-600 text-green-400 font-medium">
                ↗ +5.2%
              </span>
              <span className="text-zinc-500 text-zinc-400">this week</span>
            </div>
          </CardContent>
        </Card>

        {/* Senior APY */}
        <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out border-2 hover:border-blue-200 hover:border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 text-zinc-300 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 bg-primary/10 group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <span className="text-lg">🛡️</span>
              </div>
              Senior APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600 text-primary mb-2">
              {stats.seniorAPY}%
            </p>
            <p className="text-sm text-zinc-500 text-zinc-400">
              Target:{' '}
              <span className="font-medium text-zinc-200">
                {stats.seniorAPY}%
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Junior APY */}
        <Card className="group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out border-2 hover:border-orange-200 hover:border-accent/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 text-zinc-300 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 bg-accent/10 group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <span className="text-lg">⚔️</span>
              </div>
              Junior APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-600 text-accent mb-2">
              {stats.juniorAPY}%
            </p>
            <p className="text-sm text-zinc-500 text-zinc-400">
              Range: <span className="font-medium text-zinc-200">15-30%</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tranche Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-100 border-primary/20 bg-linear-to-br from-blue-50/50 to-transparent from-card to-card hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-zinc-900 text-zinc-100">
              <div className="p-2 rounded-lg bg-blue-100 bg-primary/10">🛡️</div>
              Senior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 text-zinc-400">
                TVL
              </span>
              <span className="font-bold text-lg text-zinc-900 text-zinc-100">
                ${formatCompactNumber(Number(stats.seniorTVL))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 text-zinc-400">
                APY
              </span>
              <span className="font-bold text-lg text-blue-600 text-primary">
                {stats.seniorAPY}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 text-zinc-400">
                Ratio
              </span>
              <span className="font-bold text-lg text-zinc-900 text-zinc-100">
                {(100 - stats.juniorRatio).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 border-accent/20 bg-linear-to-br from-orange-50/50 to-transparent from-card to-card hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-zinc-900 text-zinc-100">
              <div className="p-2 rounded-lg bg-orange-100 bg-accent/10">
                ⚔️
              </div>
              Junior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 text-zinc-400">
                TVL
              </span>
              <span className="font-bold text-lg text-zinc-900 text-zinc-100">
                ${formatCompactNumber(Number(stats.juniorTVL))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 text-zinc-400">
                APY
              </span>
              <span className="font-bold text-lg text-orange-600 text-accent">
                {stats.juniorAPY}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 bg-zinc-900/50">
              <span className="text-sm font-medium text-zinc-600 text-zinc-400">
                Ratio
              </span>
              <span className="font-bold text-lg text-zinc-900 text-zinc-100">
                {stats.juniorRatio.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tranche Ratio Gauge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900 text-zinc-100">
            Tranche Ratio
          </CardTitle>
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
          <CardTitle className="text-zinc-900 text-zinc-100">
            DOR Benchmark Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 text-zinc-400">
                Current DOR
              </span>
              <span className="text-2xl font-bold text-zinc-900 text-zinc-100">
                {dor.currentRate}%
              </span>
            </div>
            <div className="border-t border-zinc-700 pt-3 space-y-2 text-sm">
              {dor.sources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between text-zinc-600 text-zinc-400"
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
