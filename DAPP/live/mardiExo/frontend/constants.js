export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ABI = [
  {
    "inputs": [],
    "name": "Bank__NotEnoughEthersOnTheSC",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Bank__NotEnoughFundsProvided",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Bank__WithdrawFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sendEthers",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_myNumber",
        "type": "uint256"
      }
    ],
    "name": "setMyNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];