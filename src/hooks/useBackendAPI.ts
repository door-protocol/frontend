/**
 * DOOR Protocol - Backend API Hook
 *
 * Custom hook for fetching data from the backend API server.
 * Provides rate data, vault stats, and other aggregated information.
 */

import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============ Types ============

export interface RateSource {
  name: string;
  rate: number;
  source: string;
  isLive: boolean;
}

export interface LatestRates {
  dor: number;
  seniorTarget: number;
  timestamp: string;
  txHash: string | null;
  sources: RateSource[];
  liveCount: number;
  fallbackCount: number;
  source: 'database' | 'mock';
}

export interface RateHistoryItem {
  date: string;
  timestamp: string;
  dor: number;
  seniorAPY: number;
  juniorAPY: number;
  vaultAPY: number;
}

export interface RateHistory {
  period: string;
  data: RateHistoryItem[];
  source: 'database' | 'mock';
  count: number;
}

export interface ContractAddresses {
  usdc: string;
  seniorVault: string;
  juniorVault: string;
  coreVault: string;
  epochManager: string;
  safetyModule: string;
  network: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  network: string;
}

// ============ API Fetch Functions ============

async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_URL}/api/health`);
  if (!res.ok) throw new Error('Failed to fetch health status');
  return res.json();
}

async function fetchContracts(): Promise<ContractAddresses> {
  const res = await fetch(`${API_URL}/api/contracts`);
  if (!res.ok) throw new Error('Failed to fetch contracts');
  return res.json();
}

async function fetchLatestRates(): Promise<LatestRates> {
  const res = await fetch(`${API_URL}/api/vault/rates/latest`);
  if (!res.ok) throw new Error('Failed to fetch latest rates');
  return res.json();
}

async function fetchRateHistory(
  period: '7d' | '30d' | '90d' | '1y' = '30d',
): Promise<RateHistory> {
  const res = await fetch(
    `${API_URL}/api/vault/rates/history?period=${period}`,
  );
  if (!res.ok) throw new Error('Failed to fetch rate history');
  return res.json();
}

// ============ Hooks ============

/**
 * Hook to check backend health status
 */
export function useBackendHealth() {
  return useQuery({
    queryKey: ['backend', 'health'],
    queryFn: fetchHealth,
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // 1 minute
  });
}

/**
 * Hook to get contract addresses from backend
 */
export function useBackendContracts() {
  return useQuery({
    queryKey: ['backend', 'contracts'],
    queryFn: fetchContracts,
    staleTime: 5 * 60_000, // 5 minutes
  });
}

/**
 * Hook to get latest DOR rates
 */
export function useLatestRates() {
  return useQuery({
    queryKey: ['backend', 'rates', 'latest'],
    queryFn: fetchLatestRates,
    staleTime: 60_000, // 1 minute
    refetchInterval: 5 * 60_000, // 5 minutes
  });
}

/**
 * Hook to get rate history
 */
export function useRateHistory(period: '7d' | '30d' | '90d' | '1y' = '30d') {
  return useQuery({
    queryKey: ['backend', 'rates', 'history', period],
    queryFn: () => fetchRateHistory(period),
    staleTime: 5 * 60_000, // 5 minutes
  });
}

/**
 * Hook to get all backend data at once
 */
export function useBackendData() {
  const health = useBackendHealth();
  const contracts = useBackendContracts();
  const latestRates = useLatestRates();

  return {
    health: health.data,
    contracts: contracts.data,
    latestRates: latestRates.data,
    isLoading: health.isLoading || contracts.isLoading || latestRates.isLoading,
    isError: health.isError || contracts.isError || latestRates.isError,
    isBackendConnected: health.isSuccess && health.data?.status === 'ok',
  };
}
