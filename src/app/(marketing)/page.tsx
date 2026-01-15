'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Shield, TrendingUp, Lock } from 'lucide-react';
import { useCoreVaultStats } from '@/hooks/useCoreVault';
import { useDOR } from '@/hooks/useRateOracle';
import { estimateJuniorAPY } from '@/lib/utils/apyCalculations';
import { formatUnits } from 'viem';
import { formatCompactNumber } from '@/lib/utils';

export default function Home() {
  // Fetch real contract data
  const { stats: vaultStats } = useCoreVaultStats();
  const { dor } = useDOR();

  // Calculate stats from contract data
  const stats = vaultStats
    ? (() => {
        const seniorAPY = Number(vaultStats.currentSeniorRate) / 100;
        const estimatedJuniorAPY = estimateJuniorAPY(
          vaultStats.seniorPrincipal,
          vaultStats.juniorPrincipal,
          vaultStats.currentSeniorRate,
          800, // Estimated 8% vault yield
        );
        const juniorAPY =
          estimatedJuniorAPY !== null ? estimatedJuniorAPY / 100 : 0;

        return {
          tvl: formatUnits(vaultStats.totalAssets, 6),
          seniorAPY: seniorAPY.toFixed(1),
          juniorAPY: juniorAPY.toFixed(1),
          dor: dor ? (Number(dor) / 100).toFixed(2) : '0.00',
        };
      })()
    : {
        tvl: '1250000', // Fallback
        seniorAPY: '5.5',
        juniorAPY: '22.5',
        dor: '4.62',
      };
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center gap-8 pb-12 pt-20 md:pt-28 lg:py-40 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-50/50 dark:from-zinc-900/50 via-background to-zinc-100/50 dark:to-zinc-800/50 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-100/20 dark:from-zinc-900/20 via-transparent to-transparent -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-8">
          <div className="flex max-w-250 flex-col items-center gap-6 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-muted-foreground">
                Protocol is Live on Mantle
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tighter md:text-7xl lg:text-8xl lg:leading-[1.1]">
              Opening the Door to{' '}
              <span className="gradient-blue-orange inline-block">
                DeFi Fixed Income
              </span>
            </h1>

            <p className="max-w-200 text-xl text-muted-foreground sm:text-2xl leading-relaxed">
              Structured DeFi product with waterfall distribution. Risk-adjusted
              yields through dual-tranche architecture on Mantle Network.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <Link href="/deposit">
              <Button
                size="lg"
                className="gap-2 text-base px-8 py-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
              >
                Start Earning <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6"
              >
                View Dashboard
              </Button>
            </Link>
          </div>

          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Powered by Treehouse DOR</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Secured by RWA</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Built on Mantle</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Risk-Adjusted DeFi Yields
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your risk profile. Conservative stability or leveraged
            growth.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out border-2 hover:border-blue-300 dark:hover:border-blue-700">
            <CardHeader>
              <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 w-fit group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">
                Senior Tranche (DOOR-FIX)
              </CardTitle>
              <CardDescription className="text-base">
                Fixed-rate {stats.seniorAPY}% APY with waterfall priority. First
                in line for yield distribution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs">
                      ✓
                    </span>
                  </div>
                  <span>Priority yield distribution</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs">
                      ✓
                    </span>
                  </div>
                  <span>Junior buffer protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs">
                      ✓
                    </span>
                  </div>
                  <span>Lower risk profile</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out border-2 hover:border-orange-300 dark:hover:border-purple-700">
            <CardHeader>
              <div className="mb-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 w-fit group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">
                Junior Tranche (DOOR-BOOST)
              </CardTitle>
              <CardDescription className="text-base">
                Amplified returns at {stats.juniorAPY}% APY. Captures excess
                yield with 5-10x leverage potential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                    <span className="text-orange-600 dark:text-purple-400 text-xs">
                      ⚡
                    </span>
                  </div>
                  <span>Excess yield concentration</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                    <span className="text-orange-600 dark:text-purple-400 text-xs">
                      ⚡
                    </span>
                  </div>
                  <span>Leverage without liquidation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                    <span className="text-orange-600 dark:text-purple-400 text-xs">
                      ⚡
                    </span>
                  </div>
                  <span>Higher risk, higher reward</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 ease-in-out border-2 hover:border-border">
            <CardHeader>
              <div className="mb-4 p-3 rounded-xl bg-secondary w-fit group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">DOOR Rate Oracle (DOR)</CardTitle>
              <CardDescription className="text-base">
                Decentralized benchmark rate with multi-source aggregation and
                challenge mechanism.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-muted-foreground text-lg">📊</span>
                  <span>Transparent on-chain oracle</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-muted-foreground text-lg">🔗</span>
                  <span>Multi-source aggregation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-muted-foreground text-lg">🌐</span>
                  <span>Open infrastructure</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-border">
        <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-2 md:grid-cols-4 text-center">
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out">
              {stats.seniorAPY}%
            </div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Senior Target APY
            </div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-600 dark:text-purple-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out">
              {stats.juniorAPY}%
            </div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Junior Current APY
            </div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out text-emerald-600 dark:text-emerald-400">
              ${formatCompactNumber(Number(stats.tvl))}
            </div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Value Locked
            </div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out text-indigo-600 dark:text-indigo-400">
              {stats.dor}%
            </div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Current DOR Rate
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="relative rounded-2xl border-2 border-border bg-linear-to-br from-secondary via-secondary to-secondary p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-zinc-200/30 dark:from-zinc-800/30 via-transparent to-transparent -z-10" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience structured DeFi yields with waterfall distribution.
              Choose Senior for stability or Junior for leveraged growth.
            </p>
            <Link href="/deposit">
              <Button
                size="lg"
                className="gap-2 text-lg px-10 py-7 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all"
              >
                Deposit Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
