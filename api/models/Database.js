const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: '../.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const db = {};

db.User = require('./User')(sequelize, DataTypes);
db.Credit = require('./Credit')(sequelize, DataTypes);
db.Transaction = require('./Transaction')(sequelize, DataTypes);

db.User.hasMany(db.Credit, { foreignKey: 'owner', sourceKey: 'wallet' });
db.Credit.belongsTo(db.User, { foreignKey: 'owner', targetKey: 'wallet' });

db.Credit.hasMany(db.Transaction, { foreignKey: 'creditId' });
db.Transaction.belongsTo(db.Credit, { foreignKey: 'creditId' });

db.User.hasMany(db.Transaction, { foreignKey: 'seller', sourceKey: 'wallet', as: 'Sales' });
db.User.hasMany(db.Transaction, { foreignKey: 'buyer', sourceKey: 'wallet', as: 'Purchases' });

db.Transaction.belongsTo(db.User, { foreignKey: 'seller', targetKey: 'wallet', as: 'SellerUser' });
db.Transaction.belongsTo(db.User, { foreignKey: 'buyer', targetKey: 'wallet', as: 'BuyerUser' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
