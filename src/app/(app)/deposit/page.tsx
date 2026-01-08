'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import TrancheSelector, {
  TrancheType,
} from '@/components/core/TrancheSelector';
import DepositInput from '@/components/core/DepositInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { SENIOR_TARGET_APY, JUNIOR_APY_RANGE } from '@/lib/utils/constants';

export default function DepositPage() {
  const { isConnected } = useAccount();
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>('senior');
  const [amount, setAmount] = useState('');

  // Mock balance
  const mockBalance = 10000;

  const handleDeposit = async () => {
    if (!amount || !isConnected) return;

    // Mock deposit logic
    console.log('Depositing:', amount, 'to', selectedTranche);
    alert(`Mock deposit: ${amount} USDT to ${selectedTranche} tranche`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-3">
          Deposit Funds
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your strategy and deposit USDT to start earning
        </p>
      </div>

      {/* Warning - Connect Wallet */}
      {!isConnected && (
        <Card className="border-2 border-orange-200 dark:border-orange-900 bg-linear-to-br from-orange-50/50 dark:from-orange-950/20 to-orange-100/50 dark:to-orange-950/30 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-950/30">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400 " />
            </div>
            <div>
              <p className="font-semibold text-orange-900 dark:text-orange-300 mb-1">
                Wallet Not Connected
              </p>
              <p className="text-sm text-muted-foreground">
                Please connect your wallet to deposit funds and start earning
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tranche Selection */}
      <TrancheSelector
        selectedTranche={selectedTranche}
        onSelect={setSelectedTranche}
        seniorAPY={SENIOR_TARGET_APY}
        juniorAPYRange={JUNIOR_APY_RANGE}
      />

      {/* Deposit Amount Input */}
      <DepositInput
        value={amount}
        onChange={setAmount}
        balance={mockBalance}
        apy={
          selectedTranche === 'senior' ? SENIOR_TARGET_APY : JUNIOR_APY_RANGE[0]
        }
      />

      {/* Deposit Summary */}
      {amount && Number(amount) > 0 && (
        <Card className="border-2 border-border shadow-xl animate-fade-in-up">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="text-xl">📋</span>
              Deposit Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-background">
                <span className="text-sm font-medium text-muted-foreground">
                  Tranche
                </span>
                <span className="font-bold">
                  {selectedTranche === 'senior'
                    ? '🛡️ Senior (DOOR-FIX)'
                    : '⚔️ Junior (DOOR-BOOST)'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background">
                <span className="text-sm font-medium text-muted-foreground">
                  Amount
                </span>
                <span className="font-bold text-lg">{amount} USDT</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background">
                <span className="text-sm font-medium text-muted-foreground">
                  Target APY
                </span>
                <span
                  className={`font-bold text-lg ${
                    selectedTranche === 'senior'
                      ? 'text-blue-600 dark:text-blue-400 '
                      : 'text-orange-600 dark:text-orange-400 '
                  }`}
                >
                  {selectedTranche === 'senior'
                    ? `${SENIOR_TARGET_APY}%`
                    : `${JUNIOR_APY_RANGE[0]}-${JUNIOR_APY_RANGE[1]}%`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deposit Button */}
      <Button
        onClick={handleDeposit}
        disabled={!isConnected || !amount || Number(amount) <= 0}
        className={`w-full text-lg py-7 shadow-2xl ${
          selectedTranche === 'senior'
            ? 'shadow-blue-500/30 hover:shadow-blue-500/40'
            : 'shadow-orange-500/30 hover:shadow-orange-500/40'
        }`}
        size="lg"
      >
        {isConnected ? 'Deposit Now' : 'Connect Wallet to Deposit'}
      </Button>

      {/* Info */}
      <Card className="border-2 border-blue-200 dark:border-blue-900 bg-linear-to-br from-blue-50/50 dark:from-blue-950/20 to-blue-100/50 dark:to-blue-950/30 shadow-lg">
        <CardContent className="p-6 space-y-3">
          <h4 className="font-bold text-lg text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            Important Information
          </h4>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>
                Deposits are processed at the start of each Epoch (7 days)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>
                Target APY is indicative and may vary based on market conditions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>
                Junior tranche bears first loss in case of vault
                underperformance
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <span>Senior tranche has priority claim on yields</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
