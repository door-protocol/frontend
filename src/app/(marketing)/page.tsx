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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-16 md:pt-24 lg:py-32">
        <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
            Opening the Door to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              DeFi Fixed Income
            </span>
          </h1>
          <p className="max-w-[750px] text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Decentralized Offered Rate protocol. Get predictable yields with
            Senior/Junior tranches powered by Mantle.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/deposit">
            <Button size="lg" className="gap-2">
              Start Earning <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              View Dashboard
            </Button>
          </Link>
        </div>
        <div className="mt-8 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Powered by Treehouse DOR</span>
          <span>•</span>
          <span>Secured by RWA</span>
          <span>•</span>
          <span>Built on Mantle</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Why DOOR Protocol?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Stable Returns</CardTitle>
              <CardDescription>
                Senior tranche offers 5-6% target APY with priority yield
                distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>{' '}
                  Priority yield distribution
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>{' '}
                  Junior buffer protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>{' '}
                  Lower risk profile
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-orange-600 dark:text-orange-400 mb-2" />
              <CardTitle>High Yield Potential</CardTitle>
              <CardDescription>
                Junior tranche targets 15-30% APY with leverage effect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-400">
                    ⚡
                  </span>{' '}
                  Excess yield concentration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-400">
                    ⚡
                  </span>{' '}
                  Leverage without liquidation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-400">
                    ⚡
                  </span>{' '}
                  Higher risk, higher reward
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-zinc-600 dark:text-zinc-400 mb-2" />
              <CardTitle>DOR Infrastructure</CardTitle>
              <CardDescription>
                First decentralized benchmark rate for DeFi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-400">📊</span>{' '}
                  Transparent on-chain oracle
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-400">🔗</span>{' '}
                  Multi-source aggregation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-400">🌐</span>{' '}
                  Open infrastructure
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-16 border-t dark:border-zinc-800">
        <div className="grid gap-8 md:grid-cols-4 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              5.5%
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Senior Target APY
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
              15-30%
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Junior Target APY
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold">$1.25M</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Total Value Locked
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold">4.62%</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Current DOR Rate
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl mx-auto">
            Join DOOR Protocol and choose between stable returns or high-yield
            opportunities. Connect your wallet to get started.
          </p>
          <Link href="/deposit">
            <Button size="lg" className="gap-2">
              Deposit Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
