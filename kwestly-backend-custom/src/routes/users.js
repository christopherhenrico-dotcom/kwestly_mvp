import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all users (public)
router.get('/', (req, res) => {
  const users = req.db.prepare('SELECT id, name, github_username, avatar_url, execution_score, total_earned, quests_completed, rank, created_at FROM users ORDER BY execution_score DESC').all();
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = req.db.prepare('SELECT id, name, github_username, avatar_url, execution_score, total_earned, quests_completed, rank, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update user profile
router.patch('/me', verifyToken, (req, res) => {
  const { name, avatar_url, wallet_address } = req.body;
  const updates = [];
  const values = [];

  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (avatar_url !== undefined) { updates.push('avatar_url = ?'); values.push(avatar_url); }
  if (wallet_address !== undefined) { updates.push('wallet_address = ?'); values.push(wallet_address); }
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(req.user.id);

  req.db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const user = req.db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ id: user.id, email: user.email, name: user.name, github_username: user.github_username, avatar_url: user.avatar_url, execution_score: user.execution_score, total_earned: user.total_earned, quests_completed: user.quests_completed, rank: user.rank, wallet_address: user.wallet_address });
});

// Get leaderboard
router.get('/leaderboard/top', (req, res) => {
  const { sort = 'execution_score', limit = 20 } = req.query;
  const orderBy = sort === 'total_earned' ? 'total_earned DESC' : 'execution_score DESC';
  const users = req.db.prepare(`SELECT id, name, github_username, avatar_url, execution_score, total_earned, quests_completed, rank FROM users ORDER BY ${orderBy} LIMIT ?`).all(parseInt(limit));
  res.json(users);
});

export default router;
