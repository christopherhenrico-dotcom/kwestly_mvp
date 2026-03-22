export interface User {
  id: string;
  email: string;
  emailVisibility?: boolean;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  github_id?: string;
  github_username?: string;
  execution_score?: number;
  total_earned?: number;
  quests_completed?: number;
  rank?: 'bronze' | 'silver' | 'gold' | 'elite';
  wallet_address?: string;
  last_score_update?: string;
  created?: string;
  updated?: string;
}

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'elite';
export type QuestStatus = 'open' | 'active' | 'submitted' | 'completed' | 'failed' | 'cancelled';

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

export interface Transaction {
  id: string;
  quest_id?: string;
  worker_id: string;
  amount: number;
  tx_hash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at?: string;
  created?: string;
  updated?: string;
  expand?: {
    quest_id?: Quest;
    worker_id?: User;
  };
}

export interface AuthResponse {
  token: string;
  record: User;
  meta?: {
    isNew: boolean;
    [key: string]: unknown;
  };
}

export interface OAuthProvider {
  name: string;
  state: string;
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  authUrl: string;
}
