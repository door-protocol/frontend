# DOOR Protocol - Deployment Addresses

> **Last Updated**: 2026-01-15
> **Network**: Mantle Sepolia Testnet
> **Status**: ✅ Active

## Mantle Sepolia Testnet

### Deployment 1: Production (Real Testnet Tokens) ⭐ DEFAULT

**Deployed on**: 2026-01-15

Uses real USDC and mETH tokens on Mantle Sepolia testnet for production-like testing.

> ✅ **Status**: All vaults initialized and ready for deposits!

#### Core Contracts

- **CoreVault**: `0x1601Aa4aE97b999cEd4bbaCF0D4B52f29554846F` ✅ Initialized
- **SeniorVault**: `0x34BC889a143870bBd8538EAe6421cA4c62e84bc3` ✅ Initialized
- **JuniorVault**: `0x8E1A6A3Ba7c5cb4d416Da7Fd376b2BC75227022e` ✅ Initialized
- **EpochManager**: `0x2956e44668E4026D499D46Ad7eCB1312EA8484aa`
- **SafetyModule**: `0xA08fF559C4Fc41FEf01D26744394dD2d2aa74E55`
- **DOORRateOracle**: `0x8888F236f9ec2B3aD0c07080ba5Ebc1241F70d71`
- **VaultStrategy**: `0x92273a6629A87094E4A2525a7AcDE00eD3f025D3`
- **MockYieldStrategy**: `0x0C3701a4d3F95af12Ed830caD9082aF896D92De9`

#### Real Testnet Tokens

- **USDC**: `0x9a54bad93a00bf1232d4e636f5e53055dc0b8238`
- **mETH**: `0x4Ade8aAa0143526393EcadA836224EF21aBC6ac6`

### Deployment 2: Mock Tokens (For Testing)

**Deployed on**: 2026-01-15

Uses mock USDC and mETH tokens for isolated testing.

> 💡 **Tip**: Mock USDC has a `mint()` function for free test tokens!
> ✅ **Status**: All vaults initialized and ready for testing!

#### Core Contracts

- **CoreVault**: `0x8d3ed9a02d3f1e05f68a306037edaf9a54a16105` ✅ Initialized
- **SeniorVault**: `0x03f4903c3fcf0cb23bee2c11531afb8a1307ce91` ✅ Initialized
- **JuniorVault**: `0x694c667c3b7ba5620c68fe1cc3b308eed26afc6e` ✅ Initialized
- **EpochManager**: `0xdc0f912aa970f2a89381985a8e0ea3128e754748`
- **SafetyModule**: `0xab5fd152973f5430991df6c5b74a5559ffa0d189`
- **DOORRateOracle**: `0xe76e27759b2416ec7c9ddf8ed7a58e61030876a4`
- **VaultStrategy**: `0xdd84c599f3b9a12d7f8e583539f11a3e1d9224df`
- **MockYieldStrategy**: `0x403e548ec79ade195db7e7abaa0eb203bbaa1db0`

#### Mock Tokens

- **MockUSDC**: `0xa9fd59bf5009da2d002a474309ca38a8d8686f6a` (has `mint()` function)
- **MockMETH**: `0xac8fc1d5593ada635c5569e35534bfab1ab2fedc`

## How to Switch Between Deployments

Switching between deployments is simple - just change one environment variable in your `.env.local` file.

### Using Production Deployment (Real Tokens) ✅ DEFAULT

```bash
# In .env.local
NEXT_PUBLIC_DEPLOYMENT=production
```

This uses:

- Real USDC and mETH tokens
- Production contract addresses
- Suitable for production-like testing

### Using Mock Token Deployment (For Testing)

```bash
# In .env.local
NEXT_PUBLIC_DEPLOYMENT=mock
```

This uses:

- Mock USDC and mETH tokens
- Mock deployment contract addresses
- Suitable for isolated testing

### Quick Start

1. Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and set your deployment type:

   ```bash
   NEXT_PUBLIC_DEPLOYMENT=production  # or 'mock'
   ```

3. Restart your development server:
   ```bash
   yarn dev
   ```

That's it! All contract addresses are automatically selected based on your deployment type.

## Contract Status

### Production Deployment ⭐

| Contract      | Status         | Notes                                                   |
| ------------- | -------------- | ------------------------------------------------------- |
| CoreVault     | ✅ Initialized | Main vault coordinator - Ready for deposits             |
| SeniorVault   | ✅ Initialized | Fixed-rate tranche (DOOR-FIX) - Ready for deposits      |
| JuniorVault   | ✅ Initialized | Variable-rate tranche (DOOR-BOOST) - Ready for deposits |
| EpochManager  | ✅ Active      | 7-day epoch cycles                                      |
| SafetyModule  | ✅ Active      | Risk management                                         |
| RateOracle    | ✅ Active      | APY calculations                                        |
| VaultStrategy | ✅ Active      | Yield generation                                        |

### Mock Deployment 🧪

| Contract     | Status         | Notes                                       |
| ------------ | -------------- | ------------------------------------------- |
| CoreVault    | ✅ Initialized | Main vault coordinator - Ready for deposits |
| SeniorVault  | ✅ Initialized | Fixed-rate tranche - Ready for deposits     |
| JuniorVault  | ✅ Initialized | Variable-rate tranche - Ready for deposits  |
| EpochManager | ✅ Active      | 7-day epoch cycles                          |
| SafetyModule | ✅ Active      | Risk management                             |
| RateOracle   | ✅ Active      | APY calculations                            |
| MockUSDC     | ✅ Active      | Has `mint()` function                       |
| MockMETH     | ✅ Active      | Has `mint()` function                       |

## Important Notes

1. **All Vaults Initialized** ✅:
   - Both Production and Mock deployments are fully initialized
   - All vaults (CoreVault, SeniorVault, JuniorVault) are ready to accept deposits
   - No initialization errors expected

2. **Safety Checks Active**:
   - Senior deposits require minimum 20% junior ratio to protect senior depositors
   - This is a protocol-level safety feature, not a bug
   - To deposit to Senior tranche: First deposit to Junior tranche to establish the required ratio
   - In Mock mode, you can use the "Bypass Safety Check" button for testing purposes only

3. **Epoch System**:
   - Deposits are processed at the start of each epoch (7-day cycles)
   - You can deposit anytime, but funds will be deployed in the next epoch
   - Withdrawals follow the same epoch-based processing

## Quick Test Guide

### Testing with Mock Deployment (Recommended for Development)

1. **Setup Environment**:

   ```bash
   # Set in .env.local
   NEXT_PUBLIC_DEPLOYMENT=mock
   ```

2. **Get Test Tokens**:
   - Connect wallet on Mantle Sepolia testnet
   - Click "Mint 10,000 USDC" button in the deposit page
   - Wait for transaction confirmation

3. **Test Junior Deposit** (Variable-rate tranche):
   - Switch to Junior tranche (DOOR-BOOST)
   - Enter amount (e.g., 1000 USDC)
   - Click "Approve USDC" and confirm transaction
   - Click "Deposit Now" and confirm transaction
   - ✅ Should succeed immediately!

4. **Test Senior Deposit** (Fixed-rate tranche):
   - Switch to Senior tranche (DOOR-FIX)
   - Enter amount (e.g., 500 USDC)
   - Click "Approve USDC" and confirm transaction
   - Click "Deposit Now" and confirm transaction
   - ✅ Should succeed if Junior ratio ≥ 20%
   - ⚠️ If blocked: Deposit more to Junior first, or use "Bypass Safety Check" for testing

### Testing with Production Deployment (Real Testnet Tokens)

1. **Setup Environment**:

   ```bash
   # Set in .env.local
   NEXT_PUBLIC_DEPLOYMENT=production
   ```

2. **Get Real Testnet USDC**:
   - You need actual USDC tokens on Mantle Sepolia testnet
   - Get MNT from [Mantle Faucet](https://faucet.sepolia.mantle.xyz/)
   - Swap for USDC or get from testnet USDC faucet

3. **Follow Same Deposit Flow**:
   - Junior deposits work anytime
   - Senior deposits require Junior ratio ≥ 20%
   - No bypass option in production mode (safety enforced)

## Verification Links

### Mantle Sepolia Explorer

Base URL: `https://explorer.sepolia.mantle.xyz/address/`

#### Production Deployment (Real Tokens) ⭐

**Core Contracts**:

- [CoreVault](https://explorer.sepolia.mantle.xyz/address/0x1601Aa4aE97b999cEd4bbaCF0D4B52f29554846F) - ✅ Initialized
- [SeniorVault](https://explorer.sepolia.mantle.xyz/address/0x34BC889a143870bBd8538EAe6421cA4c62e84bc3) - ✅ Initialized
- [JuniorVault](https://explorer.sepolia.mantle.xyz/address/0x8E1A6A3Ba7c5cb4d416Da7Fd376b2BC75227022e) - ✅ Initialized
- [EpochManager](https://explorer.sepolia.mantle.xyz/address/0x2956e44668E4026D499D46Ad7eCB1312EA8484aa)
- [SafetyModule](https://explorer.sepolia.mantle.xyz/address/0xA08fF559C4Fc41FEf01D26744394dD2d2aa74E55)
- [DOORRateOracle](https://explorer.sepolia.mantle.xyz/address/0x8888F236f9ec2B3aD0c07080ba5Ebc1241F70d71)

**Tokens**:

- [USDC](https://explorer.sepolia.mantle.xyz/address/0x9a54bad93a00bf1232d4e636f5e53055dc0b8238) - Real testnet token
- [mETH](https://explorer.sepolia.mantle.xyz/address/0x4Ade8aAa0143526393EcadA836224EF21aBC6ac6) - Real testnet token

#### Mock Token Deployment 🧪

**Core Contracts**:

- [CoreVault](https://explorer.sepolia.mantle.xyz/address/0x8d3ed9a02d3f1e05f68a306037edaf9a54a16105) - ✅ Initialized
- [SeniorVault](https://explorer.sepolia.mantle.xyz/address/0x03f4903c3fcf0cb23bee2c11531afb8a1307ce91) - ✅ Initialized
- [JuniorVault](https://explorer.sepolia.mantle.xyz/address/0x694c667c3b7ba5620c68fe1cc3b308eed26afc6e) - ✅ Initialized
- [EpochManager](https://explorer.sepolia.mantle.xyz/address/0xdc0f912aa970f2a89381985a8e0ea3128e754748)
- [SafetyModule](https://explorer.sepolia.mantle.xyz/address/0xab5fd152973f5430991df6c5b74a5559ffa0d189)
- [DOORRateOracle](https://explorer.sepolia.mantle.xyz/address/0xe76e27759b2416ec7c9ddf8ed7a58e61030876a4)

**Mock Tokens**:

- [MockUSDC](https://explorer.sepolia.mantle.xyz/address/0xa9fd59bf5009da2d002a474309ca38a8d8686f6a) - Has `mint()` function
- [MockMETH](https://explorer.sepolia.mantle.xyz/address/0xac8fc1d5593ada635c5569e35534bfab1ab2fedc) - Has `mint()` function

---

## Summary

✅ **Both deployments are fully operational**:

- All vaults initialized and ready for deposits
- Safety checks active to protect user funds
- Mock deployment includes free `mint()` function for testing
- Production deployment uses real Mantle Sepolia testnet tokens

🔗 **Network**: Mantle Sepolia Testnet (Chain ID: 5003)
📅 **Last Updated**: 2026-01-15
