import "dotenv/config";
import { db } from "./db.js";
import { queueExcelSync } from "./excel.js";

async function run() {
  const [jobs] = await db.query("SELECT id FROM excel_sync_outbox WHERE status IN ('Pending', 'Retrying') ORDER BY created_at LIMIT 1");
  if (jobs.length) await queueExcelSync();
}

async function poll() {
  try { await run(); }
  catch (error) {
    const detail = error instanceof Error ? error.message.slice(0, 2000) : "Unknown Excel sync error";
    console.error("Excel worker failed", detail);
    await db.execute("UPDATE excel_sync_outbox SET status = 'Retrying', retry_count = retry_count + 1, last_error = ? WHERE status IN ('Pending', 'Retrying')", [detail]);
    await db.execute("INSERT INTO excel_sync_logs (status, failure_details, retry_count) VALUES ('Retrying', ?, 1)", [detail]);
  }
}

await poll();
setInterval(poll, 60_000);
