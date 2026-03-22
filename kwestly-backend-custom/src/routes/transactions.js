import express from 'express';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get my transactions
router.get('/my', verifyToken, (req, res) => {
  const transactions = req.db.prepare('SELECT t.*, q.title as quest_title FROM transactions t LEFT JOIN quests q ON t.quest_id = q.id WHERE t.worker_id = ? ORDER BY t.created_at DESC').all(req.user.id);
  res.json(transactions);
});

// Get all transactions (admin)
router.get('/all', verifyToken, (req, res) => {
  const transactions = req.db.prepare('SELECT t.*, q.title as quest_title, w.name as worker_name FROM transactions t LEFT JOIN quests q ON t.quest_id = q.id LEFT JOIN users w ON t.worker_id = w.id ORDER BY t.created_at DESC').all();
  res.json(transactions);
});

// Get stats
router.get('/stats', verifyToken, (req, res) => {
  const earned = req.db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE worker_id = ? AND status = ?').get(req.user.id, 'confirmed');
  const pending = req.db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE worker_id = ? AND status = ?').get(req.user.id, 'pending');
  const count = req.db.prepare('SELECT COUNT(*) as count FROM transactions WHERE worker_id = ? AND status = ?').get(req.user.id, 'confirmed');
  
  res.json({
    totalEarned: earned.total,
    totalPending: pending.total,
    completedCount: count.count
  });
});

export default router;
