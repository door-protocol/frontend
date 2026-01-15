import { useReadContract, useAccount } from 'wagmi';
import { ADDRESSES, ERC20_ABI } from '@/lib/contracts/addresses';

/**
 * Hook to read user's USDC balance
 */
export function useUSDCBalance() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: ADDRESSES.usdc,
    abi: ERC20_ABI,
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
 * Hook to read USDC decimals
 */
export function useUSDCDecimals() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.usdc,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  return {
    decimals: data as number | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to read USDC symbol
 */
export function useUSDCSymbol() {
  const { data, isLoading, error } = useReadContract({
    address: ADDRESSES.usdc,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  return {
    symbol: data as string | undefined,
    isLoading,
    error,
  };
}
