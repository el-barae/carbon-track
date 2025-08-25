const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');

router.post('/', async (req, res) => {
  try {
    const { creditId, seller, buyer, amount } = req.body;
    const transaction = await transactionService.createTransaction({ creditId, seller, buyer, amount });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get('/:wallet', async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByWallet(req.params.wallet);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
