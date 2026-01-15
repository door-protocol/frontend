import { useReadContract } from 'wagmi';
import { ADDRESSES, SafetyModuleABI } from '@/lib/contracts/addresses';

export enum SafetyLevel {
  HEALTHY = 0,
  CAUTION = 1,
  WARNING = 2,
  DANGER = 3,
  CRITICAL = 4,
}

export type SafetyConfig = {
  minJuniorRatio: bigint;
  maxSeniorDeposit: bigint;
  seniorTargetAPY: bigint;
  seniorDepositsEnabled: boolean;
  juniorDepositsEnabled: boolean;
};

/**
 * Hook to read current safety level
 */
export function useCurrentSafetyLevel() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'getCurrentLevel',
  });

  return {
    level: data as SafetyLevel | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to read current safety configuration
 */
export function useCurrentSafetyConfig() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'getCurrentConfig',
  });

  return {
    config: data as SafetyConfig | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read protocol health status
 */
export function useHealthStatus() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'getHealthStatus',
  });

  return {
    healthStatus: data as
      | {
          isHealthy: boolean;
          isCritical: boolean;
          currentRatio: bigint;
        }
      | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to check if deposit is allowed for a tranche
 */
export function useIsDepositAllowed(isSenior: boolean) {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'isDepositAllowed',
    args: [isSenior],
  });

  return {
    isAllowed: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to check if senior deposit is allowed for specific amount
 */
export function useCanDepositSenior(amount?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'canDepositSenior',
    args: amount !== undefined ? [amount] : undefined,
    query: {
      enabled: amount !== undefined && amount > BigInt(0),
    },
  });

  return {
    result: data as [boolean, string] | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to check if junior deposit is allowed
 */
export function useCanDepositJunior() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'canDepositJunior',
  });

  return {
    result: data as [boolean, string] | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read senior target APY for current safety level
 */
export function useSeniorTargetAPY() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'getSeniorTargetAPY',
  });

  return {
    targetAPY: data as bigint | undefined, // In basis points (600 = 6%)
    isLoading,
    error,
  };
}

/**
 * Hook to read minimum junior ratio for current safety level
 */
export function useMinJuniorRatio() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'getMinJuniorRatio',
  });

  return {
    minRatio: data as bigint | undefined, // In basis points (1000 = 10%)
    isLoading,
    error,
  };
}

/**
 * Hook to check if senior deposits are paused
 */
export function useSeniorDepositsPaused() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'seniorDepositsPaused',
  });

  return {
    isPaused: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to check if junior deposits are paused
 */
export function useJuniorDepositsPaused() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'juniorDepositsPaused',
  });

  return {
    isPaused: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to calculate required junior deposit to reach target ratio
 */
export function useRequiredJuniorDeposit(targetRatio?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'calculateRequiredJuniorDeposit',
    args: targetRatio !== undefined ? [targetRatio] : undefined,
    query: {
      enabled: targetRatio !== undefined && targetRatio > BigInt(0),
    },
  });

  return {
    requiredDeposit: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Utility function to get safety level name
 */
export function getSafetyLevelName(level: SafetyLevel): string {
  const names = ['Healthy', 'Caution', 'Warning', 'Danger', 'Critical'];
  return names[level] || 'Unknown';
}

/**
 * Utility function to get safety level color
 */
export function getSafetyLevelColor(level: SafetyLevel): string {
  const colors = ['green', 'blue', 'yellow', 'orange', 'red'];
  return colors[level] || 'gray';
}
