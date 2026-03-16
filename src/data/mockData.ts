export interface Quest {
  id: string;
  title: string;
  description: string;
  bounty: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'elite';
  ttl: number;
  endTime: number;
  minScore: number;
  status?: 'active' | 'submitted' | 'completed' | 'failed';
  requirements?: string[];
  deliverables?: string;
  postedBy?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  executionScore: number;
  questsCompleted: number;
  successRate: number;
  totalEarned: number;
  walletBalance: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
  timestamp: number;
}

export const MOCK_QUESTS: Quest[] = [
  {
    id: '1',
    title: 'Fix React State Bug in Dashboard',
    description: 'The dashboard component has a stale closure issue causing incorrect render counts. Need to refactor useEffect dependencies and implement proper memoization.',
    bounty: 50,
    difficulty: 'easy',
    ttl: 14400000,
    endTime: Date.now() + 14400000,
    minScore: 100,
    requirements: ['Identify the stale closure', 'Fix useEffect deps', 'Add unit tests', 'No breaking changes'],
    deliverables: 'Submit PR link with passing tests',
  },
  {
    id: '2',
    title: 'Build WebSocket Real-time Chat Module',
    description: 'Implement a real-time chat module using WebSocket connections with reconnection logic, message queuing, and typing indicators.',
    bounty: 150,
    difficulty: 'hard',
    ttl: 7200000,
    endTime: Date.now() + 7200000,
    minScore: 750,
    requirements: ['WebSocket with auto-reconnect', 'Message queue for offline', 'Typing indicators', 'Read receipts'],
    deliverables: 'PR with demo and docs',
  },
  {
    id: '3',
    title: 'Optimize PostgreSQL Query Performance',
    description: 'A critical report query is running 45s+. Need to analyze the execution plan, add proper indexes, and potentially restructure the query.',
    bounty: 200,
    difficulty: 'hard',
    ttl: 10800000,
    endTime: Date.now() + 10800000,
    minScore: 850,
    requirements: ['Current EXPLAIN ANALYZE output', 'Optimized query < 2s', 'Index recommendations', 'No data loss'],
    deliverables: 'SQL migration file + before/after benchmarks',
  },
  {
    id: '4',
    title: 'Design System: Dark Mode Toggle',
    description: 'Add dark mode support to our existing Tailwind design system with smooth transitions and system preference detection.',
    bounty: 75,
    difficulty: 'medium',
    ttl: 18000000,
    endTime: Date.now() + 18000000,
    minScore: 300,
    requirements: ['System preference detection', 'Smooth color transitions', 'Persist user choice', 'All components themed'],
    deliverables: 'PR link',
  },
  {
    id: '5',
    title: 'Smart Contract Audit: Token Vesting',
    description: 'Audit a Solidity token vesting contract for vulnerabilities. Check reentrancy, overflow, access control, and gas optimization.',
    bounty: 500,
    difficulty: 'elite',
    ttl: 28800000,
    endTime: Date.now() + 28800000,
    minScore: 1000,
    requirements: ['Full security audit report', 'Gas optimization suggestions', 'Test coverage report', 'Formal verification where possible'],
    deliverables: 'Audit PDF + patched contract',
  },
  {
    id: '6',
    title: 'CI/CD Pipeline with GitHub Actions',
    description: 'Set up a complete CI/CD pipeline with linting, testing, building, and deployment to Vercel on merge to main.',
    bounty: 100,
    difficulty: 'medium',
    ttl: 14400000,
    endTime: Date.now() + 14400000,
    minScore: 500,
    requirements: ['Lint + type check on PR', 'Run test suite', 'Build verification', 'Auto-deploy on merge'],
    deliverables: 'GitHub Actions workflow files',
  },
];

export const MOCK_USER: User = {
  id: 'user-1',
  username: 'cyberdev_42',
  avatar: '',
  executionScore: 850,
  questsCompleted: 12,
  successRate: 94,
  totalEarned: 1240,
  walletBalance: 320,
};
