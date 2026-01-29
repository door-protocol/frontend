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
    '0x7cbdd2d816C4d733b36ED131695Ac9cb17684DC3') as Address,
  coreVaultAddress: (process.env.CORE_VAULT_ADDRESS ||
    '0x6D418348BFfB4196D477DBe2b1082485F5aE5164') as Address,
  safetyModuleAddress: (process.env.SAFETY_MODULE_ADDRESS ||
    '0xE2fa3596C8969bbd28b3dda515BABb268343df4B') as Address,

  // Check interval (in seconds)
  checkInterval: parseInt(process.env.CHECK_INTERVAL || '300', 10),

  // Dry run mode (default true for safety)
  dryRun: process.env.DRY_RUN !== 'false',
} as const;

// Validation
if (!CONFIG.keeperPrivateKey && !CONFIG.dryRun) {
  throw new Error('KEEPER_PRIVATE_KEY is required (or set DRY_RUN=true)');
}

if (!CONFIG.rpcUrl) {
  throw new Error('RPC_URL is required');
}
