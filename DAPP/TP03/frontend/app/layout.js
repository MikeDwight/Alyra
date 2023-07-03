"use client";
import { ChakraProvider } from "@chakra-ui/react";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { VotingContractProvider } from "../components/providers/VotingContractProvider";

const { chains, publicClient } = configureChains([hardhat], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "Voting",
  projectId: "aa43b4e871278430d650affe5d375fc6",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VotingContractProvider>
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
              <ChakraProvider>{children}</ChakraProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </VotingContractProvider>
      </body>
    </html>
  );
}
