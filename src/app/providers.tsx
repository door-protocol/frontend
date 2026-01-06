'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { config } from '@/lib/wagmi.config';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en-US"
          theme={{
            lightMode: lightTheme({
              accentColor: '#18181b',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            }),
            darkMode: darkTheme({
              accentColor: '#3b82f6',
              accentColorForeground: '#ffffff',
              borderRadius: 'medium',
              overlayBlur: 'small',
            }),
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
