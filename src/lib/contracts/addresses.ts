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
  mockYieldStrategy:
    '0x0C3701a4d3F95af12Ed830caD9082aF896D92De9' as `0x${string}`,

  // Real Tokens
  usdc: '0x9a54bad93a00bf1232d4e636f5e53055dc0b8238' as `0x${string}`,
  meth: '0x4Ade8aAa0143526393EcadA836224EF21aBC6ac6' as `0x${string}`,
} as const;

// -----------------------------------------------------------------------------
// Deployment 2: Mock Tokens (Mantle Sepolia Testnet)
// Deployed: 2026-01-15
// Network: mantleTestnet (Chain ID: 5003)
// Status: JuniorVault ✅ initialized, CoreVault needs manual init
// -----------------------------------------------------------------------------

export const MOCK_ADDRESSES = {
  // Core Contracts
  coreVault: '0x8d3ed9a02d3f1e05f68a306037edaf9a54a16105' as `0x${string}`,
  seniorVault: '0x03f4903c3fcf0cb23bee2c11531afb8a1307ce91' as `0x${string}`,
  juniorVault: '0x694c667c3b7ba5620c68fe1cc3b308eed26afc6e' as `0x${string}`,
  epochManager: '0xdc0f912aa970f2a89381985a8e0ea3128e754748' as `0x${string}`,
  safetyModule: '0xab5fd152973f5430991df6c5b74a5559ffa0d189' as `0x${string}`,
  rateOracle: '0xe76e27759b2416ec7c9ddf8ed7a58e61030876a4' as `0x${string}`,
  vaultStrategy: '0xdd84c599f3b9a12d7f8e583539f11a3e1d9224df' as `0x${string}`,
  mockYieldStrategy:
    '0x403e548ec79ade195db7e7abaa0eb203bbaa1db0' as `0x${string}`,

  // Mock Tokens
  usdc: '0xa9fd59bf5009da2d002a474309ca38a8d8686f6a' as `0x${string}`,
  meth: '0xac8fc1d5593ada635c5569e35534bfab1ab2fedc' as `0x${string}`,
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
