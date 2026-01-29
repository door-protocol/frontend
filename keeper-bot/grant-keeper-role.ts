import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantleSepoliaTestnet } from 'viem/chains';
import { CONFIG } from './src/config';

const KEEPER_ROLE = '0x8972ffc6b90eca55e4e01e88a38e090782f47c5f07710cb6a076e12c89d44ce1' as const;

async function grantKeeperRole() {
  console.log('\n=== Grant KEEPER_ROLE ===\n');

  const account = privateKeyToAccount(CONFIG.keeperPrivateKey);
  console.log('Admin Address:', account.address);

  const publicClient = createPublicClient({
    chain: mantleSepoliaTestnet,
    transport: http(CONFIG.rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: mantleSepoliaTestnet,
    transport: http(CONFIG.rpcUrl),
  });

  // Check current role status
  const hasKeeperRole = await publicClient.readContract({
    address: CONFIG.epochManagerAddress,
    abi: [
      {
        type: 'function',
        name: 'hasRole',
        inputs: [
          { name: 'role', type: 'bytes32' },
          { name: 'account', type: 'address' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'hasRole',
    args: [KEEPER_ROLE, account.address],
  });

  console.log('Current KEEPER_ROLE status:', hasKeeperRole);

  if (hasKeeperRole) {
    console.log('✅ Already has KEEPER_ROLE, no action needed.');
    return;
  }

  console.log('\n🔄 Granting KEEPER_ROLE...\n');

  // Grant KEEPER_ROLE
  const { request } = await publicClient.simulateContract({
    address: CONFIG.epochManagerAddress,
    abi: [
      {
        type: 'function',
        name: 'grantRole',
        inputs: [
          { name: 'role', type: 'bytes32' },
          { name: 'account', type: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
    ],
    functionName: 'grantRole',
    args: [KEEPER_ROLE, account.address],
    account,
  });

  const hash = await walletClient.writeContract(request);
  console.log('📝 Transaction Hash:', hash);
  console.log('🔗 Explorer:', `https://sepolia.mantlescan.xyz/tx/${hash}`);

  console.log('\n⏳ Waiting for confirmation...\n');
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log('✅ KEEPER_ROLE granted successfully!');
  console.log('   Block:', receipt.blockNumber);
  console.log('   Gas Used:', receipt.gasUsed.toString());

  // Verify
  const verified = await publicClient.readContract({
    address: CONFIG.epochManagerAddress,
    abi: [
      {
        type: 'function',
        name: 'hasRole',
        inputs: [
          { name: 'role', type: 'bytes32' },
          { name: 'account', type: 'address' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'hasRole',
    args: [KEEPER_ROLE, account.address],
  });

  console.log('\n✅ Verified: Has KEEPER_ROLE =', verified);
  console.log('\n=== Done ===\n');
}

grantKeeperRole().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
