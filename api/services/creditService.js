const db = require('../models/Database');

exports.getAllCredits = async (req, res) => {
  try {
    const credits = await db.Credit.findAll();
    res.json(credits);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createCredit = async (req, res) => {
  const { projectId, vintage, certifier, amount, owner } = req.body;

  try {
    const credit = await db.Credit.create({
      projectId,
      vintage,
      certifier,
      amount: parseFloat(amount),
      owner,
    });
    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
};
