// routes/admin.js
const express = require('express');
const router = express.Router();
const { contractWithSigner } = require('../utils/contract');

if (!contractWithSigner) {
  console.warn('Admin route disabled: no ADMIN_PRIVATE_KEY provided');
}

// POST /admin/mint
// body: { to, amount, projectId, vintage, certifier }
router.post('/mint', async (req, res) => {
  try {
    if (!contractWithSigner) return res.status(500).json({ error: 'Admin signer not configured' });
    const { to, amount, projectId, vintage, certifier } = req.body;
    if (!to || !amount) return res.status(400).json({ error: 'Missing to or amount' });

    // amount must be in token units (consider decimals = 6)
    const tx = await contractWithSigner.mintCredits(to, amount, projectId || '', vintage || '', certifier || '');
    const receipt = await tx.wait();
    res.json({ txHash: receipt.transactionHash, blockNumber: receipt.blockNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
