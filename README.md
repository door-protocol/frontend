# DOOR Protocol Frontend

> Opening the door to DeFi fixed income

Structured DeFi product with waterfall distribution. Risk-adjusted yields through dual-tranche architecture on Mantle Network.

## 🚀 Live Demo

The project is deployed and live at:
**[https://door-protocol-frontend.vercel.app](https://door-protocol-frontend.vercel.app)**

## Features

- 🛡️ **Senior Tranche (DOOR-FIX)**: Fixed-rate APY with waterfall priority and junior buffer protection
- ⚔️ **Junior Tranche (DOOR-BOOST)**: Amplified returns with 5-10x leverage potential on excess yields
- 📊 **DOOR Rate Oracle (DOR)**: Decentralized benchmark rate with multi-source aggregation
- 💧 **Waterfall Distribution**: Automated yield routing based on priority rules
- 🌓 **Dark/Light Mode**: Full theme support with next-themes
- 📱 **Responsive Design**: Mobile-first approach with TailwindCSS
- 🔗 **Mantle Integration**: Native support for Mantle Network and mETH staking

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Web3**: wagmi, viem, RainbowKit
- **State**: TanStack Query (React Query)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

First, install the dependencies:

```bash
yarn install
```

### Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID:

```
NEXT_PUBLIC_WC_PROJECT_ID=your_project_id_here
```

Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

### Development

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # Marketing pages (landing)
│   ├── (app)/              # Application pages (dashboard, deposit, portfolio, analytics)
│   ├── layout.tsx          # Root layout
│   └── providers.tsx       # App providers (wagmi, react-query, theme)
├── components/
│   ├── common/             # Header, Footer
│   ├── core/               # TrancheSelector, RatioGauge, EpochTimer, DepositInput
│   ├── portfolio/          # PositionCard
│   └── ui/                 # Base UI components (Button, Card, Input, etc.)
├── lib/
│   ├── contracts/          # Contract addresses and ABIs
│   ├── utils/              # Utility functions and constants
│   └── wagmi.config.ts     # Wagmi configuration for Mantle
└── mock/                   # Mock data for development
```

## Pages

- **/** - Landing page with protocol overview
- **/dashboard** - Protocol metrics and statistics
- **/deposit** - Deposit interface for Senior/Junior tranches
- **/portfolio** - User positions and claimable yields
- **/analytics** - Historical performance charts and analytics

## Development Features

### Mock Data

During development, the app uses mock data from `src/mock/vaultData.ts`. This will be replaced with real blockchain data once smart contracts are deployed.

### Dark/Light Mode

The app supports both dark and light themes using next-themes. Toggle in the header to switch.

### Tranche System

- **Senior (DOOR-FIX)**: Lower risk, fixed-rate APY, waterfall priority, first-loss protection
- **Junior (DOOR-BOOST)**: Higher risk, amplified APY with 5-10x leverage, captures excess yields

## Commands

```bash
# Development
yarn dev

# Build
yarn build

# Start production server
yarn start

# Lint
yarn lint

# Format code
yarn prettier

# Sort package.json
yarn sort-package-json
```

## Deployment

The app is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantle Network](https://www.mantle.xyz/)
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit](https://www.rainbowkit.com/)

---

Built on Mantle | Powered by Treehouse DOR | Secured by RWA
