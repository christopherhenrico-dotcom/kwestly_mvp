/// <reference path="/workspaces/kwestly_mvp/kwestly-backend/pb_data/types.d.ts" />

routerAdd("POST", "/api/quests/:id/accept", (c) => {
  const questId = c.pathParam("id");
  const authRecord = c.get("authRecord"); // authenticated user
  
  if (!authRecord) {
    return c.json(401, { error: "Unauthorized" });
  }
  
  const quest = $app.dao().findRecordById("quests", questId);
  
  // Validations
  if (quest.get("status") !== "open") {
    return c.json(400, { error: "Quest not available" });
  }
  
  const userScore = authRecord.get("execution_score");
  if (userScore < quest.get("min_score")) {
    return c.json(403, { error: "Insufficient execution score" });
  }
  
  // Update quest
  const now = new Date();
  const ttlHours = quest.get("ttl_hours");
  const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);
  
  quest.set("status", "active");
  quest.set("worker_id", authRecord.id);
  quest.set("accepted_at", now.toISOString());
  quest.set("expires_at", expiresAt.toISOString());
  
  $app.dao().saveRecord(quest);
  
  return c.json(200, quest);
}, $apis.requireRecordAuth());