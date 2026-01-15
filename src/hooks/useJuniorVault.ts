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
