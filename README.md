# DOOR Protocol Frontend

> Opening the door to DeFi fixed income

Decentralized Offered Rate (DOR) protocol frontend built with Next.js, TypeScript, and TailwindCSS on Mantle Network.

## 🚀 Live Demo

The project is deployed and live at:
**[https://door-protocol-frontend.vercel.app](https://door-protocol-frontend.vercel.app)**

## Features

- 🛡️ **Senior Tranche (DOOR-FIX)**: Stable 5-6% APY with priority yield distribution
- ⚔️ **Junior Tranche (DOOR-BOOST)**: High-yield 15-30% APY with leverage effect
- 📊 **DOR Benchmark Rate**: First decentralized benchmark rate for DeFi
- 🌓 **Dark/Light Mode**: Full theme support with next-themes
- 📱 **Responsive Design**: Mobile-first approach with TailwindCSS
- 🔗 **Mantle Integration**: Optimized for Mantle Network

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

- **Senior (DOOR-FIX)**: Lower risk, stable 5-6% APY, priority yield
- **Junior (DOOR-BOOST)**: Higher risk, 15-30% APY, leverage effect

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

Built with ❤️ on Mantle | Powered by Treehouse DOR | Secured by RWA
