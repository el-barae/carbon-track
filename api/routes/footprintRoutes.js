const express = require('express');
const router = express.Router();
const { contract } = require('../utils/contract');

// GET /footprint?energy=100&carKm=50&flightKm=10
router.get("/", async (req, res) => {
  try {
    const energy = req.query.energy ? Number(req.query.energy) : 0;
    const carKm = req.query.carKm ? Number(req.query.carKm) : 0;
    const flightKm = req.query.flightKm ? Number(req.query.flightKm) : 0;

    if (energy <= 0 && carKm <= 0 && flightKm <= 0) {
      return res.status(400).json({ error: "At least one input must be > 0" });
    }

    // calcul simple côté backend
    const footprint = energy * 233 + carKm * 120 + flightKm * 250;

    res.json({ 
      energy,
      carKm,
      flightKm,
      footprint,
      unit: "gCO2"
    });
  } catch (error) {
    console.error("Carbon calculation failed:", error);
    res.status(500).json({ error: "Calculation error", details: error instanceof Error ? error.message : error });
  }
});

module.exports = router;
