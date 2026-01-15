import { http, createConfig } from 'wagmi';
import { mantle, mantleSepoliaTestnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { defineChain } from 'viem';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-project-id';

// Custom Mantle Sepolia configuration with explicit native currency
const customMantleSepolia = defineChain({
  ...mantleSepoliaTestnet,
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18,
  },
});

export const config = createConfig({
  chains: [mantle, customMantleSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId,
    }),
  ],
  transports: {
    [mantle.id]: http('https://rpc.mantle.xyz'),
    [customMantleSepolia.id]: http('https://rpc.sepolia.mantle.xyz'),
  },
  ssr: true, // Next.js SSR support
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
