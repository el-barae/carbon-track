const express = require('express');
const router = express.Router();
const { contract } = require('../utils/contract');

// GET /listings
// returns all active listings by scanning [0..nextListingId)
router.get('/', async (req, res) => {
  try {
    const nextIdBn = await contract.nextListingId();
    const nextId = Number(nextIdBn.toString());
    if (nextId === 0) return res.json([]);

    const chunkSize = 200; 
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