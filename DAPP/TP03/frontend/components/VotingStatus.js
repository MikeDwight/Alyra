import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import {
  Flex,
  Text,
  Heading,
  Input,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import {
  prepareReadContract,
  readContract,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import Contract from "../config/Voting.json";
import { createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";
import { v4 as uuidv4 } from "uuid";
import { VotingContractContext } from "./providers/VotingContractProvider";

const VotingStatus = () => {
  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const { isConnected } = useAccount();
  const toast = useToast();

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // Fonction pour ouvrir la session de proposal
  const startProposal = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "startProposalsRegistering",
      });
      await writeContract(request);

      await getEvents();

      toast({
        title: "Succès !",
        description: `Vous avez ouvert la session de proposition`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Ferme la session de proposition

  const endProposal = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "endProposalsRegistering",
      });
      await writeContract(request);

      await getEvents();

      toast({
        title: "Succès !",
        description: `Vous avez fermé la session de proposition`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Ouvre la session de vote
  const startVote = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "startVotingSession",
      });
      await writeContract(request);

      await getEvents();

      toast({
        title: "Succès !",
        description: `Vous avez ouvert la session de Vote`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Ferme la session de vote

  const endVote = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "endVotingSession",
      });
      await writeContract(request);

      await getEvents();

      toast({
        title: "Succès !",
        description: `Vous avez fermé la session de vote`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getEvents = async () => {
    client.watchContractEvent({
      address: contractAddress,
      abi: Contract.abi,
      eventName: "WorkflowStatusChange",
      onLogs: (logs) => setStatus(logs[0].args.newStatus),
    });
  };

  useEffect(() => {
    getEvents();
  }, []);

  // Ouvre la session de tri
  const startTally = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "tallyVotes",
      });
      await writeContract(request);

      await getEvents();

      toast({
        title: "Succès !",
        description: `Vous avez ouvert la session de tri`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Context
  const { isworkflowStatusStep } = useContext(VotingContractContext);

  return (
    <Flex padding={3} direction={"column"} width={"60%"} m={"auto"}>
      <Flex
        mt={"30px"}
        w={"100%"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        {isworkflowStatusStep === 0 && (
          <Button onClick={() => startProposal()}>
            Ouvrir la session de proposition
          </Button>
        )}
        {isworkflowStatusStep === 1 && (
          <Button onClick={() => endProposal()}>
            Fermer la session de proposition
          </Button>
        )}
        {isworkflowStatusStep === 2 && (
          <Button onClick={() => startVote()}>Ouvrir la session de vote</Button>
        )}
        {isworkflowStatusStep === 3 && (
          <Button onClick={() => endVote()}>Fermer la session de vote</Button>
        )}
        {isworkflowStatusStep === 4 && (
          <Button onClick={() => startTally()}>Ouvrir la session de tri</Button>
        )}
      </Flex>
    </Flex>
  );
};

export default VotingStatus;
