/**
 * DOOR Protocol - Contract Addresses
 */

import { CoreVaultABI } from './CoreVaultABI';
import { SeniorVaultABI } from './SeniorVaultABI';
import { JuniorVaultABI } from './JuniorVaultABI';
import { EpochManagerABI } from './EpochManagerABI';
import { SafetyModuleABI } from './SafetyModuleABI';
import { RateOracleABI } from './RateOracleABI';

// Export ABIs
export {
  CoreVaultABI,
  SeniorVaultABI,
  JuniorVaultABI,
  EpochManagerABI,
  SafetyModuleABI,
  RateOracleABI,
};

/**
 * =============================================================================
 * DOOR Protocol - Contract Addresses (Mantle Sepolia Testnet)
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// Deployment 1: Production (Real Testnet Tokens) ⭐ DEFAULT
// Deployed: 2026-01-15
// -----------------------------------------------------------------------------

export const PRODUCTION_ADDRESSES = {
  // Core Contracts
  coreVault: '0x1601Aa4aE97b999cEd4bbaCF0D4B52f29554846F' as `0x${string}`,
  seniorVault: '0x34BC889a143870bBd8538EAe6421cA4c62e84bc3' as `0x${string}`,
  juniorVault: '0x8E1A6A3Ba7c5cb4d416Da7Fd376b2BC75227022e' as `0x${string}`,
  epochManager: '0x2956e44668E4026D499D46Ad7eCB1312EA8484aa' as `0x${string}`,
  safetyModule: '0xA08fF559C4Fc41FEf01D26744394dD2d2aa74E55' as `0x${string}`,
  rateOracle: '0x8888F236f9ec2B3aD0c07080ba5Ebc1241F70d71' as `0x${string}`,
  vaultStrategy: '0x92273a6629A87094E4A2525a7AcDE00eD3f025D3' as `0x${string}`,

  // Real Tokens
  usdc: '0x9a54bad93a00bf1232d4e636f5e53055dc0b8238' as `0x${string}`,
  meth: '0x4Ade8aAa0143526393EcadA836224EF21aBC6ac6' as `0x${string}`,
} as const;

// -----------------------------------------------------------------------------
// Deployment 2: Mock Tokens (Mantle Sepolia Testnet)
// Deployed: 2026-01-15
// Network: mantleTestnet (Chain ID: 5003)
// -----------------------------------------------------------------------------

export const MOCK_ADDRESSES = {
  // Core Contracts
  coreVault: '0x6D418348BFfB4196D477DBe2b1082485F5aE5164' as `0x${string}`,
  seniorVault: '0x766624E3E59a80Da9801e9b71994cb927eB7F260' as `0x${string}`,
  juniorVault: '0x8d1fBEa28CC47959bd94ece489cb1823BeB55075' as `0x${string}`,
  epochManager: '0x7cbdd2d816C4d733b36ED131695Ac9cb17684DC3' as `0x${string}`,
  safetyModule: '0xE2fa3596C8969bbd28b3dda515BABb268343df4B' as `0x${string}`,
  rateOracle: '0x738c765fB734b774EBbABc9eDb5f099c46542Ee4' as `0x${string}`,
  vaultStrategy: '0xf9579CE4D63174b1f0f5bCB9d42255BDd07a6374' as `0x${string}`,
  mockVaultStrategy:
    '0x6dc9D97D7d17B01Eb8D6669a6feF05cc3D3b70d6' as `0x${string}`,

  // Mock Tokens
  usdc: '0xbadbbDb50f5F0455Bf6E4Dd6d4B5ee664D07c109' as `0x${string}`,
  meth: '0x374962241A369F1696EF88C10beFe4f40C646592' as `0x${string}`,
} as const;

// -----------------------------------------------------------------------------
// Active Deployment Selection
// -----------------------------------------------------------------------------

/**
 * Select deployment based on environment variable
 * Set NEXT_PUBLIC_DEPLOYMENT='mock' to use mock deployment
 * Default: 'production'
 */
const deploymentType = process.env.NEXT_PUBLIC_DEPLOYMENT || 'production';

export const ADDRESSES =
  deploymentType === 'mock' ? MOCK_ADDRESSES : PRODUCTION_ADDRESSES;

// ERC20 Minimal ABI for token interactions
export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
] as const;
