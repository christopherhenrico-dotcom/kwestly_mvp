const GITHUB_API = 'https://api.github.com';

export interface GitHubActivity {
  username: string;
  commits: number;
  prsMerged: number;
  repos: number;
  reviews: number;
  stars: number;
  followers: number;
  contributions: number;
}

export interface ExecutionScore {
  totalScore: number;
  breakdown: {
    commits: number;
    prsMerged: number;
    repos: number;
    reviews: number;
    engagement: number;
  };
  rank: 'bronze' | 'silver' | 'gold' | 'elite';
}

const WEIGHTS = {
  commits: 1,
  prsMerged: 15,
  repos: 5,
  reviews: 8,
  engagement: 0.5,
};

const RANKS = [
  { name: 'bronze', minScore: 0 },
  { name: 'silver', minScore: 500 },
  { name: 'gold', minScore: 1500 },
  { name: 'elite', minScore: 5000 },
];

async function fetchWithAuth(url: string, token?: string): Promise<any> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchGitHubActivity(username: string, githubToken?: string): Promise<GitHubActivity> {
  const [userData, eventsData, reposData] = await Promise.all([
    fetchWithAuth(`${GITHUB_API}/users/${username}`, githubToken),
    fetchWithAuth(`${GITHUB_API}/users/${username}/events?per_page=100`, githubToken),
    fetchWithAuth(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, githubToken),
  ]);

  if (!userData) {
    return {
      username,
      commits: 0,
      prsMerged: 0,
      repos: 0,
      reviews: 0,
      stars: 0,
      followers: 0,
      contributions: 0,
    };
  }

  let commits = 0;
  let prsMerged = 0;
  let reviews = 0;

  for (const event of eventsData || []) {
    switch (event.type) {
      case 'PushEvent':
        commits += (event.payload?.commits?.length || 0);
        break;
      case 'PullRequestEvent':
        if (event.payload?.pull_request?.merged) {
          prsMerged++;
        }
        break;
      case 'PullRequestReviewEvent':
        reviews++;
        break;
    }
  }

  let totalStars = 0;
  for (const repo of reposData || []) {
    totalStars += repo.stargazers_count || 0;
  }

  return {
    username,
    commits,
    prsMerged,
    repos: reposData?.length || 0,
    reviews,
    stars: totalStars,
    followers: userData.followers || 0,
    contributions: userData.contributions || commits,
  };
}

export function calculateExecutionScore(activity: GitHubActivity): ExecutionScore {
  const breakdown = {
    commits: Math.min(activity.commits * WEIGHTS.commits, 2000),
    prsMerged: activity.prsMerged * WEIGHTS.prsMerged,
    repos: Math.min(activity.repos * WEIGHTS.repos, 500),
    reviews: activity.reviews * WEIGHTS.reviews,
    engagement: Math.min(
      (activity.stars * 0.5 + activity.followers * 2),
      1000
    ),
  };

  const totalScore = Math.round(
    breakdown.commits +
    breakdown.prsMerged +
    breakdown.repos +
    breakdown.reviews +
    breakdown.engagement
  );

  let rank: ExecutionScore['rank'] = 'bronze';
  for (const r of RANKS) {
    if (totalScore >= r.minScore) {
      rank = r.name as ExecutionScore['rank'];
    }
  }

  return { totalScore, breakdown, rank };
}

export async function getExecutionScore(username: string, githubToken?: string): Promise<ExecutionScore> {
  const activity = await fetchGitHubActivity(username, githubToken);
  return calculateExecutionScore(activity);
}

export function getScoreDescription(score: number): string {
  if (score < 500) return 'Newcomer - Keep shipping!';
  if (score < 1500) return 'Contributor - Solid work!';
  if (score < 5000) return 'Expert - Impressive output!';
  return 'Elite - Top performer!';
}

export default {
  fetchGitHubActivity,
  calculateExecutionScore,
  getExecutionScore,
  getScoreDescription,
};
