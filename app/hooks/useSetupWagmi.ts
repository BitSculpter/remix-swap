import { useState, useEffect } from "react";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import type { Chain } from "wagmi";
import type { QueryClient } from "@tanstack/react-query";
import type { Client, WebSocketProvider } from "@wagmi/core";
import type {
  FallbackProvider,
  StaticJsonRpcProvider,
} from "@ethersproject/providers";

export function useSetupWagmi({
  appName = "Example",
  alchemyId,
}: {
  appName?: string;
  alchemyId?: string;
}) {
  const [chains, setChains] = useState<Chain[]>([]);
  const [client, setClient] = useState<
    Client<
      | (StaticJsonRpcProvider & { chains: Chain[] })
      | (FallbackProvider & { chains: Chain[] }),
      WebSocketProvider
    > & {
      queryClient: QueryClient;
    }
  >();

  useEffect(() => {
    const local = window.location.port ? [chain.hardhat] : [];
    const { chains, provider } = configureChains(
      [chain.mainnet, chain.polygon, chain.goerli, ...local],
      [alchemyProvider({ apiKey: alchemyId }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({ appName, chains });

    const wagmiClient = createClient({
      provider,
      connectors,
      autoConnect: true,
    });

    setChains(chains);
    setClient(wagmiClient);
  }, [appName, alchemyId]);

  return { client, chains };
}
