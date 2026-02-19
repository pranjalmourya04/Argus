const { ethers } = require("hardhat");

async function main() {
  const FraudRegistry = await ethers.getContractFactory("FraudRegistry");
  const fraudRegistry = await FraudRegistry.deploy();

  await fraudRegistry.waitForDeployment();

  const address = await fraudRegistry.getAddress();

  console.log("ARGUS deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
