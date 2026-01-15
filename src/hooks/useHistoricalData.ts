import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { ADDRESSES, CoreVaultABI } from '@/lib/contracts/addresses';
import {
  estimateJuniorAPY,
  calculateVaultAPY,
} from '@/lib/utils/apyCalculations';
import { ESTIMATED_VAULT_YIELD_BPS } from '@/lib/config';

export interface RateHistoryPoint {
  date: string;
  seniorAPY: number;
  juniorAPY: number;
  vaultAPY: number;
  epochId?: number;
}

/**
 * Hook to fetch historical APY data from contract events
 * Falls back to current values if insufficient historical data
 */
export function useHistoricalRates(days: number = 30) {
  const publicClient = usePublicClient();
  const [history, setHistory] = useState<RateHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!publicClient) {
      setIsLoading(false);
      return;
    }

    const fetchHistoricalData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Calculate block range (approximately)
        // Mantle: ~2 second block time
        const currentBlock = await publicClient.getBlockNumber();
        const blocksPerDay = (24 * 60 * 60) / 2; // ~43,200 blocks per day
        const fromBlock =
          currentBlock - BigInt(Math.floor(blocksPerDay * days));

        // Fetch YieldDistributed events
        const yieldEvents = await publicClient.getLogs({
          address: ADDRESSES.coreVault,
          event: {
            type: 'event',
            name: 'YieldDistributed',
            inputs: [
              { name: 'epochId', type: 'uint256', indexed: true },
              { name: 'totalYield', type: 'uint256', indexed: false },
              { name: 'seniorYield', type: 'uint256', indexed: false },
              { name: 'juniorYield', type: 'uint256', indexed: false },
              { name: 'juniorSlash', type: 'uint256', indexed: false },
              { name: 'protocolFee', type: 'uint256', indexed: false },
            ],
          },
          fromBlock,
          toBlock: currentBlock,
        });

        // Fetch SeniorRateUpdated events for rate history
        const rateEvents = await publicClient.getLogs({
          address: ADDRESSES.coreVault,
          event: {
            type: 'event',
            name: 'SeniorRateUpdated',
            inputs: [
              { name: 'newRate', type: 'uint256', indexed: false },
              { name: 'epochId', type: 'uint256', indexed: false },
            ],
          },
          fromBlock,
          toBlock: currentBlock,
        });

        // Get current vault stats for calculations
        const stats = await publicClient.readContract({
          address: ADDRESSES.coreVault,
          abi: CoreVaultABI,
          functionName: 'getStats',
        });

        const vaultStats = stats as {
          seniorPrincipal: bigint;
          juniorPrincipal: bigint;
          totalAssets: bigint;
          currentSeniorRate: bigint;
          juniorRatio: bigint;
          isHealthy: boolean;
        };

        // Process events and create history points
        const dataPoints = new Map<string, RateHistoryPoint>();

        // Process rate events
        for (const log of rateEvents) {
          const block = await publicClient.getBlock({
            blockNumber: log.blockNumber,
          });
          const date = new Date(Number(block.timestamp) * 1000)
            .toISOString()
            .split('T')[0];

          const args = log.args as { newRate: bigint; epochId: bigint };
          const seniorAPY = Number(args.newRate) / 100;

          // Estimate junior APY
          const juniorAPYEstimate = estimateJuniorAPY(
            vaultStats.seniorPrincipal,
            vaultStats.juniorPrincipal,
            args.newRate,
            ESTIMATED_VAULT_YIELD_BPS,
          );
          const juniorAPY =
            juniorAPYEstimate !== null ? juniorAPYEstimate / 100 : 0;

          const vaultAPY =
            calculateVaultAPY(
              vaultStats.seniorPrincipal,
              vaultStats.juniorPrincipal,
              Number(args.newRate),
              juniorAPYEstimate || 0,
            ) / 100;

          dataPoints.set(date, {
            date,
            seniorAPY,
            juniorAPY,
            vaultAPY,
            epochId: Number(args.epochId),
          });
        }

        // Convert to array and sort by date
        const historyArray = Array.from(dataPoints.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        // If we have insufficient data, fill with current values
        if (historyArray.length < days) {
          const currentSeniorAPY = Number(vaultStats.currentSeniorRate) / 100;
          const currentJuniorAPYEstimate = estimateJuniorAPY(
            vaultStats.seniorPrincipal,
            vaultStats.juniorPrincipal,
            vaultStats.currentSeniorRate,
            ESTIMATED_VAULT_YIELD_BPS,
          );
          const currentJuniorAPY =
            currentJuniorAPYEstimate !== null
              ? currentJuniorAPYEstimate / 100
              : 0;
          const currentVaultAPY =
            calculateVaultAPY(
              vaultStats.seniorPrincipal,
              vaultStats.juniorPrincipal,
              Number(vaultStats.currentSeniorRate),
              currentJuniorAPYEstimate || 0,
            ) / 100;

          // Fill missing days with current values
          const today = new Date();
          const filledHistory: RateHistoryPoint[] = [];

          for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Use existing data point if available, otherwise use current values
            const existingPoint = historyArray.find((p) => p.date === dateStr);
            filledHistory.push(
              existingPoint || {
                date: dateStr,
                seniorAPY: currentSeniorAPY,
                juniorAPY: currentJuniorAPY,
                vaultAPY: currentVaultAPY,
              },
            );
          }

          setHistory(filledHistory);
        } else {
          setHistory(historyArray.slice(-days));
        }
      } catch (err) {
        console.error('Error fetching historical data:', err);
        setError(err as Error);

        // Fallback to empty array on error
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [publicClient, days]);

  return { history, isLoading, error };
}
