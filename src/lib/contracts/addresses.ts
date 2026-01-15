/**
 * DOOR Protocol - Contract Addresses
 */

import { CoreVaultABI } from './CoreVaultABI';
import { SeniorVaultABI } from './SeniorVaultABI';
import { JuniorVaultABI } from './JuniorVaultABI';

// Export ABIs
export { CoreVaultABI, SeniorVaultABI, JuniorVaultABI };

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
// Deployment 2: Mock Tokens (For Testing)
// Deployed: 2026-01-15
// -----------------------------------------------------------------------------

export const MOCK_ADDRESSES = {
  // Core Contracts
  coreVault: '0xed70c309127aff79289e62976980efdbcbbb0899' as `0x${string}`,
  seniorVault: '0x0e8fc3535af2df5c5a73aeff2ddc6b6d34410af8' as `0x${string}`,
  juniorVault: '0xee3aaf06b1633837ad31d98d124cc7cc107dcb08' as `0x${string}`,
  epochManager: '0x14f6933af60d3f9ca661630b7c3ed923821389b6' as `0x${string}`,
  safetyModule: '0x8db86eb5f494ccddf94bbc4967288fb85947a68c' as `0x${string}`,
  rateOracle: '0xd1812392885db8b9633e96f79302afd6ac1c944a' as `0x${string}`,
  vaultStrategy: '0xdb367615af9a3a3ab894065d08c0a35a6171af22' as `0x${string}`,
  mockYieldStrategy:
    '0x3627513d086cd14f1e4e69d391abcc5eb5489e23' as `0x${string}`,

  // Mock Tokens
  usdc: '0xbb5419001ef40a75b5edc7b10449bfe52d605762' as `0x${string}`,
  meth: '0x9a44ca8180732d7d30f1d01514bc69450c33eae2' as `0x${string}`,
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
