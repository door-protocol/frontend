'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, Zap, Info } from 'lucide-react';
import { formatUnits, parseUnits } from 'viem';
import { useSeniorVaultBalance } from '@/hooks/useSeniorVault';
import { useJuniorVaultBalance } from '@/hooks/useJuniorVault';
import {
  useRequestWithdraw,
  useEarlyWithdraw,
  useCalculatePenalty,
  useEarlyWithdrawPenaltyRate,
  useTimeUntilNextEpoch,
  useCurrentEpochState,
  useUserWithdrawRequests,
} from '@/hooks/useEpochManager';

type TrancheType = 'senior' | 'junior';

export default function WithdrawPage() {
  const { address, isConnected } = useAccount();
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>('senior');
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState<bigint>(BigInt(0));

  // Fetch balances
  const { balance: seniorBalance } = useSeniorVaultBalance();
  const { balance: juniorBalance } = useJuniorVaultBalance();

  // Fetch epoch data
  const { timeRemaining } = useTimeUntilNextEpoch();
  const { state: epochState } = useCurrentEpochState();
  const { requests } = useUserWithdrawRequests(address);

  // Withdrawal hooks
  const {
    requestWithdraw,
    isPending: isRequestPending,
    isSuccess: isRequestSuccess,
  } = useRequestWithdraw();
  const {
    earlyWithdraw,
    isPending: isEarlyPending,
    isSuccess: isEarlySuccess,
  } = useEarlyWithdraw();

  // Calculate penalty
  const { penalty } = useCalculatePenalty(selectedTranche === 'senior', shares);
  const { penaltyRate } = useEarlyWithdrawPenaltyRate();

  const balance = selectedTranche === 'senior' ? seniorBalance : juniorBalance;

  // Update shares when amount changes
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      setShares(parseUnits(amount, 6)); // USDC has 6 decimals
    } else {
      setShares(BigInt(0));
    }
  }, [amount]);

  const handleRequestWithdraw = () => {
    if (!shares || shares === BigInt(0)) return;
    requestWithdraw(selectedTranche === 'senior', shares);
  };

  const handleEarlyWithdraw = () => {
    if (!shares || shares === BigInt(0)) return;
    earlyWithdraw(selectedTranche === 'senior', shares);
  };

  const handleMaxClick = () => {
    if (balance) {
      setAmount(formatUnits(balance, 6));
    }
  };

  const formatTime = (seconds: bigint) => {
    const totalSeconds = Number(seconds);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-3">
          Withdraw Funds
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your withdrawal method: queue for next epoch or withdraw
          immediately
        </p>
      </div>

      {/* Warning - Connect Wallet */}
      {!isConnected && (
        <Card className="border-2 border-orange-200 dark:border-orange-900 bg-linear-to-br from-orange-50/50 dark:from-orange-950/20 to-orange-100/50 dark:to-orange-950/30 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-950/30">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-orange-900 dark:text-orange-300 mb-1">
                Wallet Not Connected
              </p>
              <p className="text-sm text-muted-foreground">
                Please connect your wallet to withdraw funds
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Epoch Info */}
      {timeRemaining !== undefined && (
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-linear-to-br from-blue-50/50 dark:from-blue-950/20 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-foreground">
                    Next Epoch in: {formatTime(timeRemaining)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Queued withdrawals will be processed at epoch end
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Epoch State</p>
                <p className="font-semibold text-foreground">
                  {epochState === 0
                    ? 'Open'
                    : epochState === 1
                      ? 'Locked'
                      : 'Settled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tranche Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Tranche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedTranche('senior')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedTranche === 'senior'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-border hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-bold text-lg mb-1">Senior (DOOR-FIX)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Fixed yield, lower risk
                </p>
                <p className="text-sm font-medium">
                  Balance: {seniorBalance ? formatUnits(seniorBalance, 6) : '0'}{' '}
                  USDC
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedTranche('junior')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedTranche === 'junior'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-border hover:border-orange-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">⚔️</div>
                <h3 className="font-bold text-lg mb-1">Junior (DOOR-BOOST)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Variable yield, higher risk
                </p>
                <p className="text-sm font-medium">
                  Balance: {juniorBalance ? formatUnits(juniorBalance, 6) : '0'}{' '}
                  USDC
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Methods */}
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Queue for Next Epoch
          </TabsTrigger>
          <TabsTrigger value="immediate" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Immediate Withdrawal
          </TabsTrigger>
        </TabsList>

        {/* Queue Withdrawal */}
        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Queue for Next Epoch (No Penalty)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="queue-amount">Amount (USDC)</Label>
                  <button
                    onClick={handleMaxClick}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Max
                  </button>
                </div>
                <Input
                  id="queue-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Available: {balance ? formatUnits(balance, 6) : '0'} USDC
                </p>
              </div>

              {amount && Number(amount) > 0 && (
                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Withdrawal Amount
                      </span>
                      <span className="font-medium">{amount} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Penalty</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        None
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-medium">You will receive</span>
                      <span className="font-bold">{amount} USDC</span>
                    </div>
                    <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-background">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Your withdrawal will be processed at the end of the
                        current epoch (
                        {timeRemaining ? formatTime(timeRemaining) : '...'})
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleRequestWithdraw}
                disabled={
                  !isConnected ||
                  !amount ||
                  Number(amount) <= 0 ||
                  isRequestPending
                }
                className="w-full"
                size="lg"
              >
                {isRequestPending
                  ? 'Requesting...'
                  : isRequestSuccess
                    ? 'Request Submitted!'
                    : 'Request Withdrawal'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Immediate Withdrawal */}
        <TabsContent value="immediate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Immediate Withdrawal (With Penalty)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="immediate-amount">Amount (USDC)</Label>
                  <button
                    onClick={handleMaxClick}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Max
                  </button>
                </div>
                <Input
                  id="immediate-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Available: {balance ? formatUnits(balance, 6) : '0'} USDC
                </p>
              </div>

              {/* Penalty Warning */}
              <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-orange-900 dark:text-orange-300">
                      Early Withdrawal Penalty
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Early withdrawals incur a{' '}
                      {penaltyRate
                        ? (Number(penaltyRate) / 100).toFixed(1)
                        : '1'}
                      % penalty. This penalty is distributed to remaining users.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {amount && Number(amount) > 0 && penalty !== undefined && (
                <Card className="border-border bg-background">
                  <CardContent className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Withdrawal Amount
                      </span>
                      <span className="font-medium">{amount} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Penalty (
                        {penaltyRate
                          ? (Number(penaltyRate) / 100).toFixed(1)
                          : '1'}
                        %)
                      </span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        -{formatUnits(penalty, 6)} USDC
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-medium">You will receive</span>
                      <span className="font-bold">
                        {(
                          Number(amount) - Number(formatUnits(penalty, 6))
                        ).toFixed(2)}{' '}
                        USDC
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleEarlyWithdraw}
                disabled={
                  !isConnected ||
                  !amount ||
                  Number(amount) <= 0 ||
                  isEarlyPending
                }
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                {isEarlyPending
                  ? 'Withdrawing...'
                  : isEarlySuccess
                    ? 'Withdrawal Complete!'
                    : 'Withdraw Immediately'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pending Withdrawal Requests */}
      {requests && requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests
                .filter((req) => !req.processed)
                .map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {req.isSenior ? '🛡️' : '⚔️'}
                      </div>
                      <div>
                        <p className="font-medium">
                          {req.isSenior ? 'Senior' : 'Junior'} Tranche
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Epoch #{Number(req.epochId)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatUnits(req.shares, 6)} USDC
                      </p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
