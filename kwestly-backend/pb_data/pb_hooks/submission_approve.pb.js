/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/submissions/:id/approve", (c) => {
  const authRecord = c.get("authRecord");
  
  // Only admin can approve
  if (!authRecord || authRecord.get("role") !== "admin") {
    return c.json(403, { error: "Admin only" });
  }
  
  const submissionId = c.pathParam("id");
  const submission = $app.dao().findRecordById("submissions", submissionId);
  const quest = $app.dao().findRecordById("quests", submission.get("quest_id"));
  const worker = $app.dao().findRecordById("users", submission.get("worker_id"));
  
  // Update submission
  submission.set("status", "approved");
  submission.set("reviewed_by", authRecord.id);
  submission.set("reviewed_at", new Date().toISOString());
  $app.dao().saveRecord(submission);
  
  // Update quest
  quest.set("status", "completed");
  quest.set("reviewed_at", new Date().toISOString());
  $app.dao().saveRecord(quest);
  
  // Trigger payment (call external payment service)
  const paymentRes = $http.send({
    url: `${process.env.BASE_URL}/api/payments/process`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Key": process.env.INTERNAL_API_KEY,
    },
    body: JSON.stringify({
      quest_id: quest.id,
      worker_id: worker.id,
      worker_wallet: worker.get("wallet_address"),
      amount: quest.get("bounty"),
    }),
  });
  
  if (paymentRes.statusCode === 200) {
    const txHash = paymentRes.json.tx_hash;
    quest.set("payment_tx", txHash);
    $app.dao().saveRecord(quest);
    
    // Update worker stats
    worker.set("quests_completed", worker.get("quests_completed") + 1);
    worker.set("total_earned", worker.get("total_earned") + quest.get("bounty"));
    $app.dao().saveRecord(worker);
  }
  
  return c.json(200, submission);
}, $apis.requireRecordAuth());