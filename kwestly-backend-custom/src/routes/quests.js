import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all quests (public)
router.get('/', (req, res) => {
  const { status, difficulty, poster_id, worker_id } = req.query;
  let query = 'SELECT q.*, p.name as poster_name, p.github_username as poster_username, w.name as worker_name FROM quests q LEFT JOIN users p ON q.poster_id = p.id LEFT JOIN users w ON q.worker_id = w.id WHERE 1=1';
  const params = [];

  if (status) { query += ' AND q.status = ?'; params.push(status); }
  if (difficulty) { query += ' AND q.difficulty = ?'; params.push(difficulty); }
  if (poster_id) { query += ' AND q.poster_id = ?'; params.push(poster_id); }
  if (worker_id) { query += ' AND q.worker_id = ?'; params.push(worker_id); }
  
  query += ' ORDER BY q.created_at DESC';
  const quests = req.db.prepare(query).all(...params);
  res.json(quests);
});

// Get single quest
router.get('/:id', (req, res) => {
  const quest = req.db.prepare('SELECT q.*, p.name as poster_name, p.github_username as poster_username, w.name as worker_name FROM quests q LEFT JOIN users p ON q.poster_id = p.id LEFT JOIN users w ON q.worker_id = w.id WHERE q.id = ?').get(req.params.id);
  if (!quest) return res.status(404).json({ error: 'Quest not found' });
  res.json(quest);
});

// Create quest
router.post('/', verifyToken, (req, res) => {
  const { title, description, bounty, difficulty, min_score, ttl_hours } = req.body;
  if (!title || bounty === undefined) return res.status(400).json({ error: 'Title and bounty required' });

  const id = uuidv4();
  const expiresAt = new Date(Date.now() + (ttl_hours || 4) * 3600000).toISOString();

  req.db.prepare(`INSERT INTO quests (id, title, description, bounty, difficulty, min_score, ttl_hours, status, poster_id, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)`)
    .run(id, title, description, bounty, difficulty || 'easy', min_score || 0, ttl_hours || 4, req.user.id, expiresAt);

  const quest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(id);
  res.status(201).json(quest);
});

// Accept quest
router.post('/:id/accept', verifyToken, (req, res) => {
  const quest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  if (!quest) return res.status(404).json({ error: 'Quest not found' });
  if (quest.status !== 'open') return res.status(400).json({ error: 'Quest not available' });
  if (quest.poster_id === req.user.id) return res.status(400).json({ error: 'Cannot accept own quest' });

  const expiresAt = new Date(Date.now() + quest.ttl_hours * 3600000).toISOString();

  req.db.prepare('UPDATE quests SET status = ?, worker_id = ?, accepted_at = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run('active', req.user.id, new Date().toISOString(), expiresAt, req.params.id);

  const updatedQuest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  res.json(updatedQuest);
});

// Submit quest
router.post('/:id/submit', verifyToken, (req, res) => {
  const { submission_url, submission_notes } = req.body;
  const quest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  
  if (!quest) return res.status(404).json({ error: 'Quest not found' });
  if (quest.worker_id !== req.user.id) return res.status(403).json({ error: 'Not assigned to this quest' });
  if (quest.status !== 'active') return res.status(400).json({ error: 'Quest not active' });

  req.db.prepare('UPDATE quests SET status = ?, submission_url = ?, submission_notes = ?, submitted_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run('submitted', submission_url, submission_notes, new Date().toISOString(), req.params.id);

  // Create submission record
  const subId = uuidv4();
  req.db.prepare('INSERT INTO submissions (id, quest_id, worker_id, pr_url, notes, status) VALUES (?, ?, ?, ?, ?, ?)').run(subId, req.params.id, req.user.id, submission_url, submission_notes, 'pending');

  const updatedQuest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  res.json(updatedQuest);
});

// Review quest (approve/reject)
router.post('/:id/review', verifyToken, (req, res) => {
  const { status, rejection_reason } = req.body;
  const quest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  
  if (!quest) return res.status(404).json({ error: 'Quest not found' });
  if (quest.poster_id !== req.user.id) return res.status(403).json({ error: 'Only poster can review' });
  if (quest.status !== 'submitted') return res.status(400).json({ error: 'Quest not submitted' });

  if (status === 'approved') {
    req.db.prepare('UPDATE quests SET status = ?, reviewed_at = ?, payment_tx = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run('completed', new Date().toISOString(), `tx_${Date.now()}`, req.params.id);

    // Update worker stats
    req.db.prepare('UPDATE users SET quests_completed = quests_completed + 1, total_earned = total_earned + ?, execution_score = execution_score + 50, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(quest.bounty * 0.9, quest.worker_id);

    // Create transaction
    const txId = uuidv4();
    req.db.prepare('INSERT INTO transactions (id, quest_id, worker_id, amount, tx_hash, status) VALUES (?, ?, ?, ?, ?, ?)').run(txId, req.params.id, quest.worker_id, quest.bounty * 0.9, `tx_${Date.now()}`, 'confirmed');

  } else if (status === 'rejected') {
    req.db.prepare('UPDATE quests SET status = ?, reviewed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run('failed', new Date().toISOString(), req.params.id);

    req.db.prepare('UPDATE submissions SET status = ?, rejection_reason = ? WHERE quest_id = ?').run('rejected', rejection_reason, req.params.id);
  }

  const updatedQuest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  res.json(updatedQuest);
});

// Update quest
router.patch('/:id', verifyToken, (req, res) => {
  const quest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  if (!quest) return res.status(404).json({ error: 'Quest not found' });
  if (quest.poster_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  const { title, description, bounty, difficulty } = req.body;
  const updates = [];
  const values = [];

  if (title) { updates.push('title = ?'); values.push(title); }
  if (description) { updates.push('description = ?'); values.push(description); }
  if (bounty) { updates.push('bounty = ?'); values.push(bounty); }
  if (difficulty) { updates.push('difficulty = ?'); values.push(difficulty); }
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(req.params.id);

  req.db.prepare(`UPDATE quests SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const updatedQuest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  res.json(updatedQuest);
});

// Delete quest
router.delete('/:id', verifyToken, (req, res) => {
  const quest = req.db.prepare('SELECT * FROM quests WHERE id = ?').get(req.params.id);
  if (!quest) return res.status(404).json({ error: 'Quest not found' });
  if (quest.poster_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  req.db.prepare('DELETE FROM quests WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
