'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

export function CustomConnectButton() {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 font-medium transition-colors shadow-sm cursor-pointer"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium transition-colors"
                  >
                    Wrong network
                  </button>
                );
              }

              // Format balance manually
              const formattedBalance = balance?.value
                ? parseFloat(
                    formatUnits(balance.value, balance.decimals),
                  ).toFixed(2)
                : '0.00';

              return (
                <div className="flex gap-1.5">
                  {/* Chain selector */}
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-border bg-background hover:bg-secondary transition-colors min-w-[40px]"
                  >
                    {chain.hasIcon && chain.iconUrl ? (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-4 h-4 flex-shrink-0"
                      />
                    ) : (
                      // Fallback: Show first letter of chain name
                      <div className="w-4 h-4 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-300">
                        {chain.name?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
                      {chain.name}
                    </span>
                  </button>

                  {/* Account button - compact */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
                  >
                    <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
                      {formattedBalance} {balance?.symbol || 'MNT'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {account.displayName}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
