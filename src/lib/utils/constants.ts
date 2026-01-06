/**
 * DOOR Protocol - Constants
 */

export const SENIOR_TARGET_APY = 5.5;
export const JUNIOR_APY_RANGE = [15, 30] as const;
export const MIN_JUNIOR_RATIO = 10;
export const TARGET_SENIOR_RATIO = 75;
export const TARGET_JUNIOR_RATIO = 25;

export const EPOCH_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

export const PROTOCOL_FEE = 1; // 1%
export const SENIOR_FEE_WAIVER_THRESHOLD = 6; // Waive fee if vault APY < 6%

export const DOR_SOURCES = [
  {
    name: 'TESR',
    description: 'Treehouse Ethereum Staking Rate',
    weight: 20,
  },
  {
    name: 'mETH',
    description: 'Mantle LST Staking',
    weight: 30,
  },
  {
    name: 'SOFR',
    description: 'Secured Overnight Financing Rate',
    weight: 25,
  },
  {
    name: 'Aave USDT',
    description: 'Aave USDT Supply Rate',
    weight: 15,
  },
  {
    name: 'Ondo USDY',
    description: 'Ondo RWA Token Yield',
    weight: 10,
  },
] as const;
