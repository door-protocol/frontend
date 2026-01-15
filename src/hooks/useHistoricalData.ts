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
        const totalBlocks = Math.floor(blocksPerDay * days);
        const fromBlock = currentBlock - BigInt(totalBlocks);

        console.log('=== Fetching Historical Data ===');
        console.log('Current Block:', currentBlock);
        console.log('From Block:', fromBlock);
        console.log('Total Blocks:', totalBlocks);

        // RPC limit: 10,000 blocks per request
        const MAX_BLOCK_RANGE = 10000;
        const chunks: Array<{ from: bigint; to: bigint }> = [];

        // Split into chunks
        let currentFrom = fromBlock;
        while (currentFrom < currentBlock) {
          const currentTo =
            currentFrom + BigInt(MAX_BLOCK_RANGE) > currentBlock
              ? currentBlock
              : currentFrom + BigInt(MAX_BLOCK_RANGE);
          chunks.push({ from: currentFrom, to: currentTo });
          currentFrom = currentTo + BigInt(1);
        }

        console.log(`Fetching in ${chunks.length} chunks to avoid RPC limit`);

        // Limit to maximum 10 chunks (100k blocks) to avoid long loading times
        const limitedChunks = chunks.slice(0, Math.min(chunks.length, 10));
        console.log(
          `Limited to ${limitedChunks.length} chunks for faster loading`,
        );

        // Fetch YieldDistributed events in chunks (parallel batches of 3)
        const allYieldEvents = [];
        for (let i = 0; i < limitedChunks.length; i += 3) {
          const batch = limitedChunks.slice(i, i + 3);
          const batchResults = await Promise.allSettled(
            batch.map((chunk) =>
              publicClient.getLogs({
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
                fromBlock: chunk.from,
                toBlock: chunk.to,
              }),
            ),
          );

          for (const result of batchResults) {
            if (result.status === 'fulfilled') {
              allYieldEvents.push(...result.value);
            } else {
              console.warn(
                'Failed to fetch yield events batch:',
                result.reason,
              );
            }
          }
        }
        const yieldEvents = allYieldEvents;

        // Fetch SeniorRateUpdated events in chunks (parallel batches of 3)
        const allRateEvents = [];
        for (let i = 0; i < limitedChunks.length; i += 3) {
          const batch = limitedChunks.slice(i, i + 3);
          const batchResults = await Promise.allSettled(
            batch.map((chunk) =>
              publicClient.getLogs({
                address: ADDRESSES.coreVault,
                event: {
                  type: 'event',
                  name: 'SeniorRateUpdated',
                  inputs: [
                    { name: 'newRate', type: 'uint256', indexed: false },
                    { name: 'epochId', type: 'uint256', indexed: false },
                  ],
                },
                fromBlock: chunk.from,
                toBlock: chunk.to,
              }),
            ),
          );

          for (const result of batchResults) {
            if (result.status === 'fulfilled') {
              allRateEvents.push(...result.value);
            } else {
              console.warn('Failed to fetch rate events batch:', result.reason);
            }
          }
        }
        const rateEvents = allRateEvents;

        // Get current vault stats for calculations
        const stats = await publicClient.readContract({
          address: ADDRESSES.coreVault,
          abi: CoreVaultABI,
          functionName: 'getStats',
        });

        type VaultStats = {
          seniorPrincipal: bigint;
          juniorPrincipal: bigint;
          totalAssets: bigint;
          currentSeniorRate: bigint;
          juniorRatio: bigint;
          isHealthy: boolean;
        };

        // Handle both array and object formats
        let vaultStats: VaultStats;
        if (Array.isArray(stats)) {
          // Contract returns tuple as array
          vaultStats = {
            seniorPrincipal: stats[0] as bigint,
            juniorPrincipal: stats[1] as bigint,
            totalAssets: stats[2] as bigint,
            currentSeniorRate: stats[3] as bigint,
            juniorRatio: stats[4] as bigint,
            isHealthy: stats[5] as boolean,
          };
        } else {
          vaultStats = stats as unknown as VaultStats;
        }

        // Process events and create history points
        const dataPoints = new Map<string, RateHistoryPoint>();

        console.log(`Found ${rateEvents.length} rate update events`);

        // Limit events to process (max 50 to avoid too many block fetches)
        const limitedEvents = rateEvents.slice(-50);
        console.log(`Processing ${limitedEvents.length} events`);

        // Fetch blocks in batches
        const blockCache = new Map<bigint, { timestamp: bigint }>();

        // Process rate events
        for (let i = 0; i < limitedEvents.length; i++) {
          const log = limitedEvents[i];

          // Get block timestamp (from cache or fetch)
          let block = blockCache.get(log.blockNumber);
          if (!block) {
            try {
              block = await publicClient.getBlock({
                blockNumber: log.blockNumber,
              });
              blockCache.set(log.blockNumber, block);
            } catch (err) {
              console.warn(`Failed to fetch block ${log.blockNumber}:`, err);
              continue;
            }
          }

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

          // Log progress every 10 events
          if ((i + 1) % 10 === 0) {
            console.log(`Processed ${i + 1}/${limitedEvents.length} events`);
          }
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
