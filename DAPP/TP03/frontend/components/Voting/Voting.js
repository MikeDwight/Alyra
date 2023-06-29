"use client"

import { useState, useEffect } from 'react'

// Chakra-ui
import { Flex, Text, Heading, Input, Button, useToast } from '@chakra-ui/react'

// Wagmi
import { useAccount } from 'wagmi'
import { prepareWriteContract, writeContract } from '@wagmi/core'

// Contract
import Contract from '../../../backend/artifacts/contracts/Voting.sol/Voting.json'





const Voting = () => {  

    // Wagmi
    const { isConnected } = useAccount()

    // Chakra-ui Toast
    const toast = useToast()

    // STATES
    const [addVoter, setAddVoter] = useState(null)

    // CONTRACT ADDRESS
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS


    // COMPORTEMENT
    const addOneVoter = async() => {
        try {
            console.log(addVoter);  
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


    // AFFICHAGE
  return (
    <Flex w={'60%'} bg={'#6B4E71'} m={'auto'} p={'50px'}  justifyContent={'center'} alignItems={'center'}>
        {isConnected ? (
            <Flex direction={'column'} width={'100%'}>
                <Heading as={'h1'} size={'xl'}>
                    Ajouter un voter
                </Heading>
                <Flex m={'15px'}>
                    <Input placeholder='Entrez une adresse' onChange={e => setAddVoter(e.target.value)}></Input>
                    <Button onClick={() => addOneVoter()}>Ajouter</Button>
                </Flex>
            </Flex>
        ) : (
            <Text>Please connect your wallet</Text>
        )} 
    </Flex>
  )
}

export default Voting