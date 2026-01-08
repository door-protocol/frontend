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
import { config } from '@/lib/wagmi.config';
import { ThemeProvider } from 'next-themes';
import { useTheme } from 'next-themes';

function RainbowKitThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <RainbowKitProvider
      locale="en-US"
      theme={
        resolvedTheme === 'dark'
          ? darkTheme({
              accentColor: '#18181b',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            })
          : lightTheme({
              accentColor: '#18181b',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            })
      }
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RainbowKitThemeProvider>{children}</RainbowKitThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
