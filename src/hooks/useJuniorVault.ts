import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import {
  ADDRESSES,
  JuniorVaultABI,
  ERC20_ABI,
} from '@/lib/contracts/addresses';

/**
 * Hook to check if Junior vault is initialized
 */
export function useJuniorVaultInitialized() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.juniorVault,
    abi: JuniorVaultABI,
    functionName: 'initialized',
  });

  return {
    initialized: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read user's Junior vault balance
 */
export function useJuniorVaultBalance() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.juniorVault,
    abi: JuniorVaultABI,
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
 * Hook to read total supply of Junior vault shares
 */
export function useJuniorVaultTotalSupply() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.juniorVault,
    abi: JuniorVaultABI,
    functionName: 'totalSupply',
  });

  return {
    totalSupply: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read total assets in Junior vault
 */
export function useJuniorVaultTotalAssets() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.juniorVault,
    abi: JuniorVaultABI,
    functionName: 'totalAssets',
  });

  return {
    totalAssets: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read total principal in Junior vault
 */
export function useJuniorVaultTotalPrincipal() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.juniorVault,
    abi: JuniorVaultABI,
    functionName: 'totalPrincipal',
  });

  return {
    totalPrincipal: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to deposit to Junior vault
 */
export function useDepositToJuniorVault() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = (amount: bigint, receiver: `0x${string}`) => {
    writeContract({
      address: ADDRESSES.juniorVault,
      abi: JuniorVaultABI,
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
 * Hook to approve USDC for Junior vault
 */
export function useApproveUSDCForJuniorVault() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (amount: bigint) => {
    writeContract({
      address: ADDRESSES.usdc,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [ADDRESSES.juniorVault, amount],
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
 * Hook to read USDC allowance for Junior vault
 */
export function useUSDCAllowanceForJuniorVault() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.usdc,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, ADDRESSES.juniorVault] : undefined,
  });

  return {
    allowance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to withdraw from Junior vault
 */
export function useWithdrawFromJuniorVault() {
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
      address: ADDRESSES.juniorVault,
      abi: JuniorVaultABI,
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
 * Hook to calculate claimable yield for Junior vault
 * Junior gets all yield after senior tranche is paid
 */
export function useJuniorVaultClaimableYield() {
  const { address } = useAccount();
  const { balance: shares } = useJuniorVaultBalance();
  const { totalSupply } = useJuniorVaultTotalSupply();

  // Get CoreVault stats
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

  // Get last harvest time and calculate time elapsed
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

  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const timeElapsed =
    lastHarvestTime && lastHarvestTime > BigInt(0)
      ? currentTime - (lastHarvestTime as bigint)
      : BigInt(0);

  // Calculate total expected yield and junior's portion
  let claimableYield = BigInt(0);
  if (
    stats &&
    Array.isArray(stats) &&
    shares &&
    totalSupply &&
    totalSupply > BigInt(0) &&
    timeElapsed > BigInt(0)
  ) {
    const seniorPrincipal = stats[0] as bigint;
    const juniorPrincipal = stats[1] as bigint;
    const totalAssets = stats[2] as bigint;
    const currentSeniorRate = stats[3] as bigint;
    const totalPrincipal = seniorPrincipal + juniorPrincipal;

    // Calculate expected senior yield
    // Formula: (seniorPrincipal * currentSeniorRate * timeElapsed) / (365 days * 10000)
    const SECONDS_PER_YEAR = BigInt(365 * 24 * 60 * 60);
    const BASIS_POINTS = BigInt(10000);
    const expectedSeniorYield =
      (seniorPrincipal * currentSeniorRate * timeElapsed) /
      (SECONDS_PER_YEAR * BASIS_POINTS);

    // Total yield from assets
    const totalYield =
      totalAssets > totalPrincipal ? totalAssets - totalPrincipal : BigInt(0);

    // Junior yield = total yield - senior yield (if positive)
    // Note: If total yield < senior yield, junior gets 0 (they take the loss first)
    const juniorTotalYield =
      totalYield > expectedSeniorYield
        ? totalYield - expectedSeniorYield
        : BigInt(0);

    // User's proportional share
    if (juniorTotalYield > BigInt(0)) {
      claimableYield = (shares * juniorTotalYield) / totalSupply;
    }
  }

  // Also check convertToAssets for any already-distributed yield
  const { data: assets } = useReadContract({
    address: ADDRESSES.juniorVault,
    abi: JuniorVaultABI,
    functionName: 'convertToAssets',
    args: shares ? [shares] : undefined,
  });

  const distributedYield = assets && shares ? assets - shares : BigInt(0);
  if (distributedYield > claimableYield) {
    claimableYield = distributedYield;
  }

  console.log('[Junior Claimable Yield Debug]');
  console.log('  Address:', address);
  console.log('  Shares:', shares?.toString());
  console.log('  Total Supply:', totalSupply?.toString());
  console.log('  Last Harvest Time:', lastHarvestTime?.toString());
  console.log('  Time Elapsed (seconds):', timeElapsed.toString());
  if (stats && Array.isArray(stats)) {
    const seniorPrincipal = stats[0] as bigint;
    const currentSeniorRate = stats[3] as bigint;
    const SECONDS_PER_YEAR = BigInt(365 * 24 * 60 * 60);
    const BASIS_POINTS = BigInt(10000);
    const expectedSeniorYield =
      timeElapsed > BigInt(0)
        ? (seniorPrincipal * currentSeniorRate * timeElapsed) /
          (SECONDS_PER_YEAR * BASIS_POINTS)
        : BigInt(0);
    console.log(
      '  Expected Senior Yield (calculated):',
      expectedSeniorYield.toString(),
    );
  }
  console.log('  Claimable Yield:', claimableYield.toString());
  console.log('  Distributed Yield:', distributedYield.toString());
  console.log('  Assets from convertToAssets:', assets?.toString());

  return {
    claimableYield,
    isLoading: false,
    error: null,
  };
}
