const db = require('../models/Database');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({ include: db.Credit });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getUserByWallet = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { wallet: req.params.wallet },
      include: db.Credit,
    });

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.calculateFootprint = async (req, res) => {
  const { wallet, energyConsumption, travel } = req.body;

  try {
    const energyFootprint = energyConsumption * 0.5;
    const travelFootprint = (travel.car || 0) * 0.2 + (travel.plane || 0) * 0.25;
    const totalFootprint = (energyFootprint + travelFootprint) / 1000;

    let user = await db.User.findOne({ where: { wallet } });

    if (user) {
      await user.update({ footprint: totalFootprint });
    } else {
      user = await db.User.create({ wallet, footprint: totalFootprint });
    }

    res.json({
      wallet,
      footprint: totalFootprint,
      recommendation: `Compensez ${totalFootprint.toFixed(2)} tonnes de CO2`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de calcul' });
  }
};
