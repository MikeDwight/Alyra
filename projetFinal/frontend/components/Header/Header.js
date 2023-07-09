"use client"
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Flex, Heading, Divider } from '@chakra-ui/react'

const Header = () => {
  return (
    <main>
      <Flex justifyContent={'space-between'} p={'25px'}>
        <Heading as={'h1'} size={'xl'}>Ticketing</Heading>
        <ConnectButton />
      </Flex>
      <Divider />
    
    </main>
    
    
    
  )
}

export default Header