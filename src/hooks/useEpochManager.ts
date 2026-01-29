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

  console.log('=== useCurrentEpochId ===');
  console.log('EpochManager Address:', ADDRESSES.epochManager);
  console.log('Current Epoch ID:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

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

  console.log('=== useCurrentEpochState ===');
  console.log('State Data:', data, '(0=OPEN, 1=LOCKED, 2=SETTLED)');
  console.log('Loading:', isLoading);
  console.log('Error:', error);

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

  console.log('=== useEpoch ===');
  console.log('Epoch ID:', epochId);
  console.log('Epoch Data:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Handle both array and object formats
  type EpochData = {
    id: bigint;
    startTime: bigint;
    endTime: bigint;
    state: number;
    totalDeposits: bigint;
    totalWithdrawRequests: bigint;
    settled: boolean;
  };

  let epoch: EpochData | undefined;

  if (data) {
    if (Array.isArray(data)) {
      // Contract returns tuple as array: [id, startTime, endTime, state, totalDeposits, totalWithdrawRequests, settled]
      epoch = {
        id: data[0] as bigint,
        startTime: data[1] as bigint,
        endTime: data[2] as bigint,
        state: data[3] as number,
        totalDeposits: data[4] as bigint,
        totalWithdrawRequests: data[5] as bigint,
        settled: data[6] as boolean,
      };
      console.log('Converted array to object:', epoch);
    } else {
      epoch = data as unknown as EpochData;
    }
  }

  return {
    epoch,
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

  // Handle both array and object formats
  type WithdrawRequest = {
    user: `0x${string}`;
    isSenior: boolean;
    shares: bigint;
    epochId: bigint;
    processed: boolean;
  };

  let requests: Array<WithdrawRequest> | undefined;

  if (data && Array.isArray(data)) {
    // Check if it's an array of tuples (arrays) or array of objects
    if (data.length > 0 && Array.isArray(data[0])) {
      // Contract returns array of tuples: [[user, isSenior, shares, epochId, processed], ...]
      requests = data.map((req: unknown[]) => ({
        user: req[0] as `0x${string}`,
        isSenior: req[1] as boolean,
        shares: req[2] as bigint,
        epochId: req[3] as bigint,
        processed: req[4] as boolean,
      }));
    } else {
      // Already array of objects
      requests = data as unknown as Array<WithdrawRequest>;
    }
  }

  return {
    requests,
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

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({
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

  // Check if transaction was reverted
  const isReverted = receipt?.status === 'reverted';

  return {
    requestWithdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess: isSuccess && !isReverted,
    isReverted,
    error,
  };
}

/**
 * Hook to perform early withdrawal with penalty
 */
export function useEarlyWithdraw() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({
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

  // Check if transaction was reverted
  const isReverted = receipt?.status === 'reverted';

  return {
    earlyWithdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess: isSuccess && !isReverted,
    isReverted,
    error,
  };
}
