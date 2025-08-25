const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const CO2ken = await hre.ethers.getContractFactory("CO2ken");
  const co2ken = await CO2ken.deploy();

  await co2ken.waitForDeployment();

  const contractAddress = await co2ken.getAddress();
  console.log("Contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});