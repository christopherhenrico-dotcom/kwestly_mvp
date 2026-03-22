import { useState, useEffect } from 'react';
import { getExecutionScore, GitHubActivity, ExecutionScore } from '@/services/executionScoreService';
import { useUser } from '@clerk/react';

export function useExecutionScore() {
  const { user } = useUser();
  const [score, setScore] = useState<ExecutionScore | null>(null);
  const [activity, setActivity] = useState<GitHubActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const githubUsername = user?.username;

  useEffect(() => {
    if (!githubUsername) {
      setScore(null);
      setActivity(null);
      return;
    }

    async function fetchScore() {
      setLoading(true);
      setError(null);
      try {
        const [activityData, scoreData] = await Promise.all([
          getActivityOnly(githubUsername),
          getExecutionScore(githubUsername),
        ]);
        setActivity(activityData);
        setScore(scoreData);
      } catch (err) {
        console.error('Failed to fetch execution score:', err);
        setError('Failed to calculate score');
        setScore({
          totalScore: 0,
          breakdown: {
            commits: 0,
            prsMerged: 0,
            repos: 0,
            reviews: 0,
            engagement: 0,
          },
          rank: 'bronze',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchScore();
  }, [githubUsername]);

  return { score, activity, loading, error, refresh: () => githubUsername && getExecutionScore(githubUsername) };
}

async function getActivityOnly(username: string): Promise<GitHubActivity> {
  const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
  
  if (!response.ok) {
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

  const events = await response.json();
  let commits = 0;
  let prsMerged = 0;
  let reviews = 0;

  for (const event of events) {
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

  const userResponse = await fetch(`https://api.github.com/users/${username}`);
  const userData = userResponse.ok ? await userResponse.json() : { followers: 0 };

  return {
    username,
    commits,
    prsMerged,
    repos: 0,
    reviews,
    stars: 0,
    followers: userData.followers || 0,
    contributions: commits,
  };
}

export default useExecutionScore;
