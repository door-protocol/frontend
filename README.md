# DOOR Protocol Frontend

**Opening the Door to DeFi Fixed Income**

> Structured DeFi product with waterfall distribution mechanism on Mantle Network

DOOR Protocol is a next-generation DeFi platform that brings traditional finance's structured product approach to the blockchain. Our dual-tranche system separates risk and return profiles, providing **fixed-rate yields for conservative investors** and **amplified returns for risk-seekers**, all powered by an innovative waterfall distribution mechanism.

## 🚀 Live Demo

**[https://door-protocol-frontend.vercel.app](https://door-protocol-frontend.vercel.app)**

✅ Deployed on Mantle Sepolia Testnet
✅ Full protocol functionality
✅ Mock tokens available for testing (unlimited balance!)

## 📖 What is DOOR Protocol?

Traditional DeFi offers one-size-fits-all yields, forcing all users into the same risk profile. DOOR Protocol solves this through a **structured product approach** with waterfall distribution:

### 🛡️ Senior Tranche (DOOR-FIX)

- **Fixed-rate APY** based on DOOR Rate Oracle (DOR)
- **Waterfall priority** - gets paid first from all yields
- **First-loss protection** - junior capital absorbs losses first
- Perfect for **risk-averse investors** seeking predictable returns

### ⚔️ Junior Tranche (DOOR-BOOST)

- **Amplified returns** with 5-10x leverage potential
- **Captures all excess yields** after senior obligations
- **Higher risk/reward** profile
- Perfect for **risk-seeking investors** wanting maximum upside

### 💧 How Waterfall Distribution Works

```
Protocol Yields (e.g., 12% APY)
         │
         ├─► Step 1: Protocol Fee (2%) → Treasury
         │
         ├─► Step 2: Senior Obligation (8% APY × Senior Principal)
         │                              → Senior Vault
         │
         └─► Step 3: Remaining Yields → Junior Vault
                                      → Amplified Returns!
```

**Example**: If total assets are $100k with $20k junior capital, and the strategy yields 12%:

- Senior gets: 8% on $80k = $6,400
- Junior gets: $12,000 - $6,400 = $5,600
- Junior APY: $5,600 / $20k = **28%** (3.5x amplification!)

## ✨ Key Features

### Core Protocol Features

🏦 **Dual-Tranche Vault System**

- ERC-4626 compliant vaults (sDOOR & jDOOR tokens)
- Automated yield distribution via smart contracts
- Real-time share pricing and redemption

📊 **DOOR Rate Oracle (DOR)**

- Decentralized benchmark rate with multi-source aggregation
- Challenge mechanism for rate updates (24-hour window)
- Senior APY = DOR + 1% premium

🛡️ **Dynamic Safety Module**

- Real-time risk monitoring (HEALTHY → WARNING → DANGER → CRITICAL)
- Automatic deposit pausing when safety thresholds breached
- Dynamic senior deposit caps based on junior capital ratio

⏰ **Epoch-Based Liquidity Management**

- 7-day withdrawal epochs for capital stability
- Early withdrawal penalty (configurable 1-5%)
- Queue-based withdrawal processing

💰 **Flexible Yield Strategies**

- mETH (Mantle Staked ETH) staking integration
- Multi-protocol yield aggregation
- Pluggable strategy architecture for new opportunities

### Frontend Features

🎨 **Modern User Interface**

- Clean, intuitive dashboard with real-time metrics
- Advanced analytics and performance charts
- Portfolio management with position tracking

🌓 **Dark/Light Mode**

- Full theme support with next-themes
- Persistent user preferences

📱 **Responsive Design**

- Mobile-first approach with TailwindCSS
- Seamless experience across all devices

🔗 **Web3 Integration**

- RainbowKit wallet connection
- Real-time blockchain data via wagmi/viem
- Transaction status tracking

## 🔗 Deployed Contracts (Mantle Sepolia)

### Mock Token Deployment (⭐ RECOMMENDED)

**Perfect for testing with unlimited token balance!**

| Contract              | Address                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **MockUSDC**          | [`0xa9fd59bf5009da2d002a474309ca38a8d8686f6a`](https://explorer.sepolia.mantle.xyz/address/0xa9fd59bf5009da2d002a474309ca38a8d8686f6a) |
| **MockMETH**          | [`0xac8fc1d5593ada635c5569e35534bfab1ab2fedc`](https://explorer.sepolia.mantle.xyz/address/0xac8fc1d5593ada635c5569e35534bfab1ab2fedc) |
| **SeniorVault**       | [`0x03f4903c3fcf0cb23bee2c11531afb8a1307ce91`](https://explorer.sepolia.mantle.xyz/address/0x03f4903c3fcf0cb23bee2c11531afb8a1307ce91) |
| **JuniorVault**       | [`0x694c667c3b7ba5620c68fe1cc3b308eed26afc6e`](https://explorer.sepolia.mantle.xyz/address/0x694c667c3b7ba5620c68fe1cc3b308eed26afc6e) |
| **CoreVault**         | [`0x8d3ed9a02d3f1e05f68a306037edaf9a54a16105`](https://explorer.sepolia.mantle.xyz/address/0x8d3ed9a02d3f1e05f68a306037edaf9a54a16105) |
| **EpochManager**      | [`0xdc0f912aa970f2a89381985a8e0ea3128e754748`](https://explorer.sepolia.mantle.xyz/address/0xdc0f912aa970f2a89381985a8e0ea3128e754748) |
| **SafetyModule**      | [`0xab5fd152973f5430991df6c5b74a5559ffa0d189`](https://explorer.sepolia.mantle.xyz/address/0xab5fd152973f5430991df6c5b74a5559ffa0d189) |
| **DOORRateOracle**    | [`0xe76e27759b2416ec7c9ddf8ed7a58e61030876a4`](https://explorer.sepolia.mantle.xyz/address/0xe76e27759b2416ec7c9ddf8ed7a58e61030876a4) |
| **VaultStrategy**     | [`0xdd84c599f3b9a12d7f8e583539f11a3e1d9224df`](https://explorer.sepolia.mantle.xyz/address/0xdd84c599f3b9a12d7f8e583539f11a3e1d9224df) |
| **MockYieldStrategy** | [`0x403e548ec79ade195db7e7abaa0eb203bbaa1db0`](https://explorer.sepolia.mantle.xyz/address/0x403e548ec79ade195db7e7abaa0eb203bbaa1db0) |

**Network**: Mantle Sepolia Testnet (Chain ID: 5003)

## 💻 Tech Stack

### Frontend

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: CSS transitions

### Web3 Integration

- **Wallet Connection**: RainbowKit
- **Web3 Library**: wagmi v2 + viem
- **State Management**: TanStack Query (React Query)
- **Network**: Mantle Sepolia Testnet

### Smart Contracts

- **Language**: Solidity 0.8.26
- **Framework**: Foundry + Hardhat
- **Standards**: ERC-4626 (Tokenized Vaults)
- **Testing**: Forge (142 tests, 100% pass rate)
- **Dependencies**: OpenZeppelin Contracts v5.0.0

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0 or yarn >= 1.22.0
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/door-protocol/frontend.git
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your WalletConnect Project ID:

```env
NEXT_PUBLIC_WC_PROJECT_ID=your_project_id_here
```

Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/             # Marketing pages
│   │   │   └── page.tsx            # Landing page
│   │   ├── (app)/                  # Application pages
│   │   │   ├── dashboard/          # Protocol metrics & stats
│   │   │   ├── deposit/            # Deposit interface
│   │   │   ├── portfolio/          # User positions
│   │   │   └── analytics/          # Performance charts
│   │   ├── layout.tsx              # Root layout with providers
│   │   └── providers.tsx           # wagmi, RainbowKit, Theme providers
│   │
│   ├── components/
│   │   ├── common/                 # Header, Footer, Navigation
│   │   ├── core/                   # Core protocol components
│   │   │   ├── TrancheSelector/    # Senior/Junior tranche selector
│   │   │   ├── RatioGauge/         # Junior capital ratio gauge
│   │   │   ├── EpochTimer/         # Withdrawal epoch timer
│   │   │   └── DepositInput/       # Deposit amount input
│   │   ├── portfolio/              # Portfolio management
│   │   │   └── PositionCard/       # User position cards
│   │   └── ui/                     # Base UI components
│   │       ├── Button/
│   │       ├── Card/
│   │       ├── Input/
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── contracts/              # Smart contract integration
│   │   │   ├── addresses.ts        # Contract addresses
│   │   │   └── abis/               # Contract ABIs
│   │   ├── utils/                  # Utility functions
│   │   │   ├── format.ts           # Number/currency formatting
│   │   │   └── constants.ts        # App constants
│   │   └── wagmi.config.ts         # Wagmi config for Mantle
│   │
│   └── mock/                       # Mock data for development
│       └── vaultData.ts
│
├── public/                          # Static assets
└── package.json
```

## 📱 Application Pages

### 🏠 Landing Page (`/`)

- Protocol overview and value proposition
- Senior vs Junior tranche comparison
- Key features and benefits
- How waterfall distribution works
- Call-to-action to start using DOOR

### 📊 Dashboard (`/dashboard`)

- Real-time protocol metrics
  - Total Value Locked (TVL)
  - Senior/Junior vault balances
  - Current APY rates
  - Junior capital ratio
- Safety module status
- Recent protocol activity
- Network statistics

### 💰 Deposit (`/deposit`)

- Tranche selector (Senior/Junior)
- Deposit amount input
- APY and leverage calculations
- Real-time balance checks
- Transaction confirmation
- Deposit history

### 👛 Portfolio (`/portfolio`)

- User positions overview
  - Senior vault holdings (sDOOR)
  - Junior vault holdings (jDOOR)
- Claimable yields
- Position performance
- Withdrawal requests
- Transaction history

### 📈 Analytics (`/analytics`)

- Historical performance charts
  - APY trends (Senior/Junior)
  - TVL over time
  - Yield distribution
- Junior capital ratio history
- Protocol statistics
- Export data functionality

## 🎯 Key Development Features

### Real-time Blockchain Data

- Live contract data via wagmi hooks
- Automatic re-fetching and caching with React Query
- Transaction status tracking
- Block number monitoring

### Wallet Integration

- Multi-wallet support via RainbowKit
- Automatic network switching to Mantle
- Balance checking and token approvals
- Transaction signing and confirmation

### Theme System

- Dark/Light mode support
- System preference detection
- Persistent user selection
- Smooth theme transitions

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

### Error Handling

- Graceful error messages
- Transaction failure recovery
- Network error handling
- User-friendly notifications

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run prettier        # Format code with Prettier
npm run type-check      # TypeScript type checking

# Utilities
npm run sort-package-json  # Sort package.json
```

## 🚢 Deployment

### Vercel (Recommended)

The app is configured for one-click deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_WC_PROJECT_ID`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## 🗺️ Roadmap

### Phase 1: Core Features (✅ Completed)

- ✅ Landing page and protocol overview
- ✅ Dashboard with real-time metrics
- ✅ Deposit interface for both tranches
- ✅ Portfolio management
- ✅ Analytics and charts
- ✅ Wallet integration (RainbowKit)
- ✅ Dark/Light mode

### Phase 2: Enhanced UX (Q2 2026)

- 🔄 Advanced portfolio analytics
- 🔄 Transaction history filtering
- 🔄 Notification system
- 🔄 Multi-language support
- 🔄 Mobile app (React Native)

### Phase 3: Advanced Features (Q3 2026)

- 📋 Governance interface
- 📋 Strategy performance comparison
- 📋 Social features (leaderboard)
- 📋 Advanced charting tools
- 📋 API for third-party integrations

### Phase 4: Ecosystem (Q4 2026)

- 📋 Subgraph integration
- 📋 Multi-chain support
- 📋 Partner protocol integrations
- 📋 Advanced risk analytics
- 📋 Institutional dashboard

## 🔗 Links

- **Live Demo**: [https://door-protocol-frontend.vercel.app](https://door-protocol-frontend.vercel.app)
- **Smart Contracts**: [GitHub - door-protocol/contract](https://github.com/door-protocol/contract)
- **X (Twitter)**: [@door_protocol](https://x.com/door_protocol)
- **Mantle Explorer**: [Mantle Sepolia](https://explorer.sepolia.mantle.xyz/)

## 📚 Learn More

### Protocol Documentation

- [DOOR Protocol Overview](https://github.com/door-protocol/contract/blob/main/README.md#-overview)
- [Waterfall Distribution Mechanism](https://github.com/door-protocol/contract/blob/main/README.md#1-waterfall-distribution-mechanism)
- [Safety Module Details](https://github.com/door-protocol/contract/blob/main/README.md#2-dynamic-safety-module)
- [Smart Contract Architecture](https://github.com/door-protocol/contract/blob/main/README.md#-architecture)
- [How It Works](https://github.com/door-protocol/contract/blob/main/README.md#-how-it-works)
- [Getting Started Guide](https://github.com/door-protocol/contract/blob/main/README.md#-getting-started)

### Technical Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantle Network](https://www.mantle.xyz/)
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Viem Documentation](https://viem.sh/)
- [TailwindCSS](https://tailwindcss.com/)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests as needed
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Update documentation as needed
- Test on multiple screen sizes
- Ensure accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Team**: DOOR Protocol Team
- **Email**: andy3638@naver.com
- **X (Twitter)**: [@door_protocol](https://x.com/door_protocol)
- **GitHub**: [@door-protocol](https://github.com/door-protocol)

## 🙏 Acknowledgments

- Built on [Mantle Network](https://mantle.xyz)
- UI powered by [Next.js](https://nextjs.org) and [TailwindCSS](https://tailwindcss.com)
- Wallet integration by [RainbowKit](https://rainbowkit.com)
- Web3 library by [wagmi](https://wagmi.sh) and [viem](https://viem.sh)
- Inspired by traditional finance structured products

## ⚠️ Disclaimer

DOOR Protocol is experimental DeFi software deployed on testnet. Smart contracts have been tested but not audited. This is a demonstration project for educational and testing purposes. Do not use with real funds. This is not financial advice.
