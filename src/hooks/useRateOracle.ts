import { useReadContract } from 'wagmi';
import { ADDRESSES, RateOracleABI } from '@/lib/contracts/addresses';

/**
 * Hook to read current DOR (DOOR Optimized Rate)
 */
export function useDOR() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.rateOracle,
    abi: RateOracleABI,
    functionName: 'getDOR',
  });

  return {
    dor: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read all rate sources
 */
export function useAllRateSources() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.rateOracle,
    abi: RateOracleABI,
    functionName: 'getAllRateSources',
  });

  return {
    rateSources: data as
      | Array<{
          name: string;
          weight: bigint;
          rate: bigint;
          lastUpdate: bigint;
          isActive: boolean;
        }>
      | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read senior target APY from oracle
 */
export function useSeniorTargetAPY() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.rateOracle,
    abi: RateOracleABI,
    functionName: 'getSeniorTargetAPY',
  });

  return {
    seniorTargetAPY: data as bigint | undefined,
    isLoading,
    error,
  };
}
