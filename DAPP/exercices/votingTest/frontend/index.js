import { ethers } from './ethers.min.js'
import { abi, contractAddress } from './constants.js'

const connectionButton = document.getElementById('connectionButton')
const adressToWhitelist = document.getElementById('adressToWhitelist')
const whitelistButton = document.getElementById('whitelistButton')
const adressToCheck = document.getElementById('adressToCheck')
const checkButton = document.getElementById('checkButton')
const voterInfo = document.getElementById('voterInfo')
const registeringVoters = document.getElementById('registeringVoters')
const startProposalPhase = document.getElementById('startProposalPhase')
const proposalToAdd = document.getElementById('proposalToAdd')
const addProposalButton = document.getElementById('addProposalButton')
const proposalToCheck = document.getElementById('proposalToCheck')
const proposalCheckButton = document.getElementById('proposalCheckButton')
const proposalInfo = document.getElementById('proposalInfo')
const endProposalPhase = document.getElementById('endProposalPhase')
const startVotingPhase = document.getElementById('startVotingPhase')
const idToVote = document.getElementById('idToVote')
const voteButton = document.getElementById('voteButton')
const endVotePhase = document.getElementById('endVotePhase')
const startTallyPhase = document.getElementById('startTallyPhase')
const winnerButton = document.getElementById('winnerButton')
const winner = document.getElementById('winner')


let connectedAccount

connectionButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== 'undefined') {
        const resultAccount = await window.ethereum.request({ method: 'eth_requestAccounts' })  
        connectedAccount = ethers.utils.getAddress(resultAccount[0])
        connectionButton.innerHTML = "Connected with " + connectedAccount.substring(0, 4) + "..." + connectedAccount.substring(connectedAccount.length - 4)
    }
    else {
        connectionButton.innerHTML = "Please install Metamask!"
    }
})

whitelistButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let addressAdded = adressToWhitelist.value
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const addVoter = await contract.addVoter(addressAdded)
        }
        catch(e) {
            console.log(e)
        }
    }
})

checkButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let addressAdded = adressToCheck.value;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, abi, provider);
            const getVoter = await contract.getVoter(addressAdded);
            const isRegistered = getVoter[0];
            const hasVoted = getVoter[1];
            const proposalID = getVoter[2].toNumber();
            voterInfo.innerHTML = `<br>Does he registered : ${isRegistered}<br>Did he votes : ${hasVoted}<br>For what proposal he voted for : ${proposalID}` ; 
        }
        catch(e) {
            console.log(e);
        }
    }
});

registeringVoters.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const startRegisteringVoters = await contract.startRegisteringVoters();
            registeringVoters.innerHTML = `Session de d'enregistrement des voters ouverte` ; 
        }
        catch(e) {
            console.log(e);
        }
    }
})

startProposalPhase.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const startProposal = await contract.startProposalsRegistering();
            startProposalPhase.innerHTML = `Session de proposition ouverte` ; 
        }
        catch(e) {
            console.log(e);
        }
    }
})

addProposalButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let proposal = proposalToAdd.value
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const addProposal = await contract.addProposal(proposal);
        }
        catch(e) {
            console.log(e);
        }
    }
})

proposalCheckButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let proposalID = proposalToCheck.value;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, abi, provider);
            const getOneProposal = await contract.getOneProposal(proposalID);
            const proposalDescription = getOneProposal[0]
            proposalInfo.innerHTML = getOneProposal[0] 
        }
        catch(e) {
            console.log(e);
        }
    }
})

endProposalPhase.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const endProposal = await contract.endProposalsRegistering();
            endProposalPhase.innerHTML = `Session de proposition fermée` ; 
        }
        catch(e) {
            console.log(e);
        }
    }
})

startVotingPhase.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const startVotingSession = await contract.startVotingSession();
            startVotingPhase.innerHTML = `Session de vote ouverte` ; 
        }
        catch(e) {
            console.log(e);
        }
    }
})

voteButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let vote = idToVote.value
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const setVote = await contract.setVote(vote);
        }
        catch(e) {
            console.log(e);
        }
    }
})

endVotePhase.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const endVotingSession = await contract.endVotingSession();
            endVotePhase.innerHTML = `Session de vote fermée` ; 
        }
        catch(e) {
            console.log(e);
        }
    }
})

startTallyPhase.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const startTallySession = await contract.tallyVotes();
            startTallySession.innerHTML = `Session de tri ouverte` ; 
        }
        catch(e) {
            console.log(e);
        }
    }
})

winnerButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, abi, provider);
            const getWinner = await contract.winningProposalID();
            winner.innerHTML = getWinner 
        }
        catch(e) {
            console.log(e);
        }
    }
})

// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199