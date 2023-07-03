"use client";

// Chakra-ui
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

// Wagmi
import { useAccount } from "wagmi";
import {
  prepareWriteContract,
  writeContract,
  readContract,
  watchContractEvent,
} from "@wagmi/core";

// Contract
// import Contract from "@/config/Voting.json";
// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199

import VotingStatus from "../VotingStatus";
import Registration from "../registration";
import AddProposalComponent from "../AddProposalComponent";
import VoteProposal from "../VoteProposal";
import Winner from "../Winner";
import { useContext } from "react";
import {
  VotingContractContext,
  VotingContractProvider,
} from "../providers/VotingContractProvider";

const Voting = () => {
  // Wagmi
  const { isConnected } = useAccount();

  // Context
  const { isOwner, isVoter } = useContext(VotingContractContext);

  console.log("voting js :", isVoter, isOwner);
  // AFFICHAGE
  return (
    <Flex
      w={"60%"}
      bg={"#6B4E71"}
      color={"#F5DDDD"}
      m={"auto"}
      p={"50px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {isConnected ? (
        <Flex direction={"column"} width={"100%"}>
          {isOwner ? (
            <>
              <VotingStatus />
              <Registration />
            </>
          ) : null}

          {isVoter ? (
            <>
              <AddProposalComponent />
              <VoteProposal />
              <Winner />
            </>
          ) : null}
        </Flex>
      ) : (
        <Text>Please connect your wallet</Text>
      )}
    </Flex>
  );
};

export default Voting;
