"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { GridItem, Heading } from "@chakra-ui/react";

const Header = () => {
  return (
    <GridItem
      pl="2"
      bg="orange.300"
      area={"header"}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="4"
      marginBottom={2}
    >
      <Heading>Voting DAO</Heading>
      <ConnectButton />
    </GridItem>
  );
};

export default Header;
