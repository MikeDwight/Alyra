"use client"
import React, { useState, useRef } from 'react'
import { Flex, Heading, Input, Text, Button } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'


import Contract from '@/config/Ticketing.json'

const Ticketing = () => {

    // Adresse du contrat
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

    // WAGMI
    const { isConnected } = useAccount()

    // STATES
    const [store, setStore] = useState(0)
    const [stored, setStored] = useState(0)

    const inputRef = useRef(null);



    // COMPORTEMENT

    const storeNumber = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "store",
                args: [store],
            })
            await writeContract(request)
            inputRef.current.value = ''; // Réinitialiser la valeur de l'input à une chaîne vide
        } catch (err) {
            console.log(err);
        }
    }

    const getNumber = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "get", 
            });
            setStored(data)
        } catch (err) {
            console.log(err.message);
        }
    };


    // AFFICHAGE
  return (
    <Flex justifyContent={'center'}>
    <Flex width={"80%"} padding={'50px'} marginTop={'25px'} border={'1px solid #000'} borderRadius={'5px'} justifyContent={'center'}>
        {isConnected? 
            (
                <Flex w={'100%'} direction={'column'}>
                    <Heading textAlign={'center'} as={'h1'} size={'xl'}>Hello World !</Heading>
                        <Flex justifyContent={'space-between'} m={'10px'}>
                            <Input ref={inputRef} placeholder='Ajouter un nombre' onChange={e => setStore(e.target.value)}></Input>
                            <Button onClick={() => storeNumber()}>Ajouter</Button>
                        </Flex>
                        <Flex justifyContent={'space-between'} m={'10px'}>
                            <Button onClick={() => getNumber()}>Voir le nombre stocké :</Button>
                            <Text fontSize={'25px'} textAlign={'center'}>{stored.toString()}</Text>
                        </Flex>
                        
                </Flex>
                
            )
        : (
            (<Heading as={'h1'} size={'xl'}>Please connect your wallet</Heading>)
        )}
        
    </Flex>
    </Flex>

  )
}

export default Ticketing