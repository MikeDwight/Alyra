import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { readContract } from "@wagmi/core";
import Contract from "../../backend/artifacts/contracts/Voting.sol/Voting.json";

export default function Winner() {
  const [winner, setWinner] = useState(0);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // Récupere le gagnant
  const addWinner = async () => {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "winningProposalID",
      });
      setWinner(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex
      direction={"column"}
      m={"auto"}
      p={"50px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Heading as={"h1"} size={"xl"}>
        Voir le gagnant
      </Heading>
      <Flex m={"15px"} direction={"column"}>
        <Button onClick={() => addWinner()}>Gagnant ?</Button>
        <Text>Gagnant : {winner.toString()}</Text>
      </Flex>
    </Flex>
  );
}
