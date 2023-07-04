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
  const [owner, setOwner] = useState(false);
  const [isVoter, setIsVoter] = useState(null);
  const [isOwner, setIsOwner] = useState(null);
  const [isworkflowStatusStep, setworkflowStatusStep] = useState(0);

  // Init
  useEffect(() => {
    if (!isConnected) return;
    try {
      loadContract();
      checkRoles();
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

      // console.log("useVotingContract : address owner ", owner);

      const workflowStatusStep = await voting.read.workflowStatus();
      console.log("voting js :", workflowStatusStep);

      // Set state hook
      setContract(voting);
      setOwner(owner);
      setIsOwner(owner === address);
      setworkflowStatusStep(workflowStatusStep);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!address || !isConnected) return;
    checkRoles();
  }, [address, contract]);

  const checkRoles = async () => {
    try {
      const Voter = await getVoter(address);
      if (Voter && Voter.isRegistered) {
        setIsVoter(true);
      } else {
        setIsVoter(false);
      }
      console.log("checkroles : address isVoter ", Voter);
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
      console.log("useVotingContract : data ", data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  // console.log("useVotingContract : address isVoter ", isVoter);

  return {
    owner,
    setOwner,
    isOwner,
    isVoter,
    setIsVoter,
    contract,
    isworkflowStatusStep,
    setworkflowStatusStep,
  };
}
