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
