import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'kwestly-super-secret-jwt-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'https://kwestly.up.railway.app';

router.use(cookieParser());

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GitHub OAuth - Redirect to GitHub
router.get('/github', (req, res) => {
  const state = uuidv4();
  res.cookie('oauth_state', state, { httpOnly: true, maxAge: 600000 });
  
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', GITHUB_CLIENT_ID);
  url.searchParams.set('redirect_uri', `${API_URL}/auth/github/callback`);
  url.searchParams.set('scope', 'read:user user:email');
  url.searchParams.set('state', state);
  
  res.redirect(url.toString());
});

// GitHub OAuth - Callback
router.get('/github/callback', async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies.oauth_state;

  if (!state || state !== storedState) {
    return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
  }
  res.clearCookie('oauth_state');

  try {
    // Get access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${API_URL}/auth/github/callback`
      })
    });
    const tokenData = await tokenRes.json();
    
    if (tokenData.error) {
      return res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(tokenData.error_description || 'auth_failed')}`);
    }

    const accessToken = tokenData.access_token;

    // Get GitHub user
    const userRes = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
    });
    const githubUser = await userRes.json();

    // Get email
    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
    });
    const emails = await emailRes.json();
    const primaryEmail = emails.find(e => e.primary) || emails[0];

    // Find or create user
    let user = req.db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubUser.id.toString());
    
    if (!user) {
      user = req.db.prepare('SELECT * FROM users WHERE email = ?').get(primaryEmail.email);
      
      if (user) {
        req.db.prepare(`UPDATE users SET github_id = ?, github_username = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .run(githubUser.id.toString(), githubUser.login, githubUser.avatar_url, user.id);
        user = req.db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
      } else {
        const userId = uuidv4();
        req.db.prepare(`INSERT INTO users (id, email, name, github_id, github_username, avatar_url) VALUES (?, ?, ?, ?, ?, ?)`)
          .run(userId, primaryEmail.email, githubUser.name || githubUser.login, githubUser.id.toString(), githubUser.login, githubUser.avatar_url);
        user = req.db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      }
    }

    const token = generateToken(user);
    const userData = {
      id: user.id, email: user.email, name: user.name,
      github_username: user.github_username, avatar_url: user.avatar_url,
      execution_score: user.execution_score, total_earned: user.total_earned,
      quests_completed: user.quests_completed, rank: user.rank, wallet_address: user.wallet_address
    };

    res.redirect(`${FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
});

// Register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existing = req.db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = uuidv4();
  
  req.db.prepare(`INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)`)
    .run(userId, email, name || email.split('@')[0], hashedPassword);
  
  const user = req.db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const token = generateToken(user);

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, execution_score: user.execution_score, total_earned: user.total_earned, quests_completed: user.quests_completed, rank: user.rank } });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = req.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, github_username: user.github_username, avatar_url: user.avatar_url, execution_score: user.execution_score, total_earned: user.total_earned, quests_completed: user.quests_completed, rank: user.rank, wallet_address: user.wallet_address } });
});

// Get current user
router.get('/me', verifyToken, (req, res) => {
  const user = req.db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, github_username: user.github_username, avatar_url: user.avatar_url, execution_score: user.execution_score, total_earned: user.total_earned, quests_completed: user.quests_completed, rank: user.rank, wallet_address: user.wallet_address });
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

export default router;
