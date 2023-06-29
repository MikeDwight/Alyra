"use client"

import { useState, useEffect } from 'react'

// Chakra-ui
import { Flex, Text, Heading, Input, Button, useToast } from '@chakra-ui/react'

// Wagmi
import { useAccount } from 'wagmi'
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'

// Contract
import Contract from '../../../backend/artifacts/contracts/Voting.sol/Voting.json'
// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199





const Voting = () => {  

    // Wagmi
    const { isConnected } = useAccount()

    // Chakra-ui Toast
    const toast = useToast()

    // STATES
    const [addVoter, setAddVoter] = useState(null)
    const [getVoter, setGetVoter] = useState(null)
    const [data, setData] = useState(null)

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

    const stringifyData = data => {
        if (data) {
          // Convertir les BigInts en chaînes de caractères
          const serializedData = {
            ...data,
            votedProposalId: data.votedProposalId.toString()
          };
          return JSON.stringify(serializedData);
        }
        return '';
      };

   


    // AFFICHAGE
  return (
    <Flex w={'60%'} bg={'#6B4E71'} color={'#F5DDDD'} m={'auto'} p={'50px'}  justifyContent={'center'} alignItems={'center'}>
        {isConnected ? (
            <Flex direction={'column'} width={'100%'}>
                <Heading as={'h1'} size={'xl'}>
                    Ajouter un voter
                </Heading>
                <Flex m={'15px'}>
                    <Input placeholder='Entrez une adresse' onChange={e => setAddVoter(e.target.value)}></Input>
                    <Button onClick={() => addOneVoter()}>Ajouter</Button>
                </Flex>
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
                        <li>
                            ID de la proposition votée : {data['votedProposalId']}
                        </li>
                        </>
                    ) : (
                        ''
                    )}
                </Text>


            </Flex>
        ) : (
            <Text>Please connect your wallet</Text>
        )} 
    </Flex>
  )
}

export default Voting