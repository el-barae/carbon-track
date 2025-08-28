const { ethers } = require('ethers');
const CO2KEN = require('../abi/CO2ken.json'); // Ensure the path is correct
require('dotenv').config({ path: '../.env' });

const RPC = process.env.RPC_URL || 'https://sepolia.infura.io/v3/d1b840e1289f481ea53dea801e827197'; 
const PROVIDER = new ethers.JsonRpcProvider(RPC);

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x8bD854B05ed0Ba4289a9efAdA418488697fF2aaa';

const contract = new ethers.Contract(CONTRACT_ADDRESS, CO2KEN.abi, PROVIDER);

// For admin write actions (mint), create a signer if PRIVATE_KEY provided
let adminSigner = null;
if (process.env.ADMIN_PRIVATE_KEY || 'f70f45bc9e587b2ffd0a49a3ee75523268b399eeee2e206946d874563178208d') {
  const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY);
  adminSigner = wallet.connect(PROVIDER);
}
const contractWithSigner = adminSigner ? new ethers.Contract(CONTRACT_ADDRESS, CO2KEN.abi, adminSigner) : null;

module.exports = {
  provider: PROVIDER,
  contract,
  contractWithSigner,
};
