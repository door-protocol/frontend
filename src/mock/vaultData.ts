/**
 * Mock Vault Data for DOOR Protocol
 * Used until backend/smart contract integration is complete
 */

export interface VaultStats {
  tvl: string;
  seniorTVL: string;
  juniorTVL: string;
  seniorAPY: number;
  juniorAPY: number;
  juniorRatio: number;
  epochId: number;
  epochState: 'OPEN' | 'LOCKED' | 'SETTLED';
}

export interface EpochData {
  epochId: number;
  state: 'OPEN' | 'LOCKED' | 'SETTLED';
  startTime: number;
  endTime: number;
  totalDeposited: string;
  seniorDeposited: string;
  juniorDeposited: string;
}

export interface UserPosition {
  address: string;
  senior: {
    balance: string;
    shares: string;
    claimableYield: string;
    depositEpoch: number;
    currentValue: string;
  };
  junior: {
    balance: string;
    shares: string;
    claimableYield: string;
    depositEpoch: number;
    currentValue: string;
  };
  totalValue: string;
}

export interface RateHistoryPoint {
  date: string;
  seniorAPY: number;
  juniorAPY: number;
  vaultAPY: number;
}

// Mock Vault Statistics
export const mockVaultStats: VaultStats = {
  tvl: '1250000.00',
  seniorTVL: '937500.00',
  juniorTVL: '312500.00',
  seniorAPY: 5.5,
  juniorAPY: 18.2,
  juniorRatio: 25.0,
  epochId: 12,
  epochState: 'OPEN',
};

// Mock Current Epoch
export const mockCurrentEpoch: EpochData = {
  epochId: 12,
  state: 'OPEN',
  startTime: Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, // 2 days ago
  endTime: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60, // 5 days from now
  totalDeposited: '50000.00',
  seniorDeposited: '37500.00',
  juniorDeposited: '12500.00',
};

// Mock User Position
export const mockUserPosition: UserPosition = {
  address: '0x1234567890123456789012345678901234567890',
  senior: {
    balance: '10000.00',
    shares: '10000.00',
    claimableYield: '45.00',
    depositEpoch: 10,
    currentValue: '10045.00',
  },
  junior: {
    balance: '15000.00',
    shares: '15000.00',
    claimableYield: '297.15',
    depositEpoch: 10,
    currentValue: '15297.15',
  },
  totalValue: '25342.15',
};

// Generate mock rate history
export function generateMockRateHistory(days: number): RateHistoryPoint[] {
  const data: RateHistoryPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate slight variations
    const seniorAPY = 5.5 + (Math.random() - 0.5) * 0.5;
    const vaultAPY = 7.0 + (Math.random() - 0.5) * 1.0;
    const juniorAPY = 18.0 + (Math.random() - 0.5) * 3.0;

    data.push({
      date: date.toISOString().split('T')[0],
      seniorAPY: parseFloat(seniorAPY.toFixed(2)),
      juniorAPY: parseFloat(juniorAPY.toFixed(2)),
      vaultAPY: parseFloat(vaultAPY.toFixed(2)),
    });
  }

  return data;
}

// Mock DOR Rate Data
export const mockDORData = {
  currentRate: 4.62,
  lastUpdate: Date.now(),
  sources: [
    { name: 'TESR', rate: 3.5, weight: 20 },
    { name: 'mETH', rate: 4.5, weight: 30 },
    { name: 'SOFR', rate: 4.6, weight: 25 },
    { name: 'Aave USDT', rate: 6.0, weight: 15 },
    { name: 'Ondo USDY', rate: 5.0, weight: 10 },
  ],
};
