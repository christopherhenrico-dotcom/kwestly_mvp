/// <reference path="/workspaces/kwestly_mvp/kwestly-backend/pb_data/types.d.ts" />

onRecordBeforeAuthWithOAuth2Request((e) => {
  // This fires BEFORE OAuth redirect
  // Store the OAuth provider for later
  if (e.provider.name === "github") {
    e.httpContext.set("oauth_provider", "github");
  }
});

onRecordAfterAuthWithOAuth2Request((e) => {
  // This fires AFTER successful OAuth
  if (e.provider.name !== "github") return;

  const githubUser = e.oauth2User.rawUser;
  
  // Update user record with GitHub data
  const record = e.record;
  record.set("github_id", githubUser.id);
  record.set("github_username", githubUser.login);
  record.set("avatar_url", githubUser.avatar_url);
  record.set("username", githubUser.login); // fallback
  
  $app.dao().saveRecord(record);
  
  // Trigger score calculation in background
  $http.send({
    url: `${process.env.BASE_URL}/api/calculate-score/${record.id}`,
    method: "POST",
    headers: {
      "X-Internal-Key": process.env.INTERNAL_API_KEY,
    },
  });
});