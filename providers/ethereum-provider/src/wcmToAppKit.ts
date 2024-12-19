import type { AppKitOptions } from '@reown/appkit';
import type { WalletConnectModalConfig } from './types';
import type { AppKitNetwork } from '@reown/appkit/networks';
import * as chains from '@reown/appkit/networks';
import type { EthereumProviderOptions } from './EthereumProvider';

function convertThemeVariables(wcmTheme?: WalletConnectModalConfig['themeVariables']): AppKitOptions['themeVariables'] | undefined {
  if (!wcmTheme) return undefined;

  return {
    '--w3m-font-family': wcmTheme['--wcm-font-family'],
    '--w3m-accent': wcmTheme['--wcm-accent-color'],
    '--w3m-color-mix': wcmTheme['--wcm-background-color'],
    '--w3m-z-index': wcmTheme['--wcm-z-index'] ? Number(wcmTheme['--wcm-z-index']) : undefined,

    '--w3m-qr-color': wcmTheme['--wcm-accent-color'],

    // Optional: Set master controls for sizing
    '--w3m-font-size-master': wcmTheme['--wcm-text-medium-regular-size'],
    '--w3m-border-radius-master': wcmTheme['--wcm-container-border-radius'],
    '--w3m-color-mix-strength': 8 // Default value, adjust as needed
  };
}

export function convertWCMToAppKitOptions(wcmConfig: WalletConnectModalConfig & { metadata?: EthereumProviderOptions['metadata'] }): AppKitOptions {
  // Convert chains to AppKitNetwork format
  const networks: AppKitNetwork[] = wcmConfig.chains?.map(chain =>
    Object.values(chains).find((chainData) => String((chainData as AppKitNetwork)?.id) === chain)
  ).filter(Boolean) as AppKitNetwork[];

  
  // Ensure at least one network is present
  if (networks.length === 0) {
    throw new Error('At least one chain must be specified');
  }
  
  const defaultNetwork = networks.find(network => network.id === wcmConfig.defaultChain?.id);
  const appKitOptions: AppKitOptions = {
    projectId: wcmConfig.projectId,
    networks: networks as [AppKitNetwork, ...AppKitNetwork[]],
    // Theme mapping
    themeMode: wcmConfig.themeMode,
    themeVariables: convertThemeVariables(wcmConfig.themeVariables),

    // Chain and wallet images
    chainImages: wcmConfig.chainImages,
    connectorImages: wcmConfig.walletImages,

    // Default network from defaultChain
    defaultNetwork,

    // Privacy and terms URLs
    metadata: {
      ...wcmConfig.metadata,
      name: wcmConfig.metadata?.name || 'WalletConnect',
      description: wcmConfig.metadata?.description || 'Connect to WalletConnect-compatible wallets',
      url: wcmConfig.metadata?.url || 'https://walletconnect.org',
      icons: wcmConfig.metadata?.icons || ['https://walletconnect.org/walletconnect-logo.png'],
    },

    // Features mapping
    showWallets: true, // Default to true unless explicitly disabled

    // Explorer options mapping
    featuredWalletIds: wcmConfig.explorerRecommendedWalletIds === 'NONE' ? [] : 
      (Array.isArray(wcmConfig.explorerRecommendedWalletIds) ? wcmConfig.explorerRecommendedWalletIds : []),
    
    excludeWalletIds: wcmConfig.explorerExcludedWalletIds === 'ALL' ? [] :
      (Array.isArray(wcmConfig.explorerExcludedWalletIds) ? wcmConfig.explorerExcludedWalletIds : []),

    // Additional AppKit-specific options that don't have direct WCM equivalents
    allowUnsupportedChain: false, // Default to false for safety
    enableWallets: true, // Default to true
    enableEIP6963: false, // Default to false
    enableCoinbase: true, // Default to true
    enableInjected: true, // Default to true
    enableWalletConnect: true // Default to true
  };

  // Add mobile and desktop wallets as custom wallets if provided
  if (wcmConfig.mobileWallets?.length || wcmConfig.desktopWallets?.length) {
    const customWallets = [
      ...(wcmConfig.mobileWallets || []).map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        links: {
          native: wallet.links.native,
          universal: wallet.links.universal
        }
      })),
      ...(wcmConfig.desktopWallets || []).map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        links: {
          native: wallet.links.native,
          universal: wallet.links.universal
        }
      }))
    ];
    
    if (customWallets.length > 0) {
      appKitOptions.customWallets = customWallets;
    }
  }

  return appKitOptions;
}