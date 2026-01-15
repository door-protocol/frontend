'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/lib/utils';
import { useCoreVaultStats, useProtocolFeeRate } from '@/hooks/useCoreVault';
import { useHistoricalRates } from '@/hooks/useHistoricalData';
import { formatUnits } from 'viem';
import {
  estimateJuniorAPY,
  calculateVaultAPY,
} from '@/lib/utils/apyCalculations';
import {
  DEFAULT_SENIOR_APY,
  DEFAULT_PROTOCOL_FEE_BPS,
  ESTIMATED_VAULT_YIELD_BPS,
} from '@/lib/config';

export default function AnalyticsPage() {
  // Fetch real contract data
  const { stats } = useCoreVaultStats();
  const { protocolFeeRate } = useProtocolFeeRate();

  // Fetch historical data from contract events
  const { history: rateHistory, isLoading: historyLoading } =
    useHistoricalRates(30);

  // Calculate current metrics from contract
  const seniorAPY = stats
    ? Number(stats.currentSeniorRate) / 100
    : DEFAULT_SENIOR_APY;

  // Use contract protocol fee rate, fallback to default
  const protocolFeeRateBps = protocolFeeRate
    ? Number(protocolFeeRate)
    : DEFAULT_PROTOCOL_FEE_BPS;

  const juniorAPYEstimate = stats
    ? estimateJuniorAPY(
        stats.seniorPrincipal,
        stats.juniorPrincipal,
        stats.currentSeniorRate,
        ESTIMATED_VAULT_YIELD_BPS,
        protocolFeeRateBps,
      )
    : null;
  const juniorAPY = juniorAPYEstimate !== null ? juniorAPYEstimate / 100 : 0;

  const vaultAPY = stats
    ? calculateVaultAPY(
        stats.seniorPrincipal,
        stats.juniorPrincipal,
        seniorAPY * 100,
        juniorAPY * 100,
      ) / 100
    : 0;

  const juniorRatio = stats ? Number(stats.juniorRatio) / 100 : 25.0;
  const seniorTVL = stats ? Number(formatUnits(stats.seniorPrincipal, 6)) : 0;
  const juniorTVL = stats ? Number(formatUnits(stats.juniorPrincipal, 6)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track historical performance and metrics
        </p>
      </div>

      {/* APY Chart */}
      <Card>
        <CardHeader>
          <CardTitle>APY Historical Trend (30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">
                Loading historical data...
              </p>
            </div>
          ) : rateHistory.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">
                No historical data available yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rateHistory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e4e4e7',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#52525b' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="seniorAPY"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Senior APY"
                />
                <Line
                  type="monotone"
                  dataKey="juniorAPY"
                  stroke="#ea580c"
                  strokeWidth={2}
                  name="Junior APY"
                />
                <Line
                  type="monotone"
                  dataKey="vaultAPY"
                  stroke="#84cc16"
                  strokeWidth={2}
                  name="Vault APY"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Senior APY</span>
              <span className="font-medium text-blue-600 dark:text-blue-400 ">
                {formatNumber(seniorAPY)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Junior APY</span>
              <span className="font-medium text-orange-600 dark:text-orange-400 ">
                {formatNumber(juniorAPY)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Vault APY</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatNumber(vaultAPY)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Junior Ratio</span>
              <span
                className={`font-medium ${juniorRatio >= 20 ? 'text-green-600 dark:text-green-400' : juniorRatio >= 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {juniorRatio.toFixed(1)}% (
                {juniorRatio >= 20
                  ? 'Healthy'
                  : juniorRatio >= 10
                    ? 'Warning'
                    : 'Critical'}
                )
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Senior Coverage</span>
              <span className="font-medium">
                {stats?.isHealthy ? '100%' : 'At Risk'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protocol Fee</span>
              <span className="font-medium">
                {(protocolFeeRateBps / 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TVL Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>TVL Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Senior */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">🛡️ Senior Tranche</span>
                <span className="font-medium">
                  ${formatNumber(seniorTVL)} ({(100 - juniorRatio).toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 dark:bg-blue-600 "
                  style={{ width: `${100 - juniorRatio}%` }}
                />
              </div>
            </div>

            {/* Junior */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">⚔️ Junior Tranche</span>
                <span className="font-medium">
                  ${formatNumber(juniorTVL)} ({juniorRatio.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 dark:bg-orange-600 "
                  style={{ width: `${juniorRatio}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
