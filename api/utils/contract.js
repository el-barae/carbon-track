const { ethers } = require('ethers');
const CO2KEN = require('../abi/CO2ken.json');
require('dotenv').config({ path: '../.env' });

const RPC = process.env.RPC_URL || 'https://sepolia.infura.io/v3/d1b840e1289f481ea53dea801e827197'; 
const PROVIDER = new ethers.JsonRpcProvider(RPC);

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x1FA4f78a5c73970A20D4A81A77523e33E359f2eE';

const contract = new ethers.Contract(CONTRACT_ADDRESS, CO2KEN, PROVIDER);

// For admin write actions (mint), create a signer if PRIVATE_KEY provided
let adminSigner = null;
if (process.env.ADMIN_PRIVATE_KEY) {
  const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY);
  adminSigner = wallet.connect(PROVIDER);
}
const contractWithSigner = adminSigner ? new ethers.Contract(CONTRACT_ADDRESS, CO2KEN, adminSigner) : null;

module.exports = {
  provider: PROVIDER,
  contract,
  contractWithSigner,
};