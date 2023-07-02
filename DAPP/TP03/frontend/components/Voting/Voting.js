"use client"

import { useState, useEffect } from 'react'

// Ethers
import { ethers } from 'ethers'

// Chakra-ui
import { Box, Flex, Text, Heading, Input, Button, useToast, Alert, AlertIcon, AlertTitle, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, } from '@chakra-ui/react'

// Wagmi
import { useAccount } from 'wagmi'
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'

// Contract
import Contract from '../../../backend/artifacts/contracts/Voting.sol/Voting.json'
// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199

// VIEM (pour les events)
import { createPublicClient, http, parseAbiItem, watchContractEvent } from 'viem'
import { hardhat } from 'viem/chains'


// UUIDV4
import { v4 as uuidv4 } from 'uuid';





const Voting = () => {  

    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport: http(),
    })

    // Wagmi
    const { isConnected } = useAccount()

    // Chakra-ui Toast
    const toast = useToast()

    // STATES
    const [addVoter, setAddVoter] = useState(null)
    const [getVoter, setGetVoter] = useState(null)
    const [data, setData] = useState(null)
    const [whiteListEvent, setWhiteListEvent] = useState([])
    const [status, setStatus] = useState(null)
    const [addProposal, setAddProposal] = useState(null)
    const [getProposal, setGetProposal] = useState(null)
    const [nbProposal, setNbProposal] = useState(0)
    const [dataProposal, setDataProposal] = useState(null)
    const [addVote, setAddVote] = useState(null)
    const [nbVote, setNbVote] = useState(0)
    const [winner, setWinner] = useState(0)

    // CONTRACT ADDRESS
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS


    // COMPORTEMENT

    // Fonction pour ajouter un voter
    const addOneVoter = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "addVoter",
                args: [addVoter],
            })
            await writeContract(request)

            await getEvents()            

            toast({
                title: 'Succès !',
                description: `Vous avez ajouté ${addVoter} à la liste des voters`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error!',
                description: 'An error occured.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    // Vérifier les infos d'un voter
    const getInfoVoter = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getVoter",
                args: [getVoter],
                account: getVoter,           
            })
            setData(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    

    // Récupérer les event
    const getEvents = async () => {
        // Récupérer les events d'ajout de voter
        const addVoterLogs = await client.getLogs({
          event: parseAbiItem('event VoterRegistered(address voterAddress)'),
          fromBlock: 0n,
          toBlock: 'latest'
        });
      
        // Extraire les adresses whitelistées des logs
        const whitelistAddresses = addVoterLogs.map(log => log.args.voterAddress);
        setWhiteListEvent(whitelistAddresses);

        // Récupérer les events d'ajout de proposal
        const addProposalLogs = await client.getLogs({
            event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
            fromBlock: 0n,
            toBlock: 'latest'
          });
        
          // Extraire les adresses whitelistées des logs
          const proposals = addProposalLogs.map(log => log.args);


          // Affiche le nombre de proposition
        setNbProposal(proposals.length);
       
        

        // Récupérer les events de session
        client.watchContractEvent({
            address: contractAddress,
            abi: Contract.abi,
            eventName: "WorkflowStatusChange",
            onLogs: logs => setStatus(logs[0].args.newStatus)
          });
      }

    useEffect(() => {
        getEvents();
      }, []);


      // Fonction pour ouvrir la session de proposal
    const startProposal = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "startProposalsRegistering",
            })
            await writeContract(request)

            await getEvents()            

            toast({
                title: 'Succès !',
                description: `Vous avez ouvert la session de proposition`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error!',
                description: 'An error occured.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    

    // Fonction pour ajouter une proposition
    const addOneProposal = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "addProposal",
                args: [addProposal],
            })
            await writeContract(request)

            setArrayProposal(prevArray => [...prevArray, addProposal]);
            

           
            await getEvents()  
            
            

            toast({
                title: 'Succès !',
                description: `Vous avez ajouté ${addProposal} à la liste des propositions`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error!',
                description: 'An error occured.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    

    // Vérifier les infos d'une propositon
    const getInfoProposal = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getOneProposal",
                args: [getProposal],
                          
            })
            setDataProposal(data.description)
        } catch (err) {
            console.log(err.message)
        }
    }

    // Ferme la session de proposition
    
        const endProposal = async() => {
            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "endProposalsRegistering",
                })
                await writeContract(request)
    
                await getEvents()            
    
                toast({
                    title: 'Succès !',
                    description: `Vous avez fermé la session de proposition`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } catch (err) {
                console.log(err);
                toast({
                    title: 'Error!',
                    description: 'An error occured.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        }

        // Ouvre la session de vote
        const startVote = async() => {
            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "startVotingSession",
                })
                await writeContract(request)
    
                await getEvents()            
    
                toast({
                    title: 'Succès !',
                    description: `Vous avez ouvert la session de Vote`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } catch (err) {
                console.log(err);
                toast({
                    title: 'Error!',
                    description: 'An error occured.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        }

        // Fonction pour ajouter un vote
    const addOneVote = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "setVote",
                args: [addVote],
            })
            await writeContract(request)

            setNbVote(nbVote + 1)
    

            toast({
                title: 'Succès !',
                description: `Vous avez voté`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error!',
                description: 'An error occured.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    // Ferme la session de vote
    
    const endVote = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "endVotingSession",
            })
            await writeContract(request)

            await getEvents()            

            toast({
                title: 'Succès !',
                description: `Vous avez fermé la session de vote`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error!',
                description: 'An error occured.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    // Ouvre la session de tri
    const startTally = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "tallyVotes",
            })
            await writeContract(request)

            await getEvents()            

            toast({
                title: 'Succès !',
                description: `Vous avez ouvert la session de tri`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error!',
                description: 'An error occured.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    // Récupere le gagnant 
    
        const addWinnerId = async() => {
            try {
                const data = await readContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: 'winningProposalID',
                  }); 
                    setWinner(data)    
            } catch (err) {
                console.log(err);
            }
        }
        const addWinnerDesc = async() => {
            try {
                const data = await readContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "getOneProposal",
                    args: [winner],
                              
                })
                setDataProposal(data.description)    

            } catch (err) {
                console.log(err);
            }
        }

        const addWinner = async() => { 
            await addWinnerId()
            await addWinnerDesc()
        }
   

        
   

    
   


    // AFFICHAGE
  return (
    <Flex w={'60%'} bg={'#6B4E71'} color={'#F5DDDD'} m={'auto'} p={'50px'}  justifyContent={'center'} alignItems={'center'}>
        {isConnected ? (
            <Flex direction={'column'} width={'100%'}>
                <Alert status='info' justifyContent={'center'} mb={'30px'}>
                <AlertIcon />
                <AlertTitle color={'#000000'}>
                {status === 5 ? (
                        <Text>Session de depouillement</Text>
                        ) : status === 1 ? (
                        <Text>Session de proposition</Text>
                        ) : status === 2 ? (
                        <Text>Session de proposition fermé</Text>
                        ) : status === 3 ? (
                        <Text>Session de vote</Text>
                        ) : status === 4 ? (
                        <Text>Session de vote fermée</Text>
                        ) : (
                        <Text>Enregistrement des voters</Text>
                        )}
                </AlertTitle>
                </Alert>
                <Heading as={'h1'} size={'xl'}>
                    Ajouter un voter
                </Heading>
                <Flex m={'15px'}>
                    <Input placeholder='Entrez une adresse' onChange={e => setAddVoter(e.target.value)}></Input>
                    <Button onClick={() => addOneVoter()}>Ajouter</Button>
                </Flex>
                <Accordion defaultIndex={[0]} allowMultiple>
                    <AccordionItem>
                        <h2>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                            {whiteListEvent.length > 0 ? (
                        <Flex key={uuidv4()} direction={'column'}>
                        {whiteListEvent.length === 1 ? (
                            <Text>Adresse enregistrée ({whiteListEvent.length}) :</Text>
                        ) : (
                            <Text>Adresses enregistrées ({whiteListEvent.length}) :</Text>
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
                            <span key={address}>- {address}<br /></span>
                        ))}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Heading as={'h1'} size={'xl'}>
                    Obtenir les informations d'un voter
                </Heading>
                <Flex m={'15px'}>
                    <Input placeholder='Entrez une adresse' onChange={e => setGetVoter(e.target.value)}></Input>
                    <Button onClick={() => getInfoVoter()}>Information</Button>
                </Flex>
                <Text>
                    {data ? (
                        <>
                        <li>
                            Est-il enregistré ? {data['isRegistered'] ? 'Oui' : 'Non'}
                        </li>
                        <li>
                            A-t-il voté ? {data['hasVoted'] ? 'Oui' : 'Non'}
                        </li>
                        {data['hasVoted'] ? (
                            <li>
                            ID de la proposition votée : {data['votedProposalId'].toString()}
                            </li>
                        ) : ''}
                        </>
                    ) : (
                        ''
                    )}
                </Text>
                <Flex mt={'30px'} w={'100%'} justifyContent={'center'}>
                    <Button onClick={() => startProposal()}>Ouvrir la session de proposition</Button>
                </Flex>
                <Heading as={'h1'} size={'xl'}>
                    Ajouter une proposition
                </Heading>
                <Flex m={'15px'}>
                    <Input placeholder='Entrez une proposition' onChange={e => setAddProposal(e.target.value)}></Input>
                    <Button onClick={() => addOneProposal()}>Ajouter</Button>

                </Flex>
                <Heading as={'h1'} size={'xl'}>
                    Trouver une proposition
                </Heading>
                <Flex m={'15px'}>
                    <Input placeholder="Entrez l'id de la proposition" onChange={e => setGetProposal(e.target.value)}></Input>
                    <Button onClick={() => getInfoProposal()}>Voir</Button>
                </Flex>
                <Text>
                Proposition : {dataProposal}<br />
                Nombre de proposition : {nbProposal}
                </Text>
                <Flex mt={'30px'} w={'100%'} justifyContent={'center'}>
                    <Button onClick={() => endProposal()}>Fermer la session de proposition</Button>
                </Flex>
                <Flex mt={'30px'} w={'100%'} justifyContent={'center'}>
                    <Button onClick={() => startVote()}>Ouvrir la session de vote</Button>
                </Flex>
                <Heading as={'h1'} size={'xl'}>
                   Voter pour une proposition
                </Heading>
                <Flex m={'15px'}>
                    <Input placeholder='Entrez un vote' onChange={e => setAddVote(e.target.value)}></Input>
                    <Button onClick={() => addOneVote()}>Ajouter</Button>
                    
                </Flex>
                <Text>Nombre de vote : {nbVote}</Text>
                <Flex mt={'30px'} w={'100%'} justifyContent={'center'}>
                    <Button onClick={() => endVote()}>Fermer la session de vote</Button>
                </Flex>
                <Flex mt={'30px'} w={'100%'} justifyContent={'center'}>
                    <Button onClick={() => startTally()}>Ouvrir la session de tri</Button>
                </Flex>
                <Heading as={'h1'} size={'xl'}>
                Voir le gagnant
                </Heading>
                <Flex m={'15px'} justifyContent={'center'} direction={'column'}>
                    <Button onClick={() => addWinner()}>Gagnant ?</Button>
                    <Text textAlign={'center'}> 
                    {winner.toString() == 0 ? ("") : (<Text>{winner.toString()} - {dataProposal}</Text>)}
                    </Text>
                </Flex>
            </Flex>
        ) : (
            <Text>Please connect your wallet</Text>
        )} 
    </Flex>
  )
}

export default Voting