# Kwestly Backend

Custom Node.js/Express backend with SQLite database and full GitHub OAuth support.

## Quick Start

```bash
cd kwestly-backend-custom
npm install
npm start
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
PORT=3000
NODE_ENV=production
API_URL=https://your-backend.railway.app
FRONTEND_URL=https://kwestly.pages.dev
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
JWT_SECRET=generate_a_strong_random_string
```

## GitHub OAuth Setup

1. Go to https://github.com/settings/developers
2. Create a new OAuth App:
   - **Homepage URL**: `https://kwestly.pages.dev`
   - **Authorization callback URL**: `https://your-backend.railway.app/auth/github/callback`
3. Copy the Client ID and Client Secret to your `.env` file

## Deploy to Railway

```bash
npm install -g railway
railway login
cd kwestly-backend-custom
railway init
railway up
```

Set environment variables in Railway dashboard:
- `API_URL`
- `FRONTEND_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `JWT_SECRET`

## API Endpoints

### Auth
- `GET /api/auth/github` - Start GitHub OAuth
- `GET /api/auth/github/callback` - OAuth callback
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - Email/password register
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/me` - Update profile
- `GET /api/users/leaderboard/top` - Get leaderboard

### Quests
- `GET /api/quests` - List quests
- `GET /api/quests/:id` - Get quest
- `POST /api/quests` - Create quest
- `POST /api/quests/:id/accept` - Accept quest
- `POST /api/quests/:id/submit` - Submit quest
- `POST /api/quests/:id/review` - Review submission

### Transactions
- `GET /api/transactions/my` - Get my transactions
- `GET /api/transactions/stats` - Get stats
