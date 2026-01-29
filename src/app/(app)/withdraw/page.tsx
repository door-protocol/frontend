'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useSearchParams } from 'next/navigation';
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
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast-container';
import { Spinner } from '@/components/ui/spinner';
import { EARLY_WITHDRAW_PENALTY } from '@/lib/utils/constants';
import { ADDRESSES, ERC20_ABI } from '@/lib/contracts/addresses';

type TrancheType = 'senior' | 'junior';

function WithdrawPageContent() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();

  const initialTranche =
    (searchParams.get('tranche') as TrancheType) || 'senior';
  const initialAmount = searchParams.get('amount') || '';

  const [selectedTranche, setSelectedTranche] =
    useState<TrancheType>(initialTranche);
  const [selectedTab, setSelectedTab] = useState<string>(
    searchParams.get('type') === 'immediate' ? 'immediate' : 'queue',
  );
  const [amount, setAmount] = useState(initialAmount);
  const [shares, setShares] = useState<bigint>(BigInt(0));
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();

  // Track shown toasts to prevent duplicates
  const shownToastsRef = useRef<Set<string>>(new Set());

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
    isConfirming: isRequestConfirming,
    isSuccess: isRequestSuccess,
    isReverted: isRequestReverted,
    error: requestError,
    hash: requestHash,
  } = useRequestWithdraw();
  const {
    earlyWithdraw,
    isPending: isEarlyPending,
    isConfirming: isEarlyConfirming,
    isSuccess: isEarlySuccess,
    isReverted: isEarlyReverted,
    error: earlyError,
    hash: earlyHash,
  } = useEarlyWithdraw();

  // Calculate penalty
  const { penalty } = useCalculatePenalty(selectedTranche === 'senior', shares);
  const { penaltyRate } = useEarlyWithdrawPenaltyRate();

  // Check allowance for early withdraw (only for immediate withdrawal)
  const vaultAddress =
    selectedTranche === 'senior'
      ? ADDRESSES.seniorVault
      : ADDRESSES.juniorVault;
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: vaultAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, ADDRESSES.epochManager] : undefined,
    query: {
      enabled: !!address && selectedTab === 'immediate', // Only check for immediate withdraw
    },
  });

  // Check if allowance is sufficient for early withdraw
  const hasAllowance =
    allowance !== undefined && shares > BigInt(0) && allowance >= shares;

  // Approve hook for early withdraw
  const {
    data: approveHash,
    writeContract: approve,
    isPending: isApprovePending,
    error: approveError,
  } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // Logging
  console.log('=== Withdraw Page Data ===');
  console.log('Address:', address);
  console.log('Senior Balance:', seniorBalance);
  console.log('Junior Balance:', juniorBalance);
  console.log('Time Remaining:', timeRemaining);
  console.log('Epoch State:', epochState, '(0=OPEN, 1=LOCKED, 2=SETTLED)');
  console.log('Requests:', requests);
  console.log('Penalty Rate:', penaltyRate);
  console.log('Selected Tranche:', selectedTranche);
  console.log('Shares:', shares);
  console.log('Penalty:', penalty);
  console.log('Transaction States:', {
    request: {
      isPending: isRequestPending,
      isConfirming: isRequestConfirming,
      isSuccess: isRequestSuccess,
    },
    early: {
      isPending: isEarlyPending,
      isConfirming: isEarlyConfirming,
      isSuccess: isEarlySuccess,
    },
  });
  console.log('===========================');

  const balance = selectedTranche === 'senior' ? seniorBalance : juniorBalance;

  // Calculate pending withdrawal requests for current tranche
  const pendingShares = requests
    ? requests
        .filter(
          (req) =>
            !req.processed && req.isSenior === (selectedTranche === 'senior'),
        )
        .reduce((sum, req) => sum + req.shares, BigInt(0))
    : BigInt(0);

  // Available balance after pending requests
  const availableBalance =
    balance && balance > pendingShares ? balance - pendingShares : BigInt(0);

  console.log('💰 Balance calculation:', {
    tranche: selectedTranche,
    totalBalance: balance?.toString(),
    pendingShares: pendingShares.toString(),
    availableBalance: availableBalance.toString(),
  });

  // Mark initial load as complete
  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  // Reset amount when tranche changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      setAmount('');
    }
  }, [selectedTranche, isInitialLoad]);

  // Update shares when amount changes
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      setShares(parseUnits(amount, 6)); // USDC has 6 decimals
    } else {
      setShares(BigInt(0));
    }
  }, [amount]);

  // Handle approve success
  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      const toastKey = `approve-withdraw-${approveHash}`;
      if (!shownToastsRef.current.has(toastKey)) {
        shownToastsRef.current.add(toastKey);
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${approveHash}`;
        toast.success('Shares Approval Successful!', {
          url: explorerUrl,
          label: 'View transaction →',
        });
        console.log('✅ Approve successful!', explorerUrl);
        refetchAllowance();
      }
    }
  }, [isApproveSuccess, approveHash, toast, refetchAllowance]);

  // Handle approve error
  useEffect(() => {
    if (approveError) {
      const errorMessage = parseWithdrawError(approveError);
      toast.error(`Approval Failed: ${errorMessage}`);
      console.error('❌ Approve error:', approveError);
    }
  }, [approveError, toast]);

  // Handle Request Withdraw Success/Error
  useEffect(() => {
    console.log('🔍 Request withdraw state changed:', {
      isRequestPending,
      isRequestConfirming,
      isRequestSuccess,
      isRequestReverted,
      requestHash,
      requestError,
    });

    if (isRequestSuccess && requestHash) {
      const toastKey = `request-withdraw-${requestHash}`;
      if (!shownToastsRef.current.has(toastKey)) {
        shownToastsRef.current.add(toastKey);
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${requestHash}`;
        toast.success('Withdrawal Request Successful!', {
          url: explorerUrl,
          label: 'View transaction →',
        });
        console.log('✅ Request withdraw successful!', explorerUrl);
        setAmount('');
      }
    }
  }, [
    isRequestPending,
    isRequestConfirming,
    isRequestSuccess,
    isRequestReverted,
    requestHash,
    requestError,
    toast,
  ]);

  useEffect(() => {
    console.log('🔍 Request error state:', requestError);
    if (requestError) {
      const errorMessage = parseWithdrawError(requestError);
      toast.error(`Request Withdraw Failed: ${errorMessage}`);
      console.error('❌ Request withdraw error:', requestError);
      console.error(
        'Full error object:',
        JSON.stringify(requestError, null, 2),
      );
    }
  }, [requestError, toast]);

  // Handle transaction revert
  useEffect(() => {
    if (isRequestReverted && requestHash) {
      const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${requestHash}`;
      toast.error('Withdrawal Request Failed: Transaction reverted', {
        url: explorerUrl,
        label: 'View transaction →',
      });
      console.error('❌ Request withdraw reverted:', requestHash);
    }
  }, [isRequestReverted, requestHash, toast]);

  // Handle Early Withdraw Success/Error
  useEffect(() => {
    console.log('🔍 Early withdraw state changed:', {
      isEarlyPending,
      isEarlyConfirming,
      isEarlySuccess,
      isEarlyReverted,
      earlyHash,
      earlyError,
    });

    if (isEarlySuccess && earlyHash) {
      const toastKey = `early-withdraw-${earlyHash}`;
      if (!shownToastsRef.current.has(toastKey)) {
        shownToastsRef.current.add(toastKey);
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${earlyHash}`;
        toast.success('Early Withdrawal Successful!', {
          url: explorerUrl,
          label: 'View transaction →',
        });
        console.log('✅ Early withdraw successful!', explorerUrl);
        setAmount('');
      }
    }
  }, [
    isEarlyPending,
    isEarlyConfirming,
    isEarlySuccess,
    isEarlyReverted,
    earlyHash,
    earlyError,
    toast,
  ]);

  useEffect(() => {
    console.log('🔍 Early error state:', earlyError);
    if (earlyError) {
      const errorMessage = parseWithdrawError(earlyError);
      toast.error(`Early Withdraw Failed: ${errorMessage}`);
      console.error('❌ Early withdraw error:', earlyError);
      console.error('Full error object:', JSON.stringify(earlyError, null, 2));
    }
  }, [earlyError, toast]);

  // Parse error message from contract
  const parseWithdrawError = (error: unknown): string => {
    const errorStr =
      (error as Error)?.message ||
      (error as { toString?: () => string })?.toString?.() ||
      '';

    if (errorStr.includes('InsufficientShares')) {
      return 'Insufficient shares in your balance';
    }
    if (errorStr.includes('NoSharesRequested')) {
      return 'Amount must be greater than zero';
    }
    if (errorStr.includes('NotInitialized')) {
      return 'Contract not initialized. Please contact support.';
    }
    if (
      errorStr.includes('ERC20InsufficientAllowance') ||
      errorStr.includes('allowance')
    ) {
      return 'Please approve your shares first';
    }
    if (errorStr.includes('ERC20InsufficientBalance')) {
      return 'Insufficient balance';
    }
    if (
      errorStr.includes('User rejected') ||
      errorStr.includes('user rejected')
    ) {
      return 'Transaction cancelled by user';
    }

    return 'Transaction failed. Please try again.';
  };

  // Handle transaction revert
  useEffect(() => {
    if (isEarlyReverted && earlyHash) {
      const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${earlyHash}`;
      toast.error('Early Withdrawal Failed: Transaction reverted', {
        url: explorerUrl,
        label: 'View transaction →',
      });
      console.error('❌ Early withdraw reverted:', earlyHash);
    }
  }, [isEarlyReverted, earlyHash, toast]);

  const handleRequestWithdraw = () => {
    if (!shares || shares === BigInt(0)) return;
    requestWithdraw(selectedTranche === 'senior', shares);
  };

  const handleApprove = () => {
    if (!shares || shares === BigInt(0)) return;
    console.log('🔐 Approving shares:', {
      vaultAddress,
      spender: ADDRESSES.epochManager,
      amount: shares.toString(),
    });
    approve({
      address: vaultAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [ADDRESSES.epochManager, shares],
    });
  };

  const handleEarlyWithdraw = () => {
    if (!shares || shares === BigInt(0)) return;
    if (!hasAllowance) {
      // Should not happen if UI is correct, but safety check
      toast.error('Please approve your shares first');
      return;
    }
    console.log('🚀 Initiating early withdraw:', {
      tranche: selectedTranche,
      shares: shares.toString(),
      isSenior: selectedTranche === 'senior',
    });
    earlyWithdraw(selectedTranche === 'senior', shares);
  };

  const handleMaxClick = () => {
    // Both queue and immediate can only use available balance (minus pending requests)
    if (availableBalance) {
      setAmount(formatUnits(availableBalance, 6));
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
    <>
      <ToastContainer />
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
                className={`p-6 rounded-lg border-2 transition-all duration-500 ease-in-out ${
                  selectedTranche === 'senior'
                    ? 'ring-4 ring-blue-500 dark:ring-blue-600 border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-xl shadow-blue-500/20'
                    : 'border-border hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <h3 className="font-bold text-lg mb-1">Senior (DOOR-FIX)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fixed yield, lower risk
                  </p>
                  <p className="text-sm font-medium">
                    Balance:{' '}
                    {seniorBalance ? formatUnits(seniorBalance, 6) : '0'} USDC
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTranche('junior')}
                className={`p-6 rounded-lg border-2 transition-all duration-500 ease-in-out ${
                  selectedTranche === 'junior'
                    ? 'ring-4 ring-orange-500 dark:ring-orange-600 border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-xl shadow-orange-500/20'
                    : 'border-border hover:border-orange-300 hover:shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">⚔️</div>
                  <h3 className="font-bold text-lg mb-1">
                    Junior (DOOR-BOOST)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Variable yield, higher risk
                  </p>
                  <p className="text-sm font-medium">
                    Balance:{' '}
                    {juniorBalance ? formatUnits(juniorBalance, 6) : '0'} USDC
                  </p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Methods */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
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
                    Available:{' '}
                    {availableBalance ? formatUnits(availableBalance, 6) : '0'}{' '}
                    USDC
                    {pendingShares > BigInt(0) && (
                      <span className="text-orange-600 dark:text-orange-400 ml-1">
                        ({formatUnits(pendingShares, 6)} pending)
                      </span>
                    )}
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
                    availableBalance === BigInt(0) ||
                    Number(amount) > Number(formatUnits(availableBalance, 6)) ||
                    isRequestPending ||
                    isRequestConfirming ||
                    isRequestSuccess
                  }
                  className="w-full"
                  size="lg"
                >
                  {isRequestPending ? (
                    <>
                      <Spinner className="mr-2" size="md" />
                      Requesting...
                    </>
                  ) : isRequestConfirming ? (
                    <>
                      <Spinner className="mr-2" size="md" />
                      Confirming...
                    </>
                  ) : isRequestSuccess ? (
                    '✅ Request Submitted!'
                  ) : (
                    'Request Withdrawal'
                  )}
                </Button>

                {/* Reset Button - Show after successful request */}
                {isRequestSuccess && (
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                    size="lg"
                  >
                    Make Another Withdrawal
                  </Button>
                )}
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
                    Available:{' '}
                    {availableBalance ? formatUnits(availableBalance, 6) : '0'}{' '}
                    USDC
                    {pendingShares > BigInt(0) && (
                      <span className="text-orange-600 dark:text-orange-400 ml-1">
                        ({formatUnits(pendingShares, 6)} locked in queue)
                      </span>
                    )}
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
                          : EARLY_WITHDRAW_PENALTY}
                        % penalty. This penalty is distributed to remaining
                        users.
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
                            : EARLY_WITHDRAW_PENALTY}
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

                {/* Step 1: Approve Shares */}
                <Button
                  onClick={handleApprove}
                  disabled={
                    !isConnected ||
                    !amount ||
                    Number(amount) <= 0 ||
                    availableBalance === BigInt(0) ||
                    Number(amount) > Number(formatUnits(availableBalance, 6)) ||
                    isApprovePending ||
                    isApproveConfirming ||
                    hasAllowance // Already approved
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  size="lg"
                >
                  {isApprovePending ? (
                    <>
                      <Spinner className="mr-2" size="md" />
                      Approving...
                    </>
                  ) : isApproveConfirming ? (
                    <>
                      <Spinner className="mr-2" size="md" />
                      Confirming Approval...
                    </>
                  ) : hasAllowance ? (
                    '✓ Approved'
                  ) : (
                    'Approve Shares'
                  )}
                </Button>

                {/* Step 2: Withdraw Immediately */}
                <Button
                  onClick={handleEarlyWithdraw}
                  disabled={
                    !isConnected ||
                    !amount ||
                    Number(amount) <= 0 ||
                    availableBalance === BigInt(0) ||
                    Number(amount) > Number(formatUnits(availableBalance, 6)) ||
                    isEarlyPending ||
                    isEarlyConfirming ||
                    isEarlySuccess ||
                    !hasAllowance // Need approval first
                  }
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  {isEarlyPending ? (
                    <>
                      <Spinner className="mr-2" size="md" />
                      Withdrawing...
                    </>
                  ) : isEarlyConfirming ? (
                    <>
                      <Spinner className="mr-2" size="md" />
                      Confirming...
                    </>
                  ) : isEarlySuccess ? (
                    '✅ Withdrawal Complete!'
                  ) : (
                    'Withdraw Immediately'
                  )}
                </Button>

                {/* Reset Button - Show after successful withdrawal */}
                {isEarlySuccess && (
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                    size="lg"
                  >
                    Make Another Withdrawal
                  </Button>
                )}
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
    </>
  );
}

export default function WithdrawPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto p-8 text-center">Loading...</div>
      }
    >
      <WithdrawPageContent />
    </Suspense>
  );
}
