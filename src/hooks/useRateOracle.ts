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

  console.log('=== useDOR ===');
  console.log('RateOracle Address:', ADDRESSES.rateOracle);
  console.log('DOR Raw Data:', data);
  console.log('DOR Loading:', isLoading);
  console.log('DOR Error:', error);

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

  console.log('=== useAllRateSources ===');
  console.log('Sources Raw Data:', data);
  console.log('Sources Loading:', isLoading);
  console.log('Sources Error:', error);

  // Handle both array and object formats
  type RateSource = {
    name: string;
    weight: bigint;
    rate: bigint;
    lastUpdate: bigint;
    isActive: boolean;
  };

  let rateSources: Array<RateSource> | undefined;

  if (data && Array.isArray(data)) {
    // Check if it's an array of tuples (arrays) or array of objects
    if (data.length > 0 && Array.isArray(data[0])) {
      // Contract returns array of tuples: [[name, weight, rate, lastUpdate, isActive], ...]
      rateSources = data.map((source: any) => ({
        name: source[0] as string,
        weight: source[1] as bigint,
        rate: source[2] as bigint,
        lastUpdate: source[3] as bigint,
        isActive: source[4] as boolean,
      }));
      console.log(
        'Converted array of tuples to array of objects:',
        rateSources,
      );
    } else {
      // Already array of objects
      rateSources = data as unknown as Array<RateSource>;
    }
  }

  return {
    rateSources,
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

  console.log('=== useSeniorTargetAPY ===');
  console.log('Target APY Raw Data:', data);
  console.log('Target APY Loading:', isLoading);
  console.log('Target APY Error:', error);

  return {
    seniorTargetAPY: data as bigint | undefined,
    isLoading,
    error,
  };
}
