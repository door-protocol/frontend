import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ADDRESSES } from '@/lib/contracts/addresses';
import { parseUnits } from 'viem';

// Mock USDC ABI with mint function
const MOCK_USDC_ABI = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

/**
 * Hook to mint Mock USDC tokens
 * Only works with mock deployment
 */
export function useMintMockUSDC() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = (to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: ADDRESSES.usdc,
      abi: MOCK_USDC_ABI,
      functionName: 'mint',
      args: [to, amount],
    });
  };

  const mintAmount = (to: `0x${string}`, amountInUSDC: number) => {
    const amountBigInt = parseUnits(amountInUSDC.toString(), 6);
    mint(to, amountBigInt);
  };

  return {
    mint,
    mintAmount,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
