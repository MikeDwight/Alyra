import { mainnet, sepolia, hardhat } from "viem/chains";
import { createPublicClient, http, parseAbiItem } from 'viem'

const chain = process.env.NEXT_PUBLIC_CLIENT_CHAIN === "mainnet"
? mainnet
: process.env.NEXT_PUBLIC_CLIENT_CHAIN === "sepolia"
    ? sepolia : hardhat;

// Create client for Viem
export const client = createPublicClient({
    chain: chain,
    transport: http(),
})