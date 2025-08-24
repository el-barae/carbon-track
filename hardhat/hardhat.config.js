require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/d1b840e1289f481ea53dea801e827197`, 
      accounts: [`f70f45bc9e587b2ffd0a49a3ee75523268b399eeee2e206946d874563178208d`]
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x382b3dfd43574dbcf38891c2d1bddb3f3c0acad554fd9cc68860e6ddde604e08",
        "0x8644d41057f3c0495c5551c748ecd1bec3876bed707d0c1e1096d39014a3168c"
      ],
    }
  }
};