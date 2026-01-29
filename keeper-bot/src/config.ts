import { config } from 'dotenv';
import { Address } from 'viem';

config();

export const CONFIG = {
  // Keeper wallet private key
  keeperPrivateKey: process.env.KEEPER_PRIVATE_KEY as Address,

  // RPC URL
  rpcUrl: process.env.RPC_URL || 'https://rpc.sepolia.mantle.xyz',

  // Contract addresses
  epochManagerAddress: (process.env.EPOCH_MANAGER_ADDRESS ||
    '0xdc0f912aa970f2a89381985a8e0ea3128e754748') as Address,

  // Check interval (in seconds)
  checkInterval: parseInt(process.env.CHECK_INTERVAL || '300', 10),

  // Dry run mode
  dryRun: process.env.DRY_RUN === 'true',
} as const;

// Validation
if (!CONFIG.keeperPrivateKey && !CONFIG.dryRun) {
  throw new Error('KEEPER_PRIVATE_KEY is required (or set DRY_RUN=true)');
}

if (!CONFIG.rpcUrl) {
  throw new Error('RPC_URL is required');
}
