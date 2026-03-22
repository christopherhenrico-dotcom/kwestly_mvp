import express from 'express';
import cors from 'cors';
import { initDb } from './db/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import questRoutes from './routes/quests.js';
import submissionRoutes from './routes/submissions.js';
import transactionRoutes from './routes/transactions.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = initDb();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Kwestly backend running on port ${PORT}`);
});

export default app;
