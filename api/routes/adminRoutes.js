const express = require('express');
const router = express.Router();
const { contractWithSigner } = require('../utils/contract');
const { ethers } = require('ethers');
const checkAdmin = require("../middleware/checkAdmin")


if (!contractWithSigner) {
  console.warn('Admin route disabled: no ADMIN_PRIVATE_KEY provided');
}

// POST /admin/mint
// body: { to, amount, projectId, vintage, certifier }
router.post('/mint', checkAdmin, async (req, res) => {
  try {
    if (!contractWithSigner) {
      return res.status(500).json({ error: 'Admin signer not configured' });
    }

    const { to, amount, projectId, vintage, certifier } = req.body;
    if (!to || !amount) {
      return res.status(400).json({ error: 'Missing to or amount' });
    }

    const DECIMALS = 18; 
    const parsedAmount = ethers.parseUnits(amount.toString(), DECIMALS);

    const tx = await contractWithSigner.mintCredits(
      to,
      parsedAmount,
      projectId || '',
      vintage || '',
      certifier || ''
    );

    const receipt = await tx.wait();

    res.json({
      message: "✅ Mint successful",
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err) {
    console.error("❌ Error in /admin/mint:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST /admin/verify
// body: { holder, verified }
router.post('/verify', checkAdmin, async (req, res) => {
  try {
    if (!contractWithSigner) return res.status(500).json({ error: 'Admin signer not configured' });

    const { holder, verified } = req.body;
    if (!holder) return res.status(400).json({ error: 'Missing holder address' });

    const tx = await contractWithSigner.verifyCredit(holder, verified);
    const receipt = await tx.wait();

    res.json({ txHash: receipt.transactionHash, blockNumber: receipt.blockNumber });
  } catch (err) {
    console.error("❌ Error in /admin/verify:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/balance/:address", async (req, res) => {
  try {
    const balance = await contractWithSigner.balanceOf(req.params.address);
    res.json({ balance: balance.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
