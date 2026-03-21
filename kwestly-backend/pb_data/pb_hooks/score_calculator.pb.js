/// <reference path="/workspaces/kwestly_mvp/kwestly-backend/pb_data/types.d.ts" />

routerAdd("POST", "/api/calculate-score/:userId", (c) => {
  // Internal API - verify secret key
  const apiKey = c.request().header.get("X-Internal-Key");
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return c.json(401, { error: "Unauthorized" });
  }
  
  const userId = c.pathParam("userId");
  const user = $app.dao().findRecordById("users", userId);
  
  const githubUsername = user.get("github_username");
  const githubToken = process.env.GITHUB_TOKEN; // your personal token
  
  // Fetch user repos
  const reposRes = $http.send({
    url: `https://api.github.com/users/${githubUsername}/repos`,
    headers: {
      "Authorization": `Bearer ${githubToken}`,
      "Accept": "application/vnd.github+json",
    },
  });
  
  if (reposRes.statusCode !== 200) {
    return c.json(500, { error: "GitHub API error" });
  }
  
  const repos = reposRes.json;
  
  // Scoring algorithm (simplified)
  let score = 0;
  let totalStars = 0;
  let totalCommits = 0;
  
  repos.forEach(repo => {
    totalStars += repo.stargazers_count || 0;
    
    // Fetch commits for each repo (last 100)
    const commitsRes = $http.send({
      url: `https://api.github.com/repos/${githubUsername}/${repo.name}/commits?per_page=100`,
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github+json",
      },
    });
    
    if (commitsRes.statusCode === 200) {
      totalCommits += commitsRes.json.length;
    }
  });
  
  // Score formula (adjust weights as needed)
  score = (totalCommits * 0.5) + (totalStars * 2) + (repos.length * 10);
  
  // Determine rank
  let rank = "bronze";
  if (score >= 1000) rank = "elite";
  else if (score >= 750) rank = "gold";
  else if (score >= 500) rank = "silver";
  
  // Update user
  user.set("execution_score", Math.round(score));
  user.set("rank", rank);
  user.set("last_score_update", new Date().toISOString());
  
  $app.dao().saveRecord(user);
  
  return c.json(200, {
    score: Math.round(score),
    rank: rank,
  });
});