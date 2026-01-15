/**
 * DOOR Protocol - DOR with Fallback Hook
 *
 * Implements a fallback chain for fetching DOR rates:
 * 1. Primary: Contract (on-chain oracle)
 * 2. Secondary: Backend API
 * 3. Tertiary: Hardcoded fallback values
 */

import { useMemo } from 'react';
import { useDOR, useAllRateSources, useSeniorTargetAPY } from './useRateOracle';
import { useLatestRates } from './useBackendAPI';

// Hardcoded fallback values
const FALLBACK_DOR = {
  currentRate: 4.6,
  seniorTarget: 5.6,
  sources: [
    { name: 'TESR', rate: 3.5, isLive: false },
    { name: 'mETH', rate: 4.5, isLive: false },
    { name: 'SOFR', rate: 4.6, isLive: false },
    { name: 'Aave USDT', rate: 5.5, isLive: false },
    { name: 'Ondo USDY', rate: 5.0, isLive: false },
  ],
  liveCount: 0,
  fallbackCount: 5,
  source: 'hardcoded' as const,
};

export interface DORData {
  currentRate: number;
  seniorTarget: number;
  sources: Array<{
    name: string;
    rate: number;
    isLive: boolean;
  }>;
  liveCount: number;
  fallbackCount: number;
  source: 'contract' | 'backend' | 'hardcoded' | 'loading';
}

/**
 * Hook that fetches DOR data with automatic fallback
 * Priority: Contract -> Backend API -> Hardcoded
 */
export function useDORWithFallback(): {
  dor: DORData;
  isLoading: boolean;
} {
  // Try to fetch from contract first
  const { dor: contractDOR, isLoading: dorLoading, error: dorError } = useDOR();
  const {
    rateSources: contractSources,
    isLoading: sourcesLoading,
    error: sourcesError,
  } = useAllRateSources();
  const {
    seniorTargetAPY: contractTarget,
    isLoading: targetLoading,
    error: targetError,
  } = useSeniorTargetAPY();

  // Fetch from backend API as fallback
  const { data: backendData, isLoading: backendLoading } = useLatestRates();

  const result = useMemo(() => {
    // Check if we're still loading contract data
    const contractIsLoading = dorLoading || sourcesLoading || targetLoading;

    // Check if contract data is available and valid
    const hasContractData =
      !dorError &&
      !sourcesError &&
      !targetError &&
      contractDOR !== undefined &&
      contractSources !== undefined &&
      contractTarget !== undefined;

    console.log('=== useDORWithFallback Debug ===');
    console.log('Contract Loading:', contractIsLoading);
    console.log('Contract DOR:', contractDOR);
    console.log('Contract Sources:', contractSources);
    console.log('Contract Target:', contractTarget);
    console.log('DOR Error:', dorError);
    console.log('Sources Error:', sourcesError);
    console.log('Target Error:', targetError);
    console.log('Has Contract Data:', hasContractData);
    console.log('Backend Data:', backendData);
    console.log('Backend Loading:', backendLoading);

    if (hasContractData && contractDOR && contractSources) {
      // Use contract data (priority 1)
      console.log('✅ Using CONTRACT data');
      const dorRate = Number(contractDOR) / 100;
      const seniorTarget = contractTarget
        ? Number(contractTarget) / 100
        : dorRate + 1;

      return {
        dor: {
          currentRate: dorRate,
          seniorTarget,
          sources: contractSources
            .filter((s) => s.isActive)
            .map((s) => ({
              name: s.name,
              rate: Number(s.rate) / 100,
              isLive: true,
            })),
          liveCount: contractSources.filter((s) => s.isActive).length,
          fallbackCount: 0,
          source: 'contract' as const,
        },
        isLoading: false,
      };
    }

    // If contract failed and backend data is available, use backend (priority 2)
    if (!contractIsLoading && backendData) {
      console.log('⚠️ Using BACKEND API data (contract failed)');
      return {
        dor: {
          currentRate: backendData.dor,
          seniorTarget: backendData.seniorTarget,
          sources: backendData.sources.map((s) => ({
            name: s.name,
            rate: s.rate,
            isLive: s.isLive,
          })),
          liveCount: backendData.liveCount,
          fallbackCount: backendData.fallbackCount,
          source: 'backend' as const,
        },
        isLoading: false,
      };
    }

    // If both contract and backend failed, use hardcoded fallback (priority 3)
    if (!contractIsLoading && !backendLoading) {
      console.log(
        '🔴 Using HARDCODED fallback data (contract & backend failed)',
      );
      return {
        dor: FALLBACK_DOR,
        isLoading: false,
      };
    }

    // Still loading
    console.log('⏳ Still loading...');
    return {
      dor: {
        currentRate: 0,
        seniorTarget: 0,
        sources: [],
        liveCount: 0,
        fallbackCount: 0,
        source: 'loading' as const,
      },
      isLoading: true,
    };
  }, [
    contractDOR,
    contractSources,
    contractTarget,
    dorLoading,
    sourcesLoading,
    targetLoading,
    dorError,
    sourcesError,
    targetError,
    backendData,
    backendLoading,
  ]);

  return result;
}
