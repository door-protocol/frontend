# DOOR Protocol - Deployment Addresses

## Mantle Sepolia Testnet

### Deployment 1: Production (Real Testnet Tokens) ⭐ DEFAULT

**Deployed on**: 2026-01-15

Uses real USDC and mETH tokens on Mantle Sepolia testnet for production-like testing.

#### Core Contracts

- **CoreVault**: `0x1601Aa4aE97b999cEd4bbaCF0D4B52f29554846F`
- **SeniorVault**: `0x34BC889a143870bBd8538EAe6421cA4c62e84bc3`
- **JuniorVault**: `0x8E1A6A3Ba7c5cb4d416Da7Fd376b2BC75227022e`
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

#### Core Contracts

- **CoreVault**: `0xed70c309127aff79289e62976980efdbcbbb0899`
- **SeniorVault**: `0x0e8fc3535af2df5c5a73aeff2ddc6b6d34410af8`
- **JuniorVault**: `0xee3aaf06b1633837ad31d98d124cc7cc107dcb08`
- **EpochManager**: `0x14f6933af60d3f9ca661630b7c3ed923821389b6`
- **SafetyModule**: `0x8db86eb5f494ccddf94bbc4967288fb85947a68c`
- **DOORRateOracle**: `0xd1812392885db8b9633e96f79302afd6ac1c944a`
- **VaultStrategy**: `0xdb367615af9a3a3ab894065d08c0a35a6171af22`
- **MockYieldStrategy**: `0x3627513d086cd14f1e4e69d391abcc5eb5489e23`

#### Mock Tokens

- **MockUSDC**: `0xbb5419001ef40a75b5edc7b10449bfe52d605762`
- **MockMETH**: `0x9a44ca8180732d7d30f1d01514bc69450c33eae2`

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

## Verification Links

### Mantle Sepolia Explorer

- Base URL: `https://explorer.sepolia.mantle.xyz/address/`

#### Production Deployment (Real Tokens) ⭐

- [CoreVault](https://explorer.sepolia.mantle.xyz/address/0x1601Aa4aE97b999cEd4bbaCF0D4B52f29554846F)
- [SeniorVault](https://explorer.sepolia.mantle.xyz/address/0x34BC889a143870bBd8538EAe6421cA4c62e84bc3)
- [JuniorVault](https://explorer.sepolia.mantle.xyz/address/0x8E1A6A3Ba7c5cb4d416Da7Fd376b2BC75227022e)
- [USDC](https://explorer.sepolia.mantle.xyz/address/0x9a54bad93a00bf1232d4e636f5e53055dc0b8238)
- [mETH](https://explorer.sepolia.mantle.xyz/address/0x4Ade8aAa0143526393EcadA836224EF21aBC6ac6)

#### Mock Token Deployment

- [CoreVault](https://explorer.sepolia.mantle.xyz/address/0xed70c309127aff79289e62976980efdbcbbb0899)
- [SeniorVault](https://explorer.sepolia.mantle.xyz/address/0x0e8fc3535af2df5c5a73aeff2ddc6b6d34410af8)
- [JuniorVault](https://explorer.sepolia.mantle.xyz/address/0xee3aaf06b1633837ad31d98d124cc7cc107dcb08)
- [MockUSDC](https://explorer.sepolia.mantle.xyz/address/0xbb5419001ef40a75b5edc7b10449bfe52d605762)
- [MockMETH](https://explorer.sepolia.mantle.xyz/address/0x9a44ca8180732d7d30f1d01514bc69450c33eae2)
