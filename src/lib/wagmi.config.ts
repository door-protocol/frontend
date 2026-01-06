import { http, createConfig } from 'wagmi';
import { mantle, mantleSepoliaTestnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [mantle, mantleSepoliaTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId,
    }),
  ],
  transports: {
    [mantle.id]: http('https://rpc.mantle.xyz'),
    [mantleSepoliaTestnet.id]: http('https://rpc.sepolia.mantle.xyz'),
  },
  ssr: true, // Next.js SSR support
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
