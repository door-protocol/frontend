# DOOR Protocol Keeper Bot

Automated keeper bot for managing DOOR Protocol epochs on Mantle Sepolia testnet.

## Overview

This bot automatically monitors and processes epochs for the DOOR Protocol. It runs every 5 minutes via GitHub Actions and executes `processEpoch()` when an epoch has ended.

### Key Features

- ✅ Fully automated epoch processing every 5 minutes
- ✅ Dry run mode for safe testing
- ✅ Transaction simulation before execution
- ✅ Detailed logging with timestamps
- ✅ Error handling and automatic retries
- ✅ Zero infrastructure cost (runs on GitHub Actions)
- ✅ Secure private key management via GitHub Secrets

## Quick Start (5 Minutes)

### Step 1: Grant KEEPER_ROLE

The keeper wallet must have `KEEPER_ROLE` on the EpochManager contract.

Contract admin needs to execute:

```solidity
// On Mantle Sepolia
epochManager.grantRole(KEEPER_ROLE, keeperAddress);
```

Where `KEEPER_ROLE = keccak256("KEEPER_ROLE")`

### Step 2: Configure GitHub Secrets

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value | Required |
|-------------|-------|----------|
| `KEEPER_PRIVATE_KEY` | `0xYOUR_PRIVATE_KEY_HERE` | ✅ Yes |
| `RPC_URL` | `https://rpc.sepolia.mantle.xyz` | ⚪ Optional (default provided) |
| `EPOCH_MANAGER_ADDRESS` | `0xdc0f912aa970f2a89381985a8e0ea3128e754748` | ⚪ Optional (default provided) |
| `DRY_RUN` | Leave empty or set to `false` | ⚪ Optional (default: false) |

### Step 3: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Actions permissions", select **Allow all actions and reusable workflows**
3. Click **Save**

### Step 4: Test Manually

1. Go to **Actions** tab in your repository
2. Select **DOOR Protocol Keeper Bot** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for the job to complete (~1 minute)
5. Click on the run to view detailed logs

### Step 5: Done! 🎉

The bot will now run automatically every 5 minutes:
- Checks current epoch status
- Processes epoch if it has ended
- Logs all actions to GitHub Actions

## How It Works

### Workflow

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions (Every 5 minutes)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 1. Fetch current epoch data                       │  │
│  │ 2. Check if epoch.endTime < block.timestamp       │  │
│  │ 3. If YES:                                         │  │
│  │    - Simulate processEpoch() transaction          │  │
│  │    - Execute processEpoch()                        │  │
│  │    - Wait for confirmation                         │  │
│  │    - Log success                                   │  │
│  │ 4. If NO:                                          │  │
│  │    - Log "Epoch still active"                      │  │
│  │    - Wait for next check (5 minutes)               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Epoch Lifecycle

1. **OPEN** (0): Deposits accepted, epoch is active
2. **LOCKED** (1): Epoch locked, no new deposits
3. **SETTLED** (2): Epoch settled, yields distributed
4. **New Epoch**: Bot calls `processEpoch()` → starts new epoch

### What `processEpoch()` Does

When the bot calls this function:
1. Harvests yield from CoreVault
2. Processes pending withdrawal requests
3. Distributes accumulated penalties
4. Marks current epoch as SETTLED
5. Automatically starts a new epoch

## Local Development

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

```bash
cd keeper-bot
yarn install
```

### Configuration

The `.env` file is already configured with production values:

```env
KEEPER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
RPC_URL=https://rpc.sepolia.mantle.xyz
EPOCH_MANAGER_ADDRESS=0xdc0f912aa970f2a89381985a8e0ea3128e754748
DRY_RUN=false
```

### Running Locally

```bash
# Check epoch status and process if needed
yarn start

# Watch mode (auto-reload on file changes)
yarn dev

# Build TypeScript
yarn build
```

### Dry Run Mode

To test without sending real transactions:

```bash
DRY_RUN=true yarn start
```

This will:
- ✅ Check epoch status
- ✅ Simulate transaction
- ❌ NOT send actual transaction

## Monitoring

### View Execution Logs

1. Go to **Actions** tab in GitHub
2. Click on **DOOR Protocol Keeper Bot**
3. Select a workflow run
4. Expand the **Run Keeper Bot** step

### Example Output

**When epoch is still active:**

```
=== DOOR Protocol Keeper Bot ===
Timestamp: 2026-01-29T10:30:00.000Z
Mode: LIVE

Current Epoch ID: 1

--- Epoch Information ---
State: OPEN (0)
End Time: 2026-02-05T10:30:00.000Z
Time Until End: 6d 23h 45m
Settled: false
Total Deposits: 10000.00 USDC
Total Withdraw Requests: 500.00 USDC

✅ Epoch is still active. No action needed.
⏰ Next check recommended in: 6d 23h 46m

=== Keeper Bot Finished ===
```

**When epoch needs processing:**

```
=== DOOR Protocol Keeper Bot ===
Timestamp: 2026-02-05T10:31:00.000Z
Mode: LIVE

Current Epoch ID: 1

--- Epoch Information ---
State: LOCKED (1)
End Time: 2026-02-05T10:30:00.000Z
Time Until End: Ended
Settled: false
Total Deposits: 10000.00 USDC
Total Withdraw Requests: 500.00 USDC

🚀 Epoch has ended! Processing epoch...
Simulating transaction...
✅ Simulation successful, sending transaction...

📝 Transaction Hash: 0xabc123def456...
🔗 Explorer: https://sepolia.mantlescan.xyz/tx/0xabc123def456...
⏳ Waiting for confirmation...
✅ Epoch processed successfully!
   Gas Used: 245832
   Block: 1234567

=== Keeper Bot Finished ===
```

### Check On-Chain

**Dashboard:**
https://door-protocol-frontend.vercel.app/dashboard

**EpochManager Contract:**
https://sepolia.mantlescan.xyz/address/0xdc0f912aa970f2a89381985a8e0ea3128e754748

## Costs

| Item | Cost |
|------|------|
| GitHub Actions | **Free** (2000 minutes/month on free tier) |
| Gas per epoch | ~0.0025 MNT (~$0.01) |
| Monthly cost | ~$0.40/month (40 epochs) |

**Total: Nearly free!** 🎉

## Security

### Private Key Protection

- ✅ Stored in GitHub Secrets (AES-256 encrypted)
- ✅ Never logged or exposed in workflow outputs
- ✅ Only accessible during workflow execution
- ✅ Automatically rotated if compromised (just update secret)

### Transaction Safety

- ✅ Simulation before execution (prevents failed transactions)
- ✅ Gas estimation and validation
- ✅ Automatic retry on network errors
- ✅ Transaction confirmation waiting

### Access Control

- ✅ Only wallets with KEEPER_ROLE can process epochs
- ✅ Contract enforces epoch timing (can't process early)
- ✅ ReentrancyGuard protection

## Troubleshooting

### ❌ Error: "AccessControlUnauthorizedAccount"

**Problem:** Keeper wallet doesn't have KEEPER_ROLE

**Solution:** Contact admin to grant role:
```solidity
epochManager.grantRole(KEEPER_ROLE, keeperAddress);
```

### ❌ Error: "EpochNotEnded"

**Problem:** Trying to process epoch before endTime

**Solution:** This is normal! The bot will check again in 5 minutes.

### ❌ Workflow not running

**Problem:** GitHub Actions might be disabled

**Solution:**
1. Go to **Settings** → **Actions** → **General**
2. Enable "Allow all actions and reusable workflows"
3. Check that the workflow file exists at `.github/workflows/keeper-bot.yml`

### ⚠️ High gas costs

**Problem:** Gas price too high on Mantle

**Solution:**
- Mantle Sepolia is testnet (gas is negligible)
- For mainnet, consider adding gas price checks

## Advanced Configuration

### Change Check Interval

Edit `.github/workflows/keeper-bot.yml`:

```yaml
on:
  schedule:
    # Every 5 minutes (default)
    - cron: '*/5 * * * *'

    # Every 10 minutes
    - cron: '*/10 * * * *'

    # Every hour
    - cron: '0 * * * *'
```

### Add Notifications

Add Slack/Discord notifications on success/failure:

```yaml
- name: Notify on success
  if: success()
  run: |
    curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"Epoch processed successfully!"}' \
    ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Multiple Keepers

For redundancy, run multiple keeper bots:
- Use different GitHub repos/accounts
- Different keeper wallets (all with KEEPER_ROLE)
- Only one will succeed (others will get "EpochNotEnded")

## Project Structure

```
keeper-bot/
├── src/
│   ├── index.ts      # Main bot logic
│   ├── config.ts     # Configuration loader
│   └── abi.ts        # EpochManager ABI
├── .env              # Environment variables (production)
├── .env.example      # Environment template
├── .gitignore        # Git ignore rules
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
└── README.md         # This file
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly with dry run mode
4. Submit a pull request

## License

MIT License - see [LICENSE](../LICENSE) file for details.

## Support

- **Issues:** https://github.com/door-protocol/contract/issues
- **Docs:** https://github.com/door-protocol/contract
- **Twitter:** [@door_protocol](https://x.com/door_protocol)

---

Built with ❤️ by the DOOR Protocol Team
