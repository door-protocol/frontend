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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-8 pb-12 pt-20 md:pt-28 lg:py-40 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-background dark:via-background dark:to-background -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100/30 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent -z-10" />

        <div className="flex max-w-[1000px] flex-col items-center gap-6 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-border bg-white/50 dark:bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-zinc-700 dark:text-muted-foreground">
              Protocol is Live on Mantle
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tighter md:text-7xl lg:text-8xl lg:leading-[1.1]">
            Opening the Door to{' '}
            <span className="gradient-blue-orange inline-block">
              DeFi Fixed Income
            </span>
          </h1>

          <p className="max-w-[800px] text-xl text-zinc-600 dark:text-muted-foreground sm:text-2xl leading-relaxed">
            Decentralized Offered Rate protocol. Get predictable yields with
            Senior/Junior tranches powered by Mantle.
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
              className="text-base px-8 py-6 hover:bg-zinc-50"
            >
              View Dashboard
            </Button>
          </Link>
        </div>

        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-600 dark:text-muted-foreground animate-fade-in"
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
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why DOOR Protocol?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Choose your strategy. Stable income or aggressive growth.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out border-2 hover:border-blue-200 dark:hover:border-primary/30">
            <CardHeader>
              <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-primary/10 w-fit group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <Shield className="h-8 w-8 text-blue-600 dark:text-primary" />
              </div>
              <CardTitle className="text-xl">Stable Returns</CardTitle>
              <CardDescription className="text-base">
                Senior tranche offers 5-6% target APY with priority yield
                distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs">
                      ✓
                    </span>
                  </div>
                  <span>Priority yield distribution</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs">
                      ✓
                    </span>
                  </div>
                  <span>Junior buffer protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs">
                      ✓
                    </span>
                  </div>
                  <span>Lower risk profile</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 ease-in-out border-2 hover:border-orange-200 dark:hover:border-accent/30">
            <CardHeader>
              <div className="mb-4 p-3 rounded-xl bg-orange-50 dark:bg-accent/10 w-fit group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-accent" />
              </div>
              <CardTitle className="text-xl">High Yield Potential</CardTitle>
              <CardDescription className="text-base">
                Junior tranche targets 15-30% APY with leverage effect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-accent/20 flex items-center justify-center">
                    <span className="text-orange-600 dark:text-accent text-xs">
                      ⚡
                    </span>
                  </div>
                  <span>Excess yield concentration</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-accent/20 flex items-center justify-center">
                    <span className="text-orange-600 dark:text-accent text-xs">
                      ⚡
                    </span>
                  </div>
                  <span>Leverage without liquidation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-accent/20 flex items-center justify-center">
                    <span className="text-orange-600 dark:text-accent text-xs">
                      ⚡
                    </span>
                  </div>
                  <span>Higher risk, higher reward</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 ease-in-out border-2 hover:border-zinc-200 dark:hover:border-muted">
            <CardHeader>
              <div className="mb-4 p-3 rounded-xl bg-zinc-50 dark:bg-muted w-fit group-hover:scale-110 transition-transform duration-500 ease-in-out">
                <Lock className="h-8 w-8 text-zinc-600 dark:text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">DOR Infrastructure</CardTitle>
              <CardDescription className="text-base">
                First decentralized benchmark rate for DeFi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-zinc-600 dark:text-zinc-400 text-lg">
                    📊
                  </span>
                  <span>Transparent on-chain oracle</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-zinc-600 dark:text-zinc-400 text-lg">
                    🔗
                  </span>
                  <span>Multi-source aggregation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-zinc-600 dark:text-zinc-400 text-lg">
                    🌐
                  </span>
                  <span>Open infrastructure</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t dark:border-border">
        <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-2 md:grid-cols-4 text-center">
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-primary mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out">
              5.5%
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-muted-foreground">
              Senior Target APY
            </div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-600 dark:text-accent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out">
              15-30%
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-muted-foreground">
              Junior Target APY
            </div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out dark:text-foreground">
              $1.25M
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-muted-foreground">
              Total Value Locked
            </div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 ease-in-out dark:text-foreground">
              4.62%
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-muted-foreground">
              Current DOR Rate
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="relative rounded-2xl border-2 border-zinc-200 dark:border-border bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-card dark:via-card dark:to-card p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-200/30 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent -z-10" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join DOOR Protocol and choose between stable returns or high-yield
              opportunities. Connect your wallet to get started.
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
