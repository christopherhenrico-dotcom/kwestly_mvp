# Kwestly

> The P2P Side Quest platform where your GitHub speaks louder than your resume.

![Kwestly Banner](public/og-image.png)

## About

Kwestly is a developer-first freelance platform that cuts through the noise. No resumes. No interviews. Just execution.

Connect your GitHub, verify your **Execution Score**, and pick up micro-gigs ("Quests") you can ship in a morning. We take a flat 10% platform fee and pay out instantly in USDC on Base.

## Features

### For Workers
- **Quest Browser**: Browse micro-gigs filtered by difficulty, bounty, and required Execution Score
- **Execution Score**: GitHub activity creates your real-world skill profile (commits, PRs, reviews)
- **Real-time Countdowns**: TTL-based quest expiration with visual timers
- **Submission Flow**: Submit PR links with notes for reviewer approval
- **Leaderboard**: Compete with other developers by completion count and earnings

### For Clients
- **Post Quests**: Create bounties with difficulty, time limits, and skill requirements
- **Review Submissions**: Approve or reject submitted work
- **Instant Payouts**: Funds release automatically when approved

### Platform
- **Escrow Protected**: Bounties locked until delivery
- **Blockchain Verified**: Built on Base for unstoppable reputation
- **Clerk Auth**: Secure OAuth with GitHub, Google, or email

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | TailwindCSS + shadcn/ui |
| State | Zustand + React Query |
| Auth | Clerk (OAuth) |
| Blockchain | Base (USDC) |
| Deploy | Cloudflare Pages |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/kwestly.git
cd kwestly

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_xxx

# Backend API
VITE_API_URL=https://your-api.railway.app
```

> **Note**: See `.env.example` for all available environment variables.

### Build

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Protected routes, auth components
│   ├── layout/         # TopNav, AppSidebar
│   ├── notifications/  # Notification panel
│   ├── quest/          # QuestCard, DifficultyBadge, CountdownTimer
│   ├── ui/             # shadcn/ui base components
│   └── user/           # ExecutionScoreBadge
├── contexts/
│   └── AuthContext.tsx # Auth provider
├── hooks/
│   ├── useAuth.ts       # Auth hooks
│   ├── useExecutionScore.ts
│   └── ...
├── pages/
│   ├── Landing.tsx      # Marketing landing page
│   ├── Dashboard.tsx    # Quest terminal
│   ├── QuestDetail.tsx # Single quest view
│   ├── MyQuests.tsx    # User's quest history
│   ├── Submit.tsx      # Submission form
│   ├── Profile.tsx     # User profile & stats
│   ├── Leaderboard.tsx # Rankings
│   ├── Transactions.tsx # Payment history
│   ├── Settings.tsx    # Account settings
│   └── Admin.tsx       # Quest management
├── services/
│   ├── api.ts          # REST API client
│   ├── authService.ts  # Auth utilities
│   ├── questService.ts
│   └── executionScoreService.ts
├── stores/
│   └── appStore.ts     # Zustand store
└── types/
    └── index.ts        # TypeScript types
```

## Design System

Cyberpunk-inspired dark theme with glassmorphism effects:

| Token | Color | Usage |
|-------|-------|-------|
| Primary | `#00f5ff` | CTAs, links, accents |
| Purple | `#b537ff` | Secondary actions |
| Green | `#39ff14` | Success, earnings |
| Gold | `#ffd700` | Achievements, rankings |
| Red | `#ff2d55` | Errors, warnings |

**Typography**:
- Display: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
- Mono: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

## API Integration

The frontend communicates with a REST API backend. Configure your API URL:

```env
VITE_API_URL=https://your-backend.railway.app
```

API endpoints follow REST conventions:
- `GET /api/quests` - List quests
- `POST /api/quests` - Create quest
- `POST /api/quests/:id/accept` - Accept quest
- `POST /api/quests/:id/submit` - Submit work

## Deployment

### Cloudflare Pages

1. Connect your GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Cloudflare dashboard

### Vercel

```bash
npm install -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Completed
- [x] Landing page with marketing copy
- [x] Quest browser with filters
- [x] Quest detail and accept flow
- [x] Submission system
- [x] User profile with Execution Score
- [x] Leaderboard
- [x] Admin dashboard
- [x] Clerk authentication
- [x] Glassmorphism UI

### In Progress
- [ ] Full backend API integration
- [ ] GitHub OAuth for user accounts
- [ ] USDC payment escrow on Base

### Planned
- [ ] Email notifications
- [ ] WebSocket real-time updates
- [ ] Quest categories and tags
- [ ] User reviews and ratings
- [ ] Dispute resolution system

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with 💜 by developers, for developers.
