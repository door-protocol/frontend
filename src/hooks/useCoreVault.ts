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

  console.log('=== useCoreVaultStats ===');
  console.log('CoreVault Address:', ADDRESSES.coreVault);
  console.log('Raw Data:', data);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  // Handle both array and object formats
  type VaultStats = {
    seniorPrincipal: bigint;
    juniorPrincipal: bigint;
    totalAssets: bigint;
    currentSeniorRate: bigint;
    juniorRatio: bigint;
    isHealthy: boolean;
  };

  let stats: VaultStats | undefined;

  if (data) {
    if (Array.isArray(data)) {
      // Contract returns tuple as array: [seniorPrincipal, juniorPrincipal, totalAssets, currentSeniorRate, juniorRatio, isHealthy]
      stats = {
        seniorPrincipal: data[0] as bigint,
        juniorPrincipal: data[1] as bigint,
        totalAssets: data[2] as bigint,
        currentSeniorRate: data[3] as bigint,
        juniorRatio: data[4] as bigint,
        isHealthy: data[5] as boolean,
      };
      console.log('Converted array to object:', stats);
    } else {
      stats = data as unknown as VaultStats;
    }
  }

  return {
    stats,
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
 * Hook to read protocol fee rate
 */
export function useProtocolFeeRate() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.coreVault,
    abi: CoreVaultABI,
    functionName: 'protocolFeeRate',
  });

  return {
    protocolFeeRate: data as bigint | undefined,
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
