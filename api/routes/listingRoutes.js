// routes/listings.js
const express = require('express');
const router = express.Router();
const { contract } = require('../utils/contract');
const { contractWithSigner } = require("../utils/contract")

// POST /listings - Create new listing
router.post('/', async (req, res) => {
  try {
    if (!contractWithSigner) {
      return res.status(500).json({ error: 'Admin signer not configured' });
    }

    const { amount, pricePerToken } = req.body;
    if (!amount || !pricePerToken) {
      return res.status(400).json({ error: 'Missing amount or pricePerToken' });
    }

    // Ici PAS de parseUnits, car déjà fait dans le front
    const tx = await contractWithSigner.createListing(amount, pricePerToken);
    const receipt = await tx.wait();

    res.json({
      message: "✅ Listing created",
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err) {
    console.error("❌ Error in /listings:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST /listings/:id/buy
// body: {}
router.post('/:id/buy', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const listing = await contract.listings(id);
    if (!listing.active) return res.status(400).json({ error: 'Listing not active' });

    const totalPrice = listing.amount * listing.pricePerToken;

    const tx = await contractWithSigner.buyListing(id, { value: totalPrice });
    const receipt = await tx.wait();

    res.json({ txHash: receipt.transactionHash, blockNumber: receipt.blockNumber });
  } catch (err) {
    console.error("❌ Error in /listings/:id/buy:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /listings/:id/cancel
router.post('/:id/cancel', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const tx = await contractWithSigner.cancelListing(id);
    const receipt = await tx.wait();

    res.json({ txHash: receipt.transactionHash, blockNumber: receipt.blockNumber });
  } catch (err) {
    console.error("❌ Error in /listings/:id/cancel:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /listings
// returns all active listings by scanning [0..nextListingId)
router.get('/', async (req, res) => {
  try {
    const nextIdBn = await contract.nextListingId();
    const nextId = Number(nextIdBn.toString());
    if (nextId === 0) return res.json([]);

    // call getActiveListings in chunks because some providers may have limits
    const chunkSize = 200; // adjust if needed
    const listings = [];
    for (let i = 0; i < nextId; i += chunkSize) {
      const start = i;
      const end = Math.min(nextId, i + chunkSize);
      // getActiveListings returns arrays
      const result = await contract.getActiveListings(start, end);
      const ids = result[0].map(x => Number(x.toString()));
      const sellers = result[1];
      const amounts = result[2].map(x => x.toString());
      const prices = result[3].map(x => x.toString());
      const actives = result[4];

      for (let k = 0; k < ids.length; k++) {
        if (actives[k]) {
          listings.push({
            id: ids[k],
            seller: sellers[k],
            amount: amounts[k],
            pricePerToken: prices[k],
          });
        }
      }
    }
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /listings/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const listing = await contract.listings(id);
    // listing is a tuple: (id, seller, amount, pricePerToken, active)
    res.json({
      id: Number(listing.id.toString()),
      seller: listing.seller,
      amount: listing.amount.toString(),
      pricePerToken: listing.pricePerToken.toString(),
      active: listing.active,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
