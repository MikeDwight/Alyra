const Web3 = require('web3'); // import web3
const rpcUrl = "https://goerli.infura.io/v3/573088ef385f4f6f81e010a99a5c712d" // L'URL RPC est l'adresse à laquelle se connecter pour interagir avec un nœud Ethereum.
const web3 = new Web3(rpcUrl); // à partir de notre RPC, viens récupérer une instance de web3

// web3.eth.getBalance("0x4b984D560387C22f399B76a38edabFE52903E599", (err, wei) => {
//     const balance = web3.utils.fromWei(wei, 'ether')
//     console.log(balance);
// });

const ABI = [ // ABI du contrat à joindre (REMIX)
	{
		"inputs": [],
		"name": "get",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			}
		],
		"name": "set",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const address = "0x1f9C83F7311c1b0AD188E9925E2705a3B60c4b1d"; // Adresse du contrat
const simpleStorage = new web3.eth.Contract(ABI, address); // Instance du contrat 

simpleStorage.methods.get().call((err, data) => { // Utilisation de la fonction get() du contrat
    console.log(data);
});