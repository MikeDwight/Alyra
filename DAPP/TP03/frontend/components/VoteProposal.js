import { Button, Flex, Heading, Input } from "@chakra-ui/react";
import { useState } from "react";
// CONTRACT ADDRESS
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function VoteProposal() {
  const [addVote, setAddVote] = useState(null);
  // Fonction pour ajouter un vote
  const addOneVote = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "setVote",
        args: [addVote],
      });
      await writeContract(request);

      toast({
        title: "Succès !",
        description: `Vous avez voté`,
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
  return (
    <Flex
      direction={"column"}
      m={"auto"}
      p={"50px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Heading as={"h1"} size={"xl"}>
        Voter pour une proposition
      </Heading>
      <Flex m={"15px"}>
        <Input
          placeholder="Entrez un vote"
          onChange={(e) => setAddVote(e.target.value)}
        ></Input>
        <Button onClick={() => addOneVote()}>Ajouter</Button>
      </Flex>
    </Flex>
  );
}
