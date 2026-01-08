'use client';

import { useAccount } from 'wagmi';
import PositionCard from '@/components/portfolio/PositionCard';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Wallet } from 'lucide-react';
import { mockUserPosition, mockCurrentEpoch } from '@/mock/vaultData';
import { formatNumber } from '@/lib/utils';

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();

  // Mock user position
  const position = mockUserPosition;
  const hasSeniorPosition = Number(position.senior.balance) > 0;
  const hasJuniorPosition = Number(position.junior.balance) > 0;

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Portfolio</h1>
        <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
          <CardContent className="p-8 text-center">
            <Wallet className="h-12 w-12 mx-auto text-orange-600 dark:text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
            <p className="text-sm text-muted-foreground">
              Please connect your wallet to view your portfolio
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground mt-2">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-3xl font-bold">
            ${formatNumber(Number(position.totalValue))}
          </p>
        </div>
      </div>

      {/* Info Alert */}
      {!hasSeniorPosition && !hasJuniorPosition && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 ">
                No Active Positions
              </p>
              <p className="text-xs text-muted-foreground">
                Make your first deposit to start earning
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Senior Position */}
      {hasSeniorPosition && (
        <PositionCard
          tranche="senior"
          balance={position.senior.balance}
          claimableYield={position.senior.claimableYield}
          apy={5.5}
          depositEpoch={position.senior.depositEpoch}
          currentEpoch={mockCurrentEpoch.epochId}
        />
      )}

      {/* Junior Position */}
      {hasJuniorPosition && (
        <PositionCard
          tranche="junior"
          balance={position.junior.balance}
          claimableYield={position.junior.claimableYield}
          apy={18.2}
          depositEpoch={position.junior.depositEpoch}
          currentEpoch={mockCurrentEpoch.epochId}
        />
      )}

      {/* Summary Card */}
      {(hasSeniorPosition || hasJuniorPosition) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Portfolio Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Deposited</span>
                <span className="font-medium">
                  $
                  {formatNumber(
                    Number(position.senior.balance) +
                      Number(position.junior.balance),
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Total Claimable Yield
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  +$
                  {formatNumber(
                    Number(position.senior.claimableYield) +
                      Number(position.junior.claimableYield),
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-medium">Total Value</span>
                <span className="font-bold">
                  ${formatNumber(Number(position.totalValue))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
