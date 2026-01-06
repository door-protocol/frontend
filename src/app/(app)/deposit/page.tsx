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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deposit Funds</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Choose your tranche and deposit USDT to start earning
        </p>
      </div>

      {/* Warning - Connect Wallet */}
      {!isConnected && (
        <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-400">
              Please connect your wallet to deposit funds
            </p>
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
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold">Deposit Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Tranche
                </span>
                <span className="font-medium">
                  {selectedTranche === 'senior'
                    ? '🛡️ Senior (DOOR-FIX)'
                    : '⚔️ Junior (DOOR-BOOST)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Amount</span>
                <span className="font-medium">{amount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Target APY
                </span>
                <span
                  className={`font-medium ${
                    selectedTranche === 'senior'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-orange-600 dark:text-orange-400'
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
        className="w-full"
        size="lg"
      >
        {isConnected ? 'Deposit Now' : 'Connect Wallet to Deposit'}
      </Button>

      {/* Info */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-4 space-y-2 text-sm">
          <h4 className="font-semibold text-blue-900 dark:text-blue-400">
            Important Information
          </h4>
          <ul className="space-y-1 text-blue-800 dark:text-blue-300">
            <li>
              • Deposits are processed at the start of each Epoch (7 days)
            </li>
            <li>
              • Target APY is indicative and may vary based on market conditions
            </li>
            <li>
              • Junior tranche bears first loss in case of vault
              underperformance
            </li>
            <li>• Senior tranche has priority claim on yields</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
