import { createContext, useMemo, useState } from "react";
import useVotingContract from "../hooks/useVotingContract";

//création du context
export const VotingContractContext = createContext();

export const VotingContractProvider = ({ children }) => {
  const {
    owner,
    setOwner,
    isOwner,
    isVoter,
    setIsVoter,
    contract,
    isworkflowStatusStep,
    setworkflowStatusStep,
  } = useVotingContract();

  const values = useMemo(
    () => ({
      owner,
      setOwner,
      isOwner,
      isVoter,
      setIsVoter,
      contract,
      isworkflowStatusStep,
      setworkflowStatusStep,
    }),
    [
      owner,
      setOwner,
      isOwner,
      isVoter,
      setIsVoter,
      isworkflowStatusStep,
      setworkflowStatusStep,
      contract,
    ]
  );

  // Contexts
  return (
    <VotingContractContext.Provider value={values}>
      {children}
    </VotingContractContext.Provider>
  );
};
