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
import { useContext, useState } from "react";
import {
  VotingContractContext,
  VotingContractProvider,
} from "../providers/VotingContractProvider";

const Voting = () => {
  // Wagmi
  const { isConnected } = useAccount();

  // Context
  const { isOwner, isVoter, isworkflowStatusStep } = useContext(
    VotingContractContext
  );

  const [status, setStatus] = useState(null);

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

  console.log("Voting : address isVoter ", isVoter);

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
          <Alert status="info" justifyContent={"center"} mb={"30px"}>
            <AlertIcon />
            <AlertTitle color={"#000000"}>{getStatusText(status)}</AlertTitle>
          </Alert>
          {isOwner ? (
            <>
              <VotingStatus />
              {isworkflowStatusStep === 0 && <Registration />}
            </>
          ) : null}

          {isVoter ? (
            <>
              {isworkflowStatusStep === 0 && (
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Text>Stay Owner start Proposal session</Text>
                </Flex>
              )}

              {isworkflowStatusStep === 1 && <AddProposalComponent />}

              {isworkflowStatusStep === 2 && (
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Text>Stay owner start voting session</Text>
                </Flex>
              )}
              {isworkflowStatusStep === 3 && <VoteProposal />}
              {isworkflowStatusStep === 4 && <Winner />}
            </>
          ) : (
            <Flex justifyContent={"center"} alignItems={"center"}>
              <Text fontSize="2xl">You are not register at voter</Text>
            </Flex>
          )}
        </Flex>
      ) : (
        <Text>Please connect your wallet</Text>
      )}
    </Flex>
  );
};

export default Voting;
