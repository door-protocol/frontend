'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RatioGauge from '@/components/core/RatioGauge';
import EpochTimer, { EpochState } from '@/components/core/EpochTimer';
import { formatCompactNumber } from '@/lib/utils';
import { MIN_JUNIOR_RATIO } from '@/lib/utils/constants';
import { useCoreVaultStats } from '@/hooks/useCoreVault';
import {
  useCurrentEpochId,
  useEpoch,
  useCurrentEpochState,
} from '@/hooks/useEpochManager';
import { useLatestRates } from '@/hooks/useBackendAPI';
import { formatUnits } from 'viem';
import {
  estimateJuniorAPY,
  calculateVaultAPY,
  formatAPY,
} from '@/lib/utils/apyCalculations';
import { ESTIMATED_VAULT_YIELD_BPS } from '@/lib/config';

export default function DashboardPage() {
  // Fetch real contract data
  const { stats: vaultStats } = useCoreVaultStats();
  const { currentEpochId } = useCurrentEpochId();
  const { state: epochState } = useCurrentEpochState();
  const { epoch: currentEpoch } = useEpoch(currentEpochId);

  // Calculate stats from contract data
  const stats = vaultStats
    ? (() => {
        const seniorAPY = Number(vaultStats.currentSeniorRate) / 100;
        const estimatedJuniorAPY = estimateJuniorAPY(
          vaultStats.seniorPrincipal,
          vaultStats.juniorPrincipal,
          vaultStats.currentSeniorRate,
          ESTIMATED_VAULT_YIELD_BPS,
        );
        const juniorAPY =
          estimatedJuniorAPY !== null ? estimatedJuniorAPY / 100 : 0;

        return {
          tvl: formatUnits(vaultStats.totalAssets, 6),
          seniorTVL: formatUnits(vaultStats.seniorPrincipal, 6),
          juniorTVL: formatUnits(vaultStats.juniorPrincipal, 6),
          seniorAPY: seniorAPY.toFixed(1),
          juniorAPY: juniorAPY.toFixed(1),
          juniorRatio: Number(vaultStats.juniorRatio) / 100,
        };
      })()
    : {
        tvl: '0',
        seniorTVL: '0',
        juniorTVL: '0',
        seniorAPY: '0',
        juniorAPY: '0',
        juniorRatio: 0,
      };

  // Fetch DOR data from backend API
  const { data: ratesData, isLoading: ratesLoading } = useLatestRates();

  const dor = ratesData
    ? {
        currentRate: ratesData.dor,
        seniorTarget: ratesData.seniorTarget,
        sources: ratesData.sources.map((s) => ({
          name: s.name,
          rate: s.rate,
          isLive: s.isLive,
        })),
        liveCount: ratesData.liveCount,
        fallbackCount: ratesData.fallbackCount,
        source: ratesData.source,
      }
    : {
        currentRate: 0,
        seniorTarget: 0,
        sources: [],
        liveCount: 0,
        fallbackCount: 0,
        source: 'loading' as const,
      };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-zinc-900 dark:from-zinc-100 to-zinc-600 dark:to-zinc-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your protocol metrics and performance
          </p>
        </div>
      </div>

      {/* Epoch Timer */}
      {currentEpoch && (
        <div className="animate-fade-in-up">
          <EpochTimer
            currentEpoch={Number(currentEpoch.id)}
            epochState={
              epochState === 0
                ? EpochState.OPEN
                : epochState === 1
                  ? EpochState.LOCKED
                  : EpochState.SETTLED
            }
            endTime={Number(currentEpoch.endTime)}
          />
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TVL */}
        <Card className="group hover:shadow-2xl transition-all duration-500 ease-in-out border-2 hover:border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <span className="text-lg">💰</span>
              </div>
              Total Value Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground mb-2">
              ${formatCompactNumber(Number(stats.tvl))}
            </p>
            <p className="text-sm text-muted-foreground">
              Total protocol assets
            </p>
          </CardContent>
        </Card>

        {/* Senior APY */}
        <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out border-2 hover:border-blue-300 dark:hover:border-blue-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
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
            <p className="text-sm text-muted-foreground">
              Target:{' '}
              <span className="font-medium text-foreground">
                {dor.seniorTarget ? dor.seniorTarget : stats.seniorAPY}%
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Junior APY */}
        <Card className="group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out border-2 hover:border-orange-300 dark:hover:border-orange-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
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
            <p className="text-sm text-muted-foreground">Variable yield</p>
          </CardContent>
        </Card>
      </div>

      {/* Tranche Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-100 dark:border-blue-950/30 bg-linear-to-br from-blue-50/50 dark:from-blue-950/20 to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-foreground">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                🛡️
              </div>
              Senior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium text-muted-foreground">
                TVL
              </span>
              <span className="font-bold text-lg text-foreground">
                ${formatCompactNumber(Number(stats.seniorTVL))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium text-muted-foreground">
                APY
              </span>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400 ">
                {stats.seniorAPY}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium text-muted-foreground">
                Ratio
              </span>
              <span className="font-bold text-lg text-foreground">
                {(100 - stats.juniorRatio).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 dark:border-orange-950/30 bg-linear-to-br from-orange-50/50 dark:from-orange-950/20 to-transparent hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-foreground">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/30">
                ⚔️
              </div>
              Junior Tranche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium text-muted-foreground">
                TVL
              </span>
              <span className="font-bold text-lg text-foreground">
                ${formatCompactNumber(Number(stats.juniorTVL))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium text-muted-foreground">
                APY
              </span>
              <span className="font-bold text-lg text-orange-600 dark:text-orange-400 ">
                {stats.juniorAPY}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium text-muted-foreground">
                Ratio
              </span>
              <span className="font-bold text-lg text-foreground">
                {stats.juniorRatio.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tranche Ratio Gauge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Tranche Ratio</CardTitle>
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
          <CardTitle className="text-foreground flex items-center justify-between">
            <span>DOR Benchmark Rate</span>
            {dor.source && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                dor.source === 'database' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {dor.source === 'database' ? '🔴 Live' : '📊 Mock Data'}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current DOR</span>
              <span className="text-2xl font-bold text-foreground">
                {ratesLoading ? '...' : `${dor.currentRate}%`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Senior Target (DOR + 1%)</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {ratesLoading ? '...' : `${dor.seniorTarget}%`}
              </span>
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="text-xs text-muted-foreground mb-2">
                Rate Sources ({dor.liveCount} live, {dor.fallbackCount} fallback)
              </div>
              {dor.sources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between text-muted-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${source.isLive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    {source.name}
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
