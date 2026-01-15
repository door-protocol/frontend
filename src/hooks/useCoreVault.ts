import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { ADDRESSES, CoreVaultABI } from '@/lib/contracts/addresses';

/**
 * Hook to read CoreVault stats
 */
export function useCoreVaultStats() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.coreVault,
    abi: CoreVaultABI,
    functionName: 'getStats',
  });

  return {
    stats: data as
      | {
          seniorPrincipal: bigint;
          juniorPrincipal: bigint;
          totalAssets: bigint;
          currentSeniorRate: bigint;
          juniorRatio: bigint;
          isHealthy: boolean;
        }
      | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to read CoreVault senior fixed rate
 */
export function useSeniorFixedRate() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.coreVault,
    abi: CoreVaultABI,
    functionName: 'seniorFixedRate',
  });

  return {
    seniorFixedRate: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read CoreVault junior ratio
 */
export function useJuniorRatio() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.coreVault,
    abi: CoreVaultABI,
    functionName: 'getJuniorRatio',
  });

  return {
    juniorRatio: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read emergency mode status
 */
export function useEmergencyMode() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.coreVault,
    abi: CoreVaultABI,
    functionName: 'emergencyMode',
  });

  return {
    emergencyMode: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to harvest yield (requires KEEPER_ROLE)
 */
export function useHarvest() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const harvest = () => {
    writeContract({
      address: ADDRESSES.coreVault,
      abi: CoreVaultABI,
      functionName: 'harvest',
    });
  };

  return {
    harvest,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
