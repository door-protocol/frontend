'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import TrancheSelector, {
  TrancheType,
} from '@/components/core/TrancheSelector';
import DepositInput from '@/components/core/DepositInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';
import { SENIOR_TARGET_APY, JUNIOR_APY_RANGE } from '@/lib/utils/constants';
import {
  useDepositToSeniorVault,
  useApproveUSDCForSeniorVault,
  useUSDCAllowanceForSeniorVault,
  useSeniorVaultInitialized,
} from '@/hooks/useSeniorVault';
import {
  useDepositToJuniorVault,
  useApproveUSDCForJuniorVault,
  useUSDCAllowanceForJuniorVault,
  useJuniorVaultInitialized,
} from '@/hooks/useJuniorVault';
import { useUSDCBalance } from '@/hooks/useUSDC';
import { useMintMockUSDC } from '@/hooks/useMockUSDC';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast-container';
import {
  useSeniorTargetAPY,
  useCanDepositSenior,
  useCanDepositJunior,
  useCurrentSafetyConfig,
  useSeniorDepositsPaused,
  useJuniorDepositsPaused,
} from '@/hooks/useSafetyModule';
import { ADDRESSES } from '@/lib/contracts/addresses';
import { parseUnits, formatUnits } from 'viem';

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>('senior');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  // Fetch USDC balance and allowances
  const { balance: usdcBalance, refetch: refetchBalance } = useUSDCBalance();
  const balance = usdcBalance ? Number(formatUnits(usdcBalance, 6)) : 0;

  const { allowance: seniorAllowance, refetch: refetchSeniorAllowance } =
    useUSDCAllowanceForSeniorVault();
  const { allowance: juniorAllowance, refetch: refetchJuniorAllowance } =
    useUSDCAllowanceForJuniorVault();

  // Mock USDC mint (only for testing)
  const {
    mintAmount,
    isPending: isMinting,
    isConfirming: isConfirmingMint,
    isSuccess: isMintSuccess,
    error: mintError,
  } = useMintMockUSDC();
  const isMockDeployment =
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_DEPLOYMENT === 'mock';

  // For testing: bypass safety checks in mock mode
  const [bypassSafetyCheck, setBypassSafetyCheck] = useState(false);

  // Check vault initialization
  const { initialized: seniorInitialized } = useSeniorVaultInitialized();
  const { initialized: juniorInitialized } = useJuniorVaultInitialized();

  // Safety checks
  const amountBigInt = amount ? parseUnits(amount, 6) : BigInt(0);
  const { result: seniorCheck, refetch: refetchSeniorCheck } =
    useCanDepositSenior(amountBigInt);
  const { result: juniorCheck, refetch: refetchJuniorCheck } =
    useCanDepositJunior();
  const { targetAPY } = useSeniorTargetAPY();

  // Additional safety checks for debugging
  const { config: safetyConfig } = useCurrentSafetyConfig();
  const { isPaused: isSeniorPaused } = useSeniorDepositsPaused();
  const { isPaused: isJuniorPaused } = useJuniorDepositsPaused();

  // Deposit hooks
  const {
    approve: approveSenior,
    isPending: isApprovingSenior,
    isConfirming: isConfirmingApproveSenior,
    isSuccess: isApproveSuccessSenior,
    error: approveErrorSenior,
    hash: approveHashSenior,
  } = useApproveUSDCForSeniorVault();
  const {
    approve: approveJunior,
    isPending: isApprovingJunior,
    isConfirming: isConfirmingApproveJunior,
    isSuccess: isApproveSuccessJunior,
    error: approveErrorJunior,
    hash: approveHashJunior,
  } = useApproveUSDCForJuniorVault();
  const {
    deposit: depositSenior,
    isPending: isDepositingSenior,
    isConfirming: isConfirmingDepositSenior,
    isSuccess: isSeniorSuccess,
    error: depositErrorSenior,
    hash: depositHashSenior,
  } = useDepositToSeniorVault();
  const {
    deposit: depositJunior,
    isPending: isDepositingJunior,
    isConfirming: isConfirmingDepositJunior,
    isSuccess: isJuniorSuccess,
    error: depositErrorJunior,
    hash: depositHashJunior,
  } = useDepositToJuniorVault();

  const seniorAPY = targetAPY
    ? (Number(targetAPY) / 100).toFixed(1)
    : SENIOR_TARGET_APY.toString();

  // Apply bypass in mock mode
  const rawDepositAllowed =
    selectedTranche === 'senior' ? seniorCheck?.[0] : juniorCheck?.[0];
  const depositAllowed =
    isMockDeployment && bypassSafetyCheck ? true : rawDepositAllowed;
  const depositReason =
    selectedTranche === 'senior' ? seniorCheck?.[1] : juniorCheck?.[1];

  // Check if allowance is sufficient
  const currentAllowance =
    selectedTranche === 'senior' ? seniorAllowance : juniorAllowance;
  const hasAllowance =
    currentAllowance !== undefined &&
    amountBigInt > BigInt(0) &&
    currentAllowance >= amountBigInt;

  // Debug: Monitor deposit transaction states
  useEffect(() => {
    if (isDepositingSenior || isDepositingJunior) {
      console.log('📤 Transaction Pending:', {
        tranche: selectedTranche,
        isDepositingSenior,
        isDepositingJunior,
      });
    }
  }, [isDepositingSenior, isDepositingJunior, selectedTranche]);

  useEffect(() => {
    if (isConfirmingDepositSenior || isConfirmingDepositJunior) {
      const hash = selectedTranche === 'senior' ? depositHashSenior : depositHashJunior;
      console.log('⏳ Transaction Confirming:', {
        tranche: selectedTranche,
        isConfirmingDepositSenior,
        isConfirmingDepositJunior,
        hash,
        explorerUrl: hash ? `https://sepolia.mantlescan.xyz/tx/${hash}` : null,
      });
    }
  }, [
    isConfirmingDepositSenior,
    isConfirmingDepositJunior,
    selectedTranche,
    depositHashSenior,
    depositHashJunior,
  ]);

  const handleApprove = async () => {
    if (!amount || !isConnected) return;
    const amountBigInt = parseUnits(amount, 6);

    if (selectedTranche === 'senior') {
      approveSenior(amountBigInt);
    } else {
      approveJunior(amountBigInt);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !isConnected || !address) return;
    const amountBigInt = parseUnits(amount, 6);

    console.log('🚀 Initiating Deposit:', {
      tranche: selectedTranche,
      amount,
      amountBigInt: amountBigInt.toString(),
      address,
      vaultInitialized:
        selectedTranche === 'senior' ? seniorInitialized : juniorInitialized,
      vaultAddress:
        selectedTranche === 'senior'
          ? ADDRESSES.seniorVault
          : ADDRESSES.juniorVault,
    });

    if (selectedTranche === 'senior') {
      depositSenior(amountBigInt, address);
    } else {
      depositJunior(amountBigInt, address);
    }
  };

  const handleMintMockUSDC = () => {
    if (!isConnected || !address) return;
    // Mint 10,000 Mock USDC for testing
    mintAmount(address, 10000);
  };

  // Handle Approve Success/Error
  useEffect(() => {
    if (isApproveSuccessSenior || isApproveSuccessJunior) {
      toast.success('USDC Approval Successful! You can now deposit.');
      console.log('Approve successful');
      // Refetch allowances after approval
      if (selectedTranche === 'senior') {
        refetchSeniorAllowance();
        refetchSeniorCheck();
      } else {
        refetchJuniorAllowance();
        refetchJuniorCheck();
      }
    }
  }, [
    isApproveSuccessSenior,
    isApproveSuccessJunior,
    toast,
    selectedTranche,
    refetchSeniorAllowance,
    refetchJuniorAllowance,
    refetchSeniorCheck,
    refetchJuniorCheck,
  ]);

  useEffect(() => {
    if (approveErrorSenior || approveErrorJunior) {
      const error = approveErrorSenior || approveErrorJunior;
      toast.error(`Approval Failed: ${error?.message || 'Unknown error'}`);
      console.error('Approve error:', error);
    }
  }, [approveErrorSenior, approveErrorJunior, toast]);

  // Handle Deposit Success/Error
  useEffect(() => {
    const hash = selectedTranche === 'senior' ? depositHashSenior : depositHashJunior;
    console.log('Deposit Success State:', {
      isSeniorSuccess,
      isJuniorSuccess,
      selectedTranche,
      hash,
    });
    if (isSeniorSuccess || isJuniorSuccess) {
      const explorerUrl = hash ? `https://sepolia.mantlescan.xyz/tx/${hash}` : null;
      toast.success(`Deposit Successful! ${explorerUrl ? 'View transaction →' : ''}`);
      console.log('✅ Deposit successful!', explorerUrl);
      // Reset amount after successful deposit
      setAmount('');
      // Refetch balance
      refetchBalance();
    }
  }, [
    isSeniorSuccess,
    isJuniorSuccess,
    toast,
    selectedTranche,
    refetchBalance,
    depositHashSenior,
    depositHashJunior,
  ]);

  useEffect(() => {
    console.log('Deposit Error State:', {
      depositErrorSenior,
      depositErrorJunior,
      selectedTranche,
    });
    if (depositErrorSenior || depositErrorJunior) {
      const error = depositErrorSenior || depositErrorJunior;

      // Check if it's a vault initialization error
      const errorMessage = error?.message || 'Unknown error';
      let userMessage = errorMessage;

      if (errorMessage.includes('NotInitialized') || errorMessage.includes('execution reverted')) {
        userMessage = 'Vault not initialized. Please contact the protocol administrator.';
      }

      toast.error(`Deposit Failed: ${userMessage}`);
      console.error('❌ Deposit error:', error);
    }
  }, [depositErrorSenior, depositErrorJunior, toast, selectedTranche]);

  // Handle Mint Success/Error
  useEffect(() => {
    if (isMintSuccess) {
      toast.success('Mock USDC Minted! Refreshing balance...');
      console.log('Mint successful');
      // Refresh balance after successful mint
      setTimeout(() => {
        refetchBalance();
      }, 2000);
    }
  }, [isMintSuccess, refetchBalance, toast]);

  useEffect(() => {
    if (mintError) {
      toast.error(`Mint Failed: ${mintError?.message || 'Unknown error'}`);
      console.error('Mint error:', mintError);
    }
  }, [mintError, toast]);

  return (
    <>
      <ToastContainer />
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

        {/* Mock USDC Mint (Testing Only) */}
        {isMockDeployment && isConnected && (
          <Card className="border-2 border-green-200 dark:border-green-900 bg-linear-to-br from-green-50/50 dark:from-green-950/20 to-green-100/50 dark:to-green-950/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-950/30">
                    <Info className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-300 mb-1">
                      Mock Deployment - Testing Mode
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mint test USDC tokens for free (10,000 USDC per mint)
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleMintMockUSDC}
                  disabled={isMinting || isConfirmingMint}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isMinting
                    ? 'Minting...'
                    : isConfirmingMint
                      ? 'Confirming...'
                      : isMintSuccess
                        ? '✅ Minted'
                        : 'Mint 10,000 USDC'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vault Initialization Warning */}
        {isConnected &&
          ((selectedTranche === 'senior' && seniorInitialized === false) ||
            (selectedTranche === 'junior' && juniorInitialized === false)) && (
            <Card className="border-2 border-red-200 dark:border-red-900 bg-linear-to-br from-red-50/50 dark:from-red-950/20 to-red-100/50 dark:to-red-950/30 shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 dark:text-red-300 mb-1">
                    ⚠️ Vault Not Initialized
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    The{' '}
                    {selectedTranche === 'senior' ? 'Senior' : 'Junior'} vault
                    has not been initialized yet. Deposits will fail until the
                    vault is properly set up by the protocol administrator.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vault Address:{' '}
                    {selectedTranche === 'senior'
                      ? ADDRESSES.seniorVault
                      : ADDRESSES.juniorVault}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Allowance Check Warning */}
        {isConnected && amount && Number(amount) > 0 && !hasAllowance && (
          <Card className="border-2 border-yellow-200 dark:border-yellow-900 bg-linear-to-br from-yellow-50/50 dark:from-yellow-950/20 to-yellow-100/50 dark:to-yellow-950/30 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-950/30">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                  Approval Required
                </p>
                <p className="text-sm text-muted-foreground">
                  Click "Approve USDC" before depositing to allow the vault to
                  use your USDC tokens
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Warning */}
        {rawDepositAllowed === false && depositReason && (
          <Card className="border-2 border-red-200 dark:border-red-900 bg-linear-to-br from-red-50/50 dark:from-red-950/20 to-red-100/50 dark:to-red-950/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 dark:text-red-300 mb-2 text-lg">
                    Senior Deposit Blocked
                  </p>

                  {/* User-friendly explanation */}
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                    <p className="font-medium text-red-900 dark:text-red-300 mb-2">
                      ⚠️ Insufficient Junior Capital
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      The protocol requires at least 20% Junior tranche to protect Senior depositors.
                      Currently, there isn't enough Junior capital to accept your Senior deposit.
                    </p>
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                      💡 Solution: Deposit to Junior tranche first, then you can deposit to Senior.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      onClick={() => setSelectedTranche('junior')}
                      variant="default"
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Switch to Junior Tranche
                    </Button>
                    {isMockDeployment && (
                      <Button
                        onClick={() => setBypassSafetyCheck(!bypassSafetyCheck)}
                        variant={bypassSafetyCheck ? 'default' : 'outline'}
                        size="sm"
                      >
                        {bypassSafetyCheck
                          ? '✅ Bypassed (Testing)'
                          : '⚠️ Bypass (Testing Only)'}
                      </Button>
                    )}
                  </div>
                  {/* Collapsible debug info */}
                  <details className="text-xs mt-2">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground font-medium">
                      🔍 Technical Details
                    </summary>
                    <div className="space-y-1 mt-2 p-3 bg-red-100/50 dark:bg-red-950/10 rounded">
                      <p className="font-mono text-red-900 dark:text-red-300">
                        <strong>Contract Error:</strong> {depositReason}
                      </p>
                      <hr className="my-2 border-red-200 dark:border-red-800" />
                      {hasAllowance ? (
                        <p className="text-green-600 dark:text-green-400">
                          ✓ USDC Approval: Sufficient
                        </p>
                      ) : (
                        <p className="text-red-600 dark:text-red-400">
                          ✗ USDC Approval: Need to approve first
                        </p>
                      )}
                      <p>
                        Tranche:{' '}
                        {selectedTranche === 'senior' ? 'Senior' : 'Junior'}
                      </p>
                      {selectedTranche === 'senior' &&
                        isSeniorPaused !== undefined && (
                          <p>
                            Senior Deposits Paused:{' '}
                            {isSeniorPaused ? 'Yes ❌' : 'No ✓'}
                          </p>
                        )}
                      {selectedTranche === 'junior' &&
                        isJuniorPaused !== undefined && (
                          <p>
                            Junior Deposits Paused:{' '}
                            {isJuniorPaused ? 'Yes ❌' : 'No ✓'}
                          </p>
                        )}
                      {safetyConfig && (
                        <>
                          <p>
                            Min Junior Ratio: {(Number(safetyConfig.minJuniorRatio) / 100).toFixed(1)}%
                          </p>
                          <p>
                            Senior Deposits Enabled:{' '}
                            {safetyConfig.seniorDepositsEnabled
                              ? 'Yes ✓'
                              : 'No ❌'}
                          </p>
                          <p>
                            Junior Deposits Enabled:{' '}
                            {safetyConfig.juniorDepositsEnabled
                              ? 'Yes ✓'
                              : 'No ❌'}
                          </p>
                        </>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tranche Selection */}
        <TrancheSelector
          selectedTranche={selectedTranche}
          onSelect={setSelectedTranche}
          seniorAPY={Number(seniorAPY)}
          juniorAPYRange={JUNIOR_APY_RANGE}
        />

        {/* Deposit Amount Input */}
        <DepositInput
          value={amount}
          onChange={setAmount}
          balance={balance}
          apy={
            selectedTranche === 'senior'
              ? Number(seniorAPY)
              : JUNIOR_APY_RANGE[0]
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

        {/* Approve & Deposit Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleApprove}
            disabled={
              !isConnected ||
              !amount ||
              Number(amount) <= 0 ||
              hasAllowance ||
              isApprovingSenior ||
              isApprovingJunior ||
              isConfirmingApproveSenior ||
              isConfirmingApproveJunior
            }
            className="w-full"
            size="lg"
            variant="outline"
          >
            {hasAllowance
              ? '✅ Already Approved'
              : isApprovingSenior || isApprovingJunior
                ? 'Approving...'
                : isConfirmingApproveSenior || isConfirmingApproveJunior
                  ? 'Confirming...'
                  : isApproveSuccessSenior || isApproveSuccessJunior
                    ? '✅ Approved'
                    : 'Approve USDC'}
          </Button>

          <Button
            onClick={handleDeposit}
            disabled={
              !isConnected ||
              !amount ||
              Number(amount) <= 0 ||
              !hasAllowance ||
              depositAllowed === false ||
              isDepositingSenior ||
              isDepositingJunior ||
              isConfirmingDepositSenior ||
              isConfirmingDepositJunior
            }
            className={`w-full text-lg py-7 shadow-2xl ${
              selectedTranche === 'senior'
                ? 'shadow-blue-500/30 hover:shadow-blue-500/40'
                : 'shadow-orange-500/30 hover:shadow-orange-500/40'
            }`}
            size="lg"
          >
            {!isConnected
              ? 'Connect Wallet to Deposit'
              : !hasAllowance
                ? 'Approve USDC First'
                : isDepositingSenior || isDepositingJunior
                  ? 'Depositing...'
                  : isConfirmingDepositSenior || isConfirmingDepositJunior
                    ? 'Confirming...'
                    : isSeniorSuccess || isJuniorSuccess
                      ? '✅ Deposit Successful!'
                      : depositAllowed === false
                        ? 'Deposits Not Allowed'
                        : 'Deposit Now'}
          </Button>
        </div>

        {/* Info */}
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-linear-to-br from-blue-50/50 dark:from-blue-950/20 to-blue-100/50 dark:to-blue-950/30 shadow-lg">
          <CardContent className="p-6 space-y-3">
            <h4 className="font-bold text-lg text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <span className="text-xl">ℹ️</span>
              Important Information
            </h4>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                  •
                </span>
                <span>
                  Deposits are processed at the start of each Epoch (7 days)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                  •
                </span>
                <span>
                  Target APY is indicative and may vary based on market
                  conditions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                  •
                </span>
                <span>
                  Junior tranche bears first loss in case of vault
                  underperformance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                  •
                </span>
                <span>Senior tranche has priority claim on yields</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
