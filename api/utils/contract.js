const { ethers } = require('ethers');
const CO2KEN = require('../abi/CO2ken.json'); // Ensure the path is correct
require('dotenv').config({ path: '../.env' });

const RPC = process.env.RPC_URL || 'http://127.0.0.1:7545'; 
const PROVIDER = new ethers.JsonRpcProvider(RPC);

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x3bbD5034C9cCEA4647B0cc250809715447f0531c';

const contract = new ethers.Contract(CONTRACT_ADDRESS, CO2KEN.abi, PROVIDER);

// For admin write actions (mint), create a signer if PRIVATE_KEY provided
let adminSigner = null;
if (process.env.ADMIN_PRIVATE_KEY || '0x382b3dfd43574dbcf38891c2d1bddb3f3c0acad554fd9cc68860e6ddde604e08') {
  const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY);
  adminSigner = wallet.connect(PROVIDER);
}
const contractWithSigner = adminSigner ? new ethers.Contract(CONTRACT_ADDRESS, CO2KEN.abi, adminSigner) : null;


module.exports = {
  provider: PROVIDER,
  contract,
  contractWithSigner,
  address: CONTRACT_ADDRESS
};
