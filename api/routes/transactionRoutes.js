const express = require('express');
const router = express.Router();
const { contract, provider, address, block } = require('../utils/contract');

// --- In-memory cache ---
let transactionsCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute (change as needed)

// Helper: fetch events from blockchain or cache
async function getTransactionsFromChain() {
  const now = Date.now();

  // If cache is still valid, return it
  if (transactionsCache && (now - lastFetchTime < CACHE_TTL)) {
    console.log("✅ Returning transactions from cache");
    return transactionsCache;
  }

  console.log("♻️ Fetching fresh transactions from Infura");
  const filter = contract.filters.Transfer();
  // const DEPLOY_BLOCK = await provider.getTransactionReceipt(address);
  // const events = await contract.queryFilter(filter, DEPLOY_BLOCK, 'latest');

    const events = await contract.queryFilter(filter, parseInt(block), 'latest');

  transactionsCache = events.map(e => ({
    from: e.args.from,
    to: e.args.to,
    value: e.args.value.toString(),
    txHash: e.transactionHash,
    blockNumber: e.blockNumber,
  }));

  lastFetchTime = now;
  return transactionsCache;
}

// GET /transactions
router.get('/', async (req, res) => {
  try {
    const rows = await getTransactionsFromChain();
    res.json(rows);
  } catch (err) {
    console.error("❌ Error in /transactions:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /transactions/:address
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    console.log("Fetching transactions for:", address);

    const allTransfers = await getTransactionsFromChain();

    const formatted = allTransfers.filter(
      e => e.from.toLowerCase() === address.toLowerCase() || e.to.toLowerCase() === address.toLowerCase()
    );

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error in /transactions/:address:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
