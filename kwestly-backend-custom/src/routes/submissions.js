import express from 'express';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get submissions for a quest
router.get('/quest/:questId', (req, res) => {
  const submissions = req.db.prepare('SELECT s.*, w.name as worker_name, w.github_username as worker_username FROM submissions s LEFT JOIN users w ON s.worker_id = w.id WHERE s.quest_id = ? ORDER BY s.created_at DESC').all(req.params.questId);
  res.json(submissions);
});

// Get my submissions
router.get('/my', verifyToken, (req, res) => {
  const submissions = req.db.prepare('SELECT s.*, q.title as quest_title, q.bounty as quest_bounty FROM submissions s LEFT JOIN quests q ON s.quest_id = q.id WHERE s.worker_id = ? ORDER BY s.created_at DESC').all(req.user.id);
  res.json(submissions);
});

// Update submission (admin/reviewer)
router.patch('/:id/review', verifyToken, (req, res) => {
  const { status, rejection_reason } = req.body;
  const submission = req.db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);
  
  if (!submission) return res.status(404).json({ error: 'Submission not found' });

  req.db.prepare('UPDATE submissions SET status = ?, reviewed_by = ?, reviewed_at = ?, rejection_reason = ? WHERE id = ?')
    .run(status, req.user.id, new Date().toISOString(), rejection_reason, req.params.id);

  const updated = req.db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);
  res.json(updated);
});

export default router;
