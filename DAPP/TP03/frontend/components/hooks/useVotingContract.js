import { useContext, useEffect, useState } from "react";
import { VotingContractContext } from "../providers/VotingContractProvider";
import { readContract, getWalletClient, getContract } from "@wagmi/core";
import { useAccount, useNetwork } from "wagmi";
import { isAddress } from "viem";
import VotingABI from "../../config/Voting.json";

export default function useVotingContract() {
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();

  // init state
  const [contract, setContract] = useState({});
  const [owner, setOwner] = useState(null);
  const [isVoter, setIsVoter] = useState(false);
  const [isOwner, setIsOwner] = useState(null);
  const [votingIsConnected, setVotingIsConnected] = useState(null);

  // Init
  useEffect(() => {
    if (!isConnected) return;
    try {
      loadContract();
    } catch (error) {
      console.log(error.message);
    }
  }, [isConnected, address, chain?.id]);

  // Load contract
  const loadContract = async () => {
    try {
      // get contract with provider connected
      const walletClient = await getWalletClient();
      const voting = getContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: VotingABI.abi,
        walletClient,
      });

      const owner = isAddress(await voting.read.owner())
        ? await voting.read.owner()
        : null;

      const wfStatus = await voting.read.workflowStatus();

      // Set state hook
      setContract(voting);
      setOwner(owner);
      setIsOwner(owner === address);
      setVotingIsConnected(true);
    } catch (error) {
      setVotingIsConnected(false);
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!address || !isConnected) return;
    checkRoles();
  }, [address, contract]);

  const checkRoles = async () => {
    try {
      const Voter = await getVoter(address);
      if (Voter) setIsVoter(true);
    } catch (error) {
      setIsVoter(false);
    }
    try {
      const owner = isAddress(await contract.read.owner())
        ? await contract.read.owner()
        : null;
      if (owner) setIsOwner(owner === address);
    } catch (error) {
      setIsOwner(false);
    }
  };
  // Voter
  const getVoter = async (_address) => {
    if (!_address) return;
    try {
      const data = await readContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: VotingABI.abi,
        functionName: "getVoter",
        args: [String(_address)],
      });
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  console.log("useVotingContract js :", isVoter);

  return {
    owner,
    setOwner,
    isOwner,
    isVoter,
    setIsVoter,
    votingIsConnected,
    contract,
  };
}
