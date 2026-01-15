import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { ADDRESSES, EpochManagerABI } from '@/lib/contracts/addresses';

/**
 * Hook to read current epoch ID
 */
export function useCurrentEpochId() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.epochManager,
    abi: EpochManagerABI,
    functionName: 'currentEpochId',
  });

  return {
    currentEpochId: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to read current epoch state
 */
export function useCurrentEpochState() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.epochManager,
    abi: EpochManagerABI,
    functionName: 'getCurrentState',
  });

  return {
    state: data as number | undefined, // 0: OPEN, 1: LOCKED, 2: SETTLED
    isLoading,
    error,
  };
}

/**
 * Hook to read epoch data
 */
export function useEpoch(epochId?: bigint) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.epochManager,
    abi: EpochManagerABI,
    functionName: 'getEpoch',
    args: epochId !== undefined ? [epochId] : undefined,
    query: {
      enabled: epochId !== undefined,
    },
  });

  return {
    epoch: data as
      | {
          id: bigint;
          startTime: bigint;
          endTime: bigint;
          state: number;
          totalDeposits: bigint;
          totalWithdrawRequests: bigint;
          settled: boolean;
        }
      | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to read time until next epoch
 */
export function useTimeUntilNextEpoch() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.epochManager,
    abi: EpochManagerABI,
    functionName: 'timeUntilNextEpoch',
  });

  return {
    timeRemaining: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read user's withdrawal requests
 */
export function useUserWithdrawRequests(userAddress?: `0x${string}`) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.epochManager,
    abi: EpochManagerABI,
    functionName: 'getUserWithdrawRequests',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    requests: data as
      | Array<{
          user: `0x${string}`;
          isSenior: boolean;
          shares: bigint;
          epochId: bigint;
          processed: boolean;
        }>
      | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to calculate early withdrawal penalty
 */
export function useCalculatePenalty(isSenior: boolean, shares?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.epochManager,
    abi: EpochManagerABI,
    functionName: 'calculatePenalty',
    args: shares !== undefined ? [isSenior, shares] : undefined,
    query: {
      enabled: shares !== undefined && shares > BigInt(0),
    },
  });

  return {
    penalty: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read early withdrawal penalty rate
 */
export function useEarlyWithdrawPenaltyRate() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.epochManager,
    abi: EpochManagerABI,
    functionName: 'earlyWithdrawPenalty',
  });

  return {
    penaltyRate: data as bigint | undefined, // In basis points (100 = 1%)
    isLoading,
    error,
  };
}

/**
 * Hook to request withdrawal for next epoch
 */
export function useRequestWithdraw() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const requestWithdraw = (isSenior: boolean, shares: bigint) => {
    writeContract({
      address: ADDRESSES.epochManager,
      abi: EpochManagerABI,
      functionName: 'requestWithdraw',
      args: [isSenior, shares],
    });
  };

  return {
    requestWithdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to perform early withdrawal with penalty
 */
export function useEarlyWithdraw() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const earlyWithdraw = (isSenior: boolean, shares: bigint) => {
    writeContract({
      address: ADDRESSES.epochManager,
      abi: EpochManagerABI,
      functionName: 'earlyWithdraw',
      args: [isSenior, shares],
    });
  };

  return {
    earlyWithdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
