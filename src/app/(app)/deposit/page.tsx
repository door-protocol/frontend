'use client';

import { useState } from 'react';
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
} from '@/hooks/useSeniorVault';
import {
  useDepositToJuniorVault,
  useApproveUSDCForJuniorVault,
} from '@/hooks/useJuniorVault';
import { useUSDCBalance } from '@/hooks/useUSDC';
import {
  useSeniorTargetAPY,
  useCanDepositSenior,
  useCanDepositJunior,
} from '@/hooks/useSafetyModule';
import { ADDRESSES } from '@/lib/contracts/addresses';
import { parseUnits, formatUnits } from 'viem';

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>('senior');
  const [amount, setAmount] = useState('');

  // Fetch USDC balance
  const { balance: usdcBalance } = useUSDCBalance();
  const balance = usdcBalance ? Number(formatUnits(usdcBalance, 6)) : 0;

  // Safety checks
  const amountBigInt = amount ? parseUnits(amount, 6) : BigInt(0);
  const { result: seniorCheck } = useCanDepositSenior(amountBigInt);
  const { result: juniorCheck } = useCanDepositJunior();
  const { targetAPY } = useSeniorTargetAPY();

  // Deposit hooks
  const { approve: approveSenior, isPending: isApprovingSenior } =
    useApproveUSDCForSeniorVault();
  const { approve: approveJunior, isPending: isApprovingJunior } =
    useApproveUSDCForJuniorVault();
  const {
    deposit: depositSenior,
    isPending: isDepositingSenior,
    isSuccess: isSeniorSuccess,
  } = useDepositToSeniorVault();
  const {
    deposit: depositJunior,
    isPending: isDepositingJunior,
    isSuccess: isJuniorSuccess,
  } = useDepositToJuniorVault();

  const seniorAPY = targetAPY
    ? (Number(targetAPY) / 100).toFixed(1)
    : SENIOR_TARGET_APY.toString();
  const depositAllowed =
    selectedTranche === 'senior' ? seniorCheck?.[0] : juniorCheck?.[0];
  const depositReason =
    selectedTranche === 'senior' ? seniorCheck?.[1] : juniorCheck?.[1];

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

    if (selectedTranche === 'senior') {
      depositSenior(amountBigInt, address);
    } else {
      depositJunior(amountBigInt, address);
    }
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

      {/* Safety Warning */}
      {depositAllowed === false && depositReason && (
        <Card className="border-2 border-red-200 dark:border-red-900 bg-linear-to-br from-red-50/50 dark:from-red-950/20 to-red-100/50 dark:to-red-950/30 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/30">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-900 dark:text-red-300 mb-1">
                Deposits Not Allowed
              </p>
              <p className="text-sm text-muted-foreground">{depositReason}</p>
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
          selectedTranche === 'senior' ? Number(seniorAPY) : JUNIOR_APY_RANGE[0]
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
            depositAllowed === false ||
            isApprovingSenior ||
            isApprovingJunior
          }
          className="w-full"
          size="lg"
          variant="outline"
        >
          {isApprovingSenior || isApprovingJunior
            ? 'Approving...'
            : 'Approve USDC'}
        </Button>

        <Button
          onClick={handleDeposit}
          disabled={
            !isConnected ||
            !amount ||
            Number(amount) <= 0 ||
            depositAllowed === false ||
            isDepositingSenior ||
            isDepositingJunior
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
            : isDepositingSenior || isDepositingJunior
              ? 'Depositing...'
              : isSeniorSuccess || isJuniorSuccess
                ? 'Deposit Successful!'
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
