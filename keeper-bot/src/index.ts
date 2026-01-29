import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  formatUnits,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantleSepoliaTestnet } from 'viem/chains';
import { CONFIG } from './config';
import { EPOCH_MANAGER_ABI, EpochState } from './abi';

// Create clients
const publicClient = createPublicClient({
  chain: mantleSepoliaTestnet,
  transport: http(CONFIG.rpcUrl),
});

const account = CONFIG.dryRun
  ? undefined
  : privateKeyToAccount(CONFIG.keeperPrivateKey);

const walletClient = CONFIG.dryRun
  ? undefined
  : createWalletClient({
      account: account!,
      chain: mantleSepoliaTestnet,
      transport: http(CONFIG.rpcUrl),
    });

interface EpochData {
  id: bigint;
  startTime: bigint;
  endTime: bigint;
  state: number;
  totalDeposits: bigint;
  totalWithdrawRequests: bigint;
  settled: boolean;
}

async function checkAndProcessEpoch() {
  console.log('\n=== DOOR Protocol Keeper Bot ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Mode: ${CONFIG.dryRun ? 'DRY RUN' : 'LIVE'}`);

  try {
    // 1. Get current epoch ID
    const currentEpochId = (await publicClient.readContract({
      address: CONFIG.epochManagerAddress,
      abi: EPOCH_MANAGER_ABI,
      functionName: 'currentEpochId',
    })) as bigint;

    console.log(`\nCurrent Epoch ID: ${currentEpochId}`);

    // 2. Get epoch data
    const epochData = (await publicClient.readContract({
      address: CONFIG.epochManagerAddress,
      abi: EPOCH_MANAGER_ABI,
      functionName: 'getEpoch',
      args: [currentEpochId],
    })) as readonly [bigint, bigint, bigint, number, bigint, bigint, boolean];

    const epoch: EpochData = {
      id: epochData[0],
      startTime: epochData[1],
      endTime: epochData[2],
      state: epochData[3],
      totalDeposits: epochData[4],
      totalWithdrawRequests: epochData[5],
      settled: epochData[6],
    };

    // 3. Display epoch info
    const now = BigInt(Math.floor(Date.now() / 1000));
    const endTime = new Date(Number(epoch.endTime) * 1000);
    const timeUntilEnd = Number(epoch.endTime - now);

    console.log('\n--- Epoch Information ---');
    console.log(`State: ${EpochState[epoch.state]} (${epoch.state})`);
    console.log(`End Time: ${endTime.toISOString()}`);
    console.log(`Time Until End: ${formatTime(timeUntilEnd)}`);
    console.log(`Settled: ${epoch.settled}`);
    console.log(`Total Deposits: ${formatUnits(epoch.totalDeposits, 6)} USDC`);
    console.log(
      `Total Withdraw Requests: ${formatUnits(epoch.totalWithdrawRequests, 6)} USDC`,
    );

    // 4. Check if epoch needs processing
    if (now < epoch.endTime) {
      console.log('\n✅ Epoch is still active. No action needed.');
      console.log(
        `⏰ Next check recommended in: ${formatTime(timeUntilEnd + 60)}`,
      );
      return;
    }

    if (epoch.settled) {
      console.log('\n⚠️  Epoch has ended and is already settled.');
      console.log('This might indicate an issue with epoch progression.');
      return;
    }

    // 5. Process epoch
    console.log('\n🚀 Epoch has ended! Processing epoch...');

    if (CONFIG.dryRun) {
      console.log('\n[DRY RUN] Would call processEpoch() here');
      console.log('[DRY RUN] Set DRY_RUN=false to execute actual transaction');
      return;
    }

    if (!walletClient) {
      throw new Error('Wallet client not initialized');
    }

    // Simulate to check for errors
    console.log('Simulating transaction...');
    await publicClient.simulateContract({
      address: CONFIG.epochManagerAddress,
      abi: EPOCH_MANAGER_ABI,
      functionName: 'processEpoch',
      account: account,
    });

    console.log('✅ Simulation successful, sending transaction...');

    // Send transaction
    const hash = await walletClient.writeContract({
      address: CONFIG.epochManagerAddress,
      abi: EPOCH_MANAGER_ABI,
      functionName: 'processEpoch',
    });

    console.log(`\n📝 Transaction Hash: ${hash}`);
    console.log(`🔗 Explorer: https://sepolia.mantlescan.xyz/tx/${hash}`);

    // Wait for confirmation
    console.log('⏳ Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status === 'success') {
      console.log('✅ Epoch processed successfully!');
      console.log(`   Gas Used: ${receipt.gasUsed}`);
      console.log(`   Block: ${receipt.blockNumber}`);
    } else {
      console.log('❌ Transaction failed');
    }
  } catch (error: any) {
    if (error.message?.includes('EpochNotEnded')) {
      console.log('\n✅ Epoch not ended yet. No action needed.');
    } else {
      console.error('\n❌ Error:', error.message || error);
      throw error;
    }
  }
}

function formatTime(seconds: number): string {
  if (seconds < 0) return 'Ended';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

// Run
checkAndProcessEpoch()
  .then(() => {
    console.log('\n=== Keeper Bot Finished ===\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n=== Keeper Bot Failed ===');
    console.error(error);
    process.exit(1);
  });
