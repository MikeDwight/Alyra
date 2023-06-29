"use client"
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Flex, flexbox } from '@chakra-ui/react'

const Header = () => {
  return (
    <Flex justifyContent={'flex-end'} p={'25px'}>
        <ConnectButton />
    </Flex>
    
  )
}

export default Header