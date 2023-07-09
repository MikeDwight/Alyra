const hre = require("hardhat");

async function main() {

  const Ticketing = await hre.ethers.deployContract("Ticketing");

  await Ticketing.waitForDeployment();

  console.log(
    `Ticketing deployed to ${Ticketing.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
