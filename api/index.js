const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config({ path: '../.env' });

app.use(cors({
  origin: [
    'http://localhost:3000',  // Next.js default dev port
    'http://localhost:3001',  // Alternative dev port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true
}));


const creditsRouter = require('./routes/creditRoutes');
const listingsRouter = require('./routes/listingRoutes');
const transactionsRouter = require('./routes/transactionRoutes');
const adminRouter = require('./routes/adminRoutes');

app.use(express.json());
app.use('/credits', creditsRouter);
app.use('/listings', listingsRouter);
app.use('/transactions', transactionsRouter);
app.use('/admin', adminRouter);

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
