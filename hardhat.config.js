require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */


task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.formatEther(balance), "ETH");
  });


module.exports = {
  solidity: "0.8.24",
  networks: {
      hardhat: {
        chainId: 31337,
        blockConformations: 1,
        allowUnlimitedContractSize: true,
      },
      sepolia: {
        chainId: 11155111,
        url: process.env.SEPOLIA_API_URL,
        accounts: [process.env.SEPOLIA_PRIVATE_KEY]
      },
  },
};