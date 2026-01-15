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

  console.log('=== useCurrentSafetyLevel ===');
  console.log('SafetyModule Address:', ADDRESSES.safetyModule);
  console.log('Level Data:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

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

  console.log('=== useCurrentSafetyConfig ===');
  console.log('Config Data:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Handle both array and object formats
  let config: SafetyConfig | undefined;

  if (data) {
    if (Array.isArray(data)) {
      // Contract returns tuple as array: [minJuniorRatio, maxSeniorDeposit, seniorTargetAPY, seniorDepositsEnabled, juniorDepositsEnabled]
      config = {
        minJuniorRatio: data[0] as bigint,
        maxSeniorDeposit: data[1] as bigint,
        seniorTargetAPY: data[2] as bigint,
        seniorDepositsEnabled: data[3] as boolean,
        juniorDepositsEnabled: data[4] as boolean,
      };
      console.log('Converted array to object:', config);
    } else {
      config = data as unknown as SafetyConfig;
    }
  }

  return {
    config,
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

  console.log('=== useHealthStatus ===');
  console.log('Health Status Data:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Handle both array and object formats
  type HealthStatus = {
    isHealthy: boolean;
    isCritical: boolean;
    currentRatio: bigint;
  };

  let healthStatus: HealthStatus | undefined;

  if (data) {
    if (Array.isArray(data)) {
      // Contract returns tuple as array: [isHealthy, isCritical, currentRatio]
      healthStatus = {
        isHealthy: data[0] as boolean,
        isCritical: data[1] as boolean,
        currentRatio: data[2] as bigint,
      };
      console.log('Converted array to object:', healthStatus);
    } else {
      healthStatus = data as unknown as HealthStatus;
    }
  }

  return {
    healthStatus,
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
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'canDepositSenior',
    args: amount !== undefined ? [amount] : undefined,
    query: {
      enabled: amount !== undefined && amount > BigInt(0),
    },
  });

  // Contract returns tuple as array: [canDeposit, reason]
  const result = data ? (data as [boolean, string]) : undefined;

  return {
    result,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to check if junior deposit is allowed
 */
export function useCanDepositJunior() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.safetyModule,
    abi: SafetyModuleABI,
    functionName: 'canDepositJunior',
  });

  // Contract returns tuple as array: [canDeposit, reason]
  const result = data ? (data as [boolean, string]) : undefined;

  return {
    result,
    isLoading,
    error,
    refetch,
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
