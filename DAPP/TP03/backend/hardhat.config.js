require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      blockGasLimit: 3000000, // ! Default 30_000_000
    },
  },
  gasReporter: {
    enabled: true,
  },
};
