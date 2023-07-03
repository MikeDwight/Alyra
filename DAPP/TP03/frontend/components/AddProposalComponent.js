import { useState, useEffect } from "react";
import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";

// CONTRACT ADDRESS
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const AddProposalComponent = () => {
  const [addProposal, setAddProposal] = useState(null);
  const [getProposal, setGetProposal] = useState(null);
  const [dataProposal, setDataProposal] = useState(null);
  // Fonction pour ajouter une proposition
  const addOneProposal = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "addProposal",
        args: [addProposal],
      });
      await writeContract(request);

      toast({
        title: "Succès !",
        description: `Vous avez ajouté ${addProposal} à la liste des propositions`,
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

  // Vérifier les infos d'une propositon
  const getInfoProposal = async () => {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "getOneProposal",
        args: [getProposal],
      });
      setDataProposal(data.description);
    } catch (err) {
      console.log(err.message);
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
        Ajouter une proposition
      </Heading>
      <Flex m={"15px"}>
        <Input
          placeholder="Entrez une proposition"
          onChange={(e) => setAddProposal(e.target.value)}
        ></Input>
        <Button onClick={() => addOneProposal()}>Ajouter</Button>
      </Flex>
      <Heading as={"h1"} size={"xl"}>
        Trouver une proposition
      </Heading>
      <Flex m={"15px"}>
        <Input
          placeholder="Entrez l'id de la proposition"
          onChange={(e) => setGetProposal(e.target.value)}
        ></Input>
        <Button onClick={() => getInfoProposal()}>Voir</Button>
      </Flex>
      <Text>Proposition : {dataProposal}</Text>
    </Flex>
  );
};

export default AddProposalComponent;
