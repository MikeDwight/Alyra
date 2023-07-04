import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";

// CONTRACT ADDRESS
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Wagmi
import { useAccount } from "wagmi";
import {
  prepareWriteContract,
  writeContract,
  readContract,
  watchContractEvent,
} from "@wagmi/core";

import Contract from "../config/Voting.json";

const AddProposalComponent = () => {
  const [addProposal, setAddProposal] = useState(null);
  const [getProposal, setGetProposal] = useState(null);
  const [dataProposal, setDataProposal] = useState(null);

  const [proposalList, setProposalList] = useState([]);
  // Fonction pour ajouter une proposition
  const toast = useToast();
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

      await displayAllProposals();
      await getEvents();

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

  const displayAllProposals = async () => {
    try {
      const proposalCount = nbProposal; // Remplacez par le nombre total de propositions
      const proposals = [];

      for (let i = 1; i <= proposalCount; i++) {
        const data = await readContract({
          address: contractAddress,
          abi: Contract.abi,
          functionName: "getOneProposal",
          args: [i],
        });

        const proposalInfo = {
          id: i,
          description: data.description,
        };

        proposals.push(proposalInfo);
      }

      setProposalList(proposals);
    } catch (err) {
      console.log(err.message);
    }
  };

  watchContractEvent(
    {
      address: contractAddress,
      abi: Contract.abi,
      eventName: "ProposalRegistered",
    },
    (log) => {
      displayAllProposals();
    }
  );

  // Récupérer les event
  const getEvents = async () => {
    // Récupérer les events d'ajout de voter
    const addVoterLogs = await client.getLogs({
      address: contractAddress,
      event: parseAbiItem("event VoterRegistered(address voterAddress)"),
      fromBlock:
        BigInt(Number(await client.getBlockNumber()) - 15000) < 0
          ? 0n
          : BigInt(Number(await client.getBlockNumber()) - 15000),
    });

    console.log(addVoterLogs);

    // Extraire les adresses whitelistées des logs
    const whitelistAddresses = addVoterLogs.map((log) => log.args.voterAddress);
    setWhiteListEvent(whitelistAddresses);

    // Récupérer les events d'ajout de proposal
    const addProposalLogs = await client.getLogs({
      address: contractAddress,
      event: parseAbiItem("event ProposalRegistered(uint proposalId)"),
      fromBlock:
        BigInt(Number(await client.getBlockNumber()) - 15000) < 0
          ? 0n
          : BigInt(Number(await client.getBlockNumber()) - 15000),
    });

    // Extraire les adresses whitelistées des logs
    const proposals = addProposalLogs.map((log) => log.args);

    // Affiche le nombre de proposition
    setNbProposal(proposals.length);

    await displayAllProposals();

    // Récupérer les events de session
    client.watchContractEvent({
      address: contractAddress,
      abi: Contract.abi,
      eventName: "WorkflowStatusChange",
      onLogs: (logs) => setStatus(logs[0].args.newStatus),
    });
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
                List Proposals:
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {proposalList.map((proposal) => (
              <div key={proposal.id}>
                {proposal.id} : {proposal.description}
              </div>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

export default AddProposalComponent;
