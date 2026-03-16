# Kwestly

The first high-velocity, P2P "Side Quest" platform for developers.

## About

Kwestly is a modern freelance platform that strips away the complexity of traditional job boards. Connect your GitHub, verify your execution score, and grab micro-gigs ("Quests") you can finish in a morning. We take a flat 10% fee and pay out instantly in stablecoins.

## Features

- **Quest System**: Browse and accept micro-gigs with time limits
- **Execution Score**: GitHub-verified reputation system
- **Real-time Countdowns**: TTL-based quest expiration
- **Submission Flow**: PR link and file upload for completed work
- **Admin Dashboard**: Post quests, review submissions, manage disputes
- **Leaderboard**: Top performers ranked by completed quests

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: TailwindCSS with custom design tokens
- **State Management**: Zustand
- **UI Components**: Radix UI primitives + shadcn/ui
- **Routing**: React Router v6
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

### Build

```bash
# Production build
npm run build

# Development build
npm run build:dev
```

## Project Structure

```
src/
├── components/
│   ├── layout/         # AppSidebar, TopNav
│   ├── quest/          # QuestCard, CountdownTimer, DifficultyBadge
│   ├── ui/             # shadcn/ui components
│   └── user/           # ExecutionScoreBadge
├── pages/
│   ├── Landing.tsx     # Marketing page
│   ├── Dashboard.tsx   # Quest browser
│   ├── QuestDetail.tsx # Individual quest view
│   ├── MyQuests.tsx    # User's active quests
│   ├── Submit.tsx      # Submission form
│   ├── Profile.tsx     # User stats
│   ├── Leaderboard.tsx # Top users
│   └── Admin.tsx       # Quest management
├── stores/
│   └── appStore.ts     # Zustand stores (auth, quests, UI)
├── data/
│   └── mockData.ts     # Demo data
└── lib/
    └── utils.ts        # Utility functions
```

## Design System

The project uses a cyberpunk-inspired dark theme with:
- **Primary**: Cyan (#00f5ff)
- **Secondary**: Purple (#b026ff)
- **Accent**: Green for success, Red for danger

Typography:
- **Display**: Space Grotesk
- **Code/Mono**: JetBrains Mono

## Roadmap

- [x] Landing page with hero section
- [x] Quest browser with filters
- [x] Quest detail and accept flow
- [x] Submission system
- [x] User profile with stats
- [x] Leaderboard
- [x] Admin dashboard
- [ ] GitHub OAuth integration
- [ ] Payment integration (USDC on Base)
- [ ] Real backend API (Cloudflare Workers + Turso)

## License

MIT
