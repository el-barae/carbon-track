const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config({ path: '../.env' });

app.use(cors({
  origin: '*',
  credentials: true
}));


const creditsRouter = require('./routes/creditRoutes');
const listingsRouter = require('./routes/listingRoutes');
const transactionsRouter = require('./routes/transactionRoutes');
const adminRouter = require('./routes/adminRoutes');
const footprintRouter = require('./routes/footprintRoutes');

app.use(express.json());
app.use('/credits', creditsRouter);
app.use('/listings', listingsRouter);
app.use('/transactions', transactionsRouter);
app.use('/admin', adminRouter);
app.use("/footprint", footprintRouter);

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
