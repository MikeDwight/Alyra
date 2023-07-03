import { useState, useEffect } from "react";
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
import Contract from "../../backend/artifacts/contracts/Voting.sol/Voting.json";
import { createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";
import { v4 as uuidv4 } from "uuid";

const VotingStatus = () => {
  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const { isConnected } = useAccount();
  const toast = useToast();
  const [status, setStatus] = useState(null);

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

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Session de proposition";
      case 2:
        return "Session de proposition fermée";
      case 3:
        return "Session de vote";
      case 4:
        return "Session de vote fermée";
      case 5:
        return "Session de dépouillement";
      default:
        return "Enregistrement des voters";
    }
  };

  return (
    <Flex bg={"blue"} padding={3} direction={"column"} width={"60%"} m={"auto"}>
      <Alert status="info" justifyContent={"center"} mb={"30px"}>
        <AlertIcon />
        <AlertTitle color={"#000000"}>{getStatusText(status)}</AlertTitle>
      </Alert>
      <Flex
        mt={"30px"}
        w={"100%"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <Button>Changer de statut (a configurer)</Button>
        <Button onClick={() => startProposal()}>
          Ouvrir la session de proposition
        </Button>
        <Button onClick={() => endProposal()}>
          Fermer la session de proposition
        </Button>
        <Button onClick={() => startVote()}>Ouvrir la session de vote</Button>
        <Button onClick={() => startTally()}>Ouvrir la session de tri</Button>
        <Button onClick={() => endVote()}>Fermer la session de vote</Button>
      </Flex>
    </Flex>
  );
};

export default VotingStatus;
