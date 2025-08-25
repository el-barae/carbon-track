const db = require('../models/Database');
const { Op } = require('sequelize');

async function createTransaction({ creditId, seller, buyer, amount }) {
  const credit = await db.Credit.findByPk(creditId);
  if (!credit) throw new Error("Crédit introuvable");

  if (credit.owner !== seller) throw new Error("Le vendeur n'est pas propriétaire du crédit");

  if (amount > credit.amount) throw new Error("Montant supérieur au crédit disponible");

  const transaction = await db.Transaction.create({
    creditId,
    seller,
    buyer,
    amount
  });

  if (amount < credit.amount) {
    await credit.update({ amount: credit.amount - amount });

    await db.Credit.create({
      projectId: credit.projectId,
      vintage: credit.vintage,
      certifier: credit.certifier,
      amount,
      owner: buyer
    });
  } else {
    await credit.update({ owner: buyer });
  }

  return transaction;
}

async function getAllTransactions() {
  return db.Transaction.findAll({
    include: [
      { model: db.User, as: 'SellerUser' },
      { model: db.User, as: 'BuyerUser' },
      { model: db.Credit }
    ],
    order: [['createdAt', 'DESC']]
  });
}

async function getTransactionsByWallet(wallet) {
  return db.Transaction.findAll({
    where: {
      [Op.or]: [{ seller: wallet }, { buyer: wallet }]
    },
    include: [
      { model: db.User, as: 'SellerUser' },
      { model: db.User, as: 'BuyerUser' },
      { model: db.Credit }
    ],
    order: [['createdAt', 'DESC']]
  });
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionsByWallet
};
