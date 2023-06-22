import { ethers } from './ethers.min.js'
import { ABI, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const balanceButton = document.getElementById('balanceButton')
const balance = document.getElementById('balance')
const amountDeposited = document.getElementById('amountDeposited')
const deposit = document.getElementById('depositButton')
const amountWithdrew = document.getElementById('amountWithdrew')
const withdraw = document.getElementById('withdrawButton')

let connectedAccount

// What happens when the user clicks on the connect button
connectButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== 'undefined') {
        const resultAccount = await window.ethereum.request({ method: 'eth_requestAccounts' })  
        connectedAccount = ethers.utils.getAddress(resultAccount[0])
        connectButton.innerHTML = "Connected with " + connectedAccount.substring(0, 4) + "..." + connectedAccount.substring(connectedAccount.length - 4)
    }
    else {
        connectButton.innerHTML = "Please install Metamask!"
    }
})



balanceButton.addEventListener('click', async function() {
    if (typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, ABI, provider);
            const balanceInWei = await contract.getBalance();
            const balanceInEth = ethers.utils.formatEther(balanceInWei);
            balance.innerHTML = ` ${balanceInEth} ETH`;
        } catch(e) {
            console.log(e);
        }
    }
});

depositButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let ethSent = amountDeposited.value;
            console.log(ethSent)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            const transaction = await contract.sendEthers({ value: ethers.utils.parseEther(ethSent) });
            await transaction.wait();
        }
        catch(e) {
            console.error('Error:', e);
        }
    }
});


withdrawButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let ethWithdrew = amountWithdrew.value;
            console.log(ethWithdrew)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            const transaction = await contract.withdraw(ethers.utils.parseEther(ethWithdrew));
            await transaction.wait();
        }
        catch(e) {
            console.error('Error:', e);
        }
    }
});









