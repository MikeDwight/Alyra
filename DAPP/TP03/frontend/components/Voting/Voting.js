"use client";

// Chakra-ui
import { Flex, Text } from "@chakra-ui/react";

// Wagmi
import { useAccount } from "wagmi";

// Components

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
