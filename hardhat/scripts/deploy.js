const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const CO2ken = await ethers.getContractFactory("CO2ken");
  const co2ken = await CO2ken.deploy(deployer.address);

  await co2ken.deployed();

  console.log("CO2ken deployed at:", co2ken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
