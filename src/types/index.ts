// User type based on PocketBase users collection
export interface User {
  id: string;
  username: string;
  email: string;
  emailVisibility?: boolean;
  avatar?: string;
  executionScore?: number;
  questsCompleted?: number;
  successRate?: number;
  totalEarned?: number;
  walletBalance?: number;
  created?: string;
  updated?: string;
}

// Quest difficulty levels
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'elite';

// Quest status
export type QuestStatus = 'open' | 'active' | 'submitted' | 'completed' | 'failed' | 'cancelled';

// Quest type based on backend schema
export interface Quest {
  id: string;
  title: string;
  description: string;
  bounty: number;
  difficulty: QuestDifficulty;
  min_score: number;
  ttl_hours: number;
  status: QuestStatus;
  poster_id: string;
  worker_id?: string;
  accepted_at?: string;
  expires_at?: string;
  submission_url?: string;
  submission_notes?: string;
  submitted_at?: string;
  reviewed_at?: string;
  payment_tx?: string;
  created?: string;
  updated?: string;
  expand?: {
    poster_id?: User;
    worker_id?: User;
  };
}

// Submission type
export type SubmissionType = 'pr_link' | 'file';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: string;
  quest_id: string;
  worker_id: string;
  submission_type: SubmissionType;
  pr_url?: string;
  file?: string;
  notes?: string;
  status: SubmissionStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  rejaction_reason?: string;
  created_at?: string;
  created?: string;
  updated?: string;
  expand?: {
    quest_id?: Quest;
    worker_id?: User;
    reviewed_by?: User;
  };
}

// Transaction type
export interface Transaction {
  id: string;
  user_id: string;
  quest_id?: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'quest_payment' | 'quest_earning' | 'fee';
  status: 'pending' | 'completed' | 'failed';
  tx_hash?: string;
  created?: string;
  updated?: string;
  expand?: {
    user_id?: User;
    quest_id?: Quest;
  };
}

// Auth response
export interface AuthResponse {
  token: string;
  record: User;
  meta?: {
    isNew: boolean;
    [key: string]: unknown;
  };
}

// OAuth provider
export interface OAuthProvider {
  name: string;
  state: string;
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  authUrl: string;
}
