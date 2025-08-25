const express = require('express');
const cors = require('cors');
const db = require('./models/Database');

const creditRoutes = require('./routes/creditRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');


const app = express();
const port = 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

db.sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
});

app.use('/credits', creditRoutes);
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);

app.listen(port, () => {
  console.log(`API CarbonTrack (Sequelize) écoute sur http://localhost:${port}`);
});
