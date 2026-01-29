import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import {
  ADDRESSES,
  SeniorVaultABI,
  ERC20_ABI,
} from '@/lib/contracts/addresses';

/**
 * Hook to check if Senior vault is initialized
 */
export function useSeniorVaultInitialized() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.seniorVault,
    abi: SeniorVaultABI,
    functionName: 'initialized',
  });

  return {
    initialized: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read user's Senior vault balance
 */
export function useSeniorVaultBalance() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.seniorVault,
    abi: SeniorVaultABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to read total supply of Senior vault shares
 */
export function useSeniorVaultTotalSupply() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.seniorVault,
    abi: SeniorVaultABI,
    functionName: 'totalSupply',
  });

  return {
    totalSupply: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read total assets in Senior vault
 */
export function useSeniorVaultTotalAssets() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.seniorVault,
    abi: SeniorVaultABI,
    functionName: 'totalAssets',
  });

  return {
    totalAssets: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read total principal in Senior vault
 */
export function useSeniorVaultTotalPrincipal() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.seniorVault,
    abi: SeniorVaultABI,
    functionName: 'totalPrincipal',
  });

  return {
    totalPrincipal: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to deposit to Senior vault
 */
export function useDepositToSeniorVault() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = (amount: bigint, receiver: `0x${string}`) => {
    writeContract({
      address: ADDRESSES.seniorVault,
      abi: SeniorVaultABI,
      functionName: 'deposit',
      args: [amount, receiver],
    });
  };

  return {
    deposit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to approve USDC for Senior vault
 */
export function useApproveUSDCForSeniorVault() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (amount: bigint) => {
    writeContract({
      address: ADDRESSES.usdc,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [ADDRESSES.seniorVault, amount],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to read USDC allowance for Senior vault
 */
export function useUSDCAllowanceForSeniorVault() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.usdc,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, ADDRESSES.seniorVault] : undefined,
  });

  return {
    allowance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to withdraw from Senior vault
 */
export function useWithdrawFromSeniorVault() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = (
    assets: bigint,
    receiver: `0x${string}`,
    owner: `0x${string}`,
  ) => {
    writeContract({
      address: ADDRESSES.seniorVault,
      abi: SeniorVaultABI,
      functionName: 'withdraw',
      args: [assets, receiver, owner],
    });
  };

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to calculate claimable yield for Senior vault
 * Calculates real-time yield estimation based on time elapsed and APY
 */
export function useSeniorVaultClaimableYield() {
  const { address } = useAccount();
  const { balance: shares } = useSeniorVaultBalance();
  const { totalSupply } = useSeniorVaultTotalSupply();
  const { totalPrincipal: seniorPrincipal } = useSeniorVaultTotalPrincipal();

  // Get last harvest time and current senior rate from CoreVault
  const { data: lastHarvestTime } = useReadContract({
    address: ADDRESSES.coreVault,
    abi: [
      {
        type: 'function',
        name: 'lastHarvestTime',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
    ] as const,
    functionName: 'lastHarvestTime',
  });

  const { data: stats } = useReadContract({
    address: ADDRESSES.coreVault,
    abi: [
      {
        type: 'function',
        name: 'getStats',
        inputs: [],
        outputs: [
          {
            name: '_seniorPrincipal',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_juniorPrincipal',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'totalAssets', type: 'uint256', internalType: 'uint256' },
          {
            name: 'currentSeniorRate',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'juniorRatio', type: 'uint256', internalType: 'uint256' },
          { name: 'isHealthy', type: 'bool', internalType: 'bool' },
        ],
        stateMutability: 'view',
      },
    ] as const,
    functionName: 'getStats',
  });

  // Calculate time elapsed since last harvest
  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const timeElapsed =
    lastHarvestTime && lastHarvestTime > BigInt(0)
      ? currentTime - (lastHarvestTime as bigint)
      : BigInt(0);

  // Calculate expected total senior yield
  // Formula: (seniorPrincipal * currentSeniorRate * timeElapsed) / (365 days * 10000)
  let expectedTotalYield = BigInt(0);
  if (stats && Array.isArray(stats) && timeElapsed > BigInt(0)) {
    const principal = stats[0] as bigint; // seniorPrincipal
    const rate = stats[3] as bigint; // currentSeniorRate in basis points
    const SECONDS_PER_YEAR = BigInt(365 * 24 * 60 * 60); // 31536000
    const BASIS_POINTS = BigInt(10000);

    expectedTotalYield =
      (principal * rate * timeElapsed) / (SECONDS_PER_YEAR * BASIS_POINTS);
  }

  // Calculate user's proportional share of the yield
  let claimableYield = BigInt(0);
  if (
    shares &&
    totalSupply &&
    totalSupply > BigInt(0) &&
    expectedTotalYield > BigInt(0)
  ) {
    claimableYield = (shares * expectedTotalYield) / totalSupply;
  }

  // Also check convertToAssets for any already-distributed yield
  const { data: assets } = useReadContract({
    address: ADDRESSES.seniorVault,
    abi: SeniorVaultABI,
    functionName: 'convertToAssets',
    args: shares ? [shares] : undefined,
  });

  // If convertToAssets shows yield (assets > shares), use that instead
  const distributedYield = assets && shares ? assets - shares : BigInt(0);
  if (distributedYield > claimableYield) {
    claimableYield = distributedYield;
  }

  console.log('[Senior Claimable Yield Debug]');
  console.log('  Address:', address);
  console.log('  Shares:', shares?.toString());
  console.log('  Total Supply:', totalSupply?.toString());
  console.log(
    '  Senior Principal:',
    stats ? (stats[0] as bigint).toString() : 'undefined',
  );
  console.log(
    '  Current Senior Rate (bps):',
    stats ? (stats[3] as bigint).toString() : 'undefined',
  );
  console.log('  Last Harvest Time:', lastHarvestTime?.toString());
  console.log('  Time Elapsed (seconds):', timeElapsed.toString());
  console.log(
    '  Expected Total Yield (calculated):',
    expectedTotalYield.toString(),
  );
  console.log('  Claimable Yield:', claimableYield.toString());
  console.log('  Distributed Yield:', distributedYield.toString());
  console.log('  Assets from convertToAssets:', assets?.toString());

  return {
    claimableYield,
    isLoading: false,
    error: null,
  };
}
