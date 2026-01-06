'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMockRateHistory } from '@/mock/vaultData';
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

export default function AnalyticsPage() {
  const rateHistory = generateMockRateHistory(30);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Track historical performance and metrics
        </p>
      </div>

      {/* APY Chart */}
      <Card>
        <CardHeader>
          <CardTitle>APY Historical Trend (30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rateHistory}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-zinc-200 dark:stroke-zinc-800"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-zinc-600 dark:text-zinc-400"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-zinc-600 dark:text-zinc-400"
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
              <span className="text-zinc-600 dark:text-zinc-400">
                Average Senior APY
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {formatNumber(5.52)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Average Junior APY
              </span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {formatNumber(18.15)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Average Vault APY
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatNumber(7.05)}%
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
              <span className="text-zinc-600 dark:text-zinc-400">
                Junior Buffer
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                25.0% (Healthy)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Senior Coverage
              </span>
              <span className="font-medium">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Protocol Fee
              </span>
              <span className="font-medium">1.0%</span>
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
                <span className="text-zinc-600 dark:text-zinc-400">
                  🛡️ Senior Tranche
                </span>
                <span className="font-medium">$937,500 (75%)</span>
              </div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 dark:bg-blue-600"
                  style={{ width: '75%' }}
                />
              </div>
            </div>

            {/* Junior */}
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  ⚔️ Junior Tranche
                </span>
                <span className="font-medium">$312,500 (25%)</span>
              </div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 dark:bg-orange-600"
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
