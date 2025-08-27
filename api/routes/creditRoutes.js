// routes/credits.js
const express = require('express');
const router = express.Router();
const { contract, provider } = require('../utils/contract');

// GET /credits
// Returns CreditsMinted events (mint history)
router.get('/', async (req, res) => {
  try {
    const filter = contract.filters.CreditsMinted();
    // fetch all events; for mainnet may want pagination or fromBlock
    const DEPLOY_BLOCK = Number(process.env.DEPLOY_BLOCK || 0);
const events = await contract.queryFilter(filter, DEPLOY_BLOCK, 'latest');

    const rows = events.map(e => ({
      to: e.args.to,
      amount: e.args.amount.toString(),
      projectId: e.args.projectId,
      vintage: e.args.vintage,
      certifier: e.args.certifier,
      txHash: e.transactionHash,
      blockNumber: e.blockNumber,
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
