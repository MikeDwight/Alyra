"use client";

import { useState, useEffect } from "react";

// Ethers
import { ethers } from "ethers";

// Chakra-ui
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
  AlertDescription,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Accordion,
  Box,
  AccordionIcon,
} from "@chakra-ui/react";

// Wagmi
import { useAccount } from "wagmi";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";

// Contract
import Contract from "../config/Voting.json";
// VIEM (pour les events)
import {
  createPublicClient,
  http,
  parseAbiItem,
  watchContractEvent,
} from "viem";
import { hardhat } from "viem/chains";

// UUIDV4
import { v4 as uuidv4 } from "uuid";
import VotingStatus from "./VotingStatus";

const Registration = () => {
  // Create client for Viem
  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  // Wagmi
  const { isConnected } = useAccount();

  // Chakra-ui Toast
  const toast = useToast();

  // STATES
  const [addVoter, setAddVoter] = useState(null);
  const [getVoter, setGetVoter] = useState(null);
  const [data, setData] = useState(null);
  const [whiteListEvent, setWhiteListEvent] = useState([]);

  // CONTRACT ADDRESS
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // Fonction pour ajouter un voter
  const addOneVoter = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "addVoter",
        args: [addVoter],
      });
      await writeContract(request);

      await getEvents();

      toast({
        title: "Succès !",
        description: `Vous avez ajouté ${addVoter} à la liste des voters`,
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

  // Vérifier les infos d'un voter
  const getInfoVoter = async () => {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: "getVoter",
        args: [getVoter],
        account: getVoter,
      });
      setData(data);
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Récupérer les event
  const getEvents = async () => {
    // Récupérer les events d'ajout de voter
    const addVoterLogs = await client.getLogs({
      event: parseAbiItem("event VoterRegistered(address voterAddress)"),
      fromBlock: 0n,
      toBlock: "latest",
    });

    // Extraire les adresses whitelistées des logs
    const whitelistAddresses = addVoterLogs.map((log) => log.args.voterAddress);
    setWhiteListEvent(whitelistAddresses);

    // Récupérer les events de session
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

  return (
    <Flex direction="column" align="center" justify="center">
      <Heading mb={6}>Ajouter un voter</Heading>

      <Flex align="center" mb={4}>
        <Text mr={2}>Adresse du votant :</Text>
        <Input
          placeholder="Adresse Ethereum"
          value={addVoter}
          onChange={(e) => setAddVoter(e.target.value)}
          mr={2}
        />
        <Button colorScheme="teal" onClick={addOneVoter}>
          Ajouter
        </Button>
      </Flex>

      <Flex align="center">
        <Text mr={2}>Adresse du votant :</Text>
        <Input
          placeholder="Adresse Ethereum"
          value={getVoter}
          onChange={(e) => setGetVoter(e.target.value)}
          mr={2}
        />
        <Button colorScheme="teal" onClick={getInfoVoter}>
          Information
        </Button>
      </Flex>
      <Accordion
        defaultIndex={[]}
        allowMultiple
        border={"1px #3A4454 solid"}
        borderRadius={"15px"}
        bg={"#F5DDDD"}
        color={"#3A4454"}
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {whiteListEvent.length > 0 ? (
                  <Flex key={uuidv4()} direction={"column"}>
                    {whiteListEvent.length === 1 ? (
                      <Text>
                        Adresse enregistrée ({whiteListEvent.length}) :
                      </Text>
                    ) : (
                      <Text>
                        Adresses enregistrées ({whiteListEvent.length}) :
                      </Text>
                    )}
                  </Flex>
                ) : (
                  <Text>Aucune adresse ajoutée aux voters</Text>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {Array.from(new Set(whiteListEvent)).map((address) => (
              <span key={address}>
                - {address}
                <br />
              </span>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {data && (
        <Flex direction="column" align="center" mt={4}>
          <Alert status="info" variant="left-accent">
            <AlertIcon />
            <Flex direction="column">
              <AlertTitle>Informations sur l'électeur {getVoter}</AlertTitle>
              <AlertDescription>
                <Text>Adresse : {data[0]}</Text>
                <Text>Vote : {data[1] ? "Oui" : "Non"}</Text>
              </AlertDescription>
            </Flex>
          </Alert>
        </Flex>
      )}
    </Flex>
  );
};

export default Registration;

{
  /* <Heading as={"h1"} size={"xl"}>
Ajouter un voter
</Heading>
<Flex m={"15px"}>
<Input
  placeholder="Entrez une adresse"
  onChange={(e) => setAddVoter(e.target.value)}
></Input>
<Button onClick={() => addOneVoter()}>Ajouter</Button>
</Flex>
<Text>
Adresse enregistrée :
{whiteListEvent.length > 0 ? (
  Array.from(new Set(whiteListEvent)).map((address) => (
    <Flex key={uuidv4()}>
      <Text>{address}</Text>
    </Flex>
  ))
) : (
  <Text>Aucune adresse ajoutée aux voters</Text>
)}
</Text>
<Heading as={"h1"} size={"xl"}>
Obtenir les informations d'un voter
</Heading>
<Flex m={"15px"}>
<Input
  placeholder="Entrez une adresse"
  onChange={(e) => setGetVoter(e.target.value)}
></Input>
<Button onClick={() => getInfoVoter()}>Information</Button>
</Flex>
<Text>
{data ? (
  <>
    <li>
      Est-il enregistré ? {data["isRegistered"] ? "Oui" : "Non"}
    </li>
    <li>A-t-il voté ? {data["hasVoted"] ? "Oui" : "Non"}</li>
    <li>
      ID de la proposition votée :{" "}
      {data["votedProposalId"].toString()}
    </li>
  </>
) : (
  ""
)}
</Text> */
}
