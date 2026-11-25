import "dotenv/config";
import crypto from "node:crypto";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { z } from "zod";
import { db, withTransaction } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const allowedOrigin = process.env.ALLOWED_ORIGIN;
const hits = new Map();
const branches = ["Gotri", "Nizampura", "Fatehgunj", "Waghodia Road"];
const mobile = /^(?:\+?91)?[6-9]\d{9}$/;

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: allowedOrigin ? [allowedOrigin] : false, methods: ["GET", "POST"] }));
app.use(express.json({ limit: "32kb", strict: true }));
app.use((req, res, next) => { res.locals.requestId = crypto.randomUUID(); res.setHeader("x-request-id", res.locals.requestId); next(); });

function limit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const item = hits.get(key);
  if (item && item.reset > now) {
    if (item.count >= 5) return res.status(429).json({ ok: false, message: "Too many requests. Please try again later." });
    item.count += 1;
  } else hits.set(key, { count: 1, reset: now + 60 * 60 * 1000 });
  next();
}

function internalOnly(req, res, next) {
  const supplied = req.get("x-internal-token") || "";
  const expected = process.env.INTERNAL_API_TOKEN || "";
  if (!expected || supplied.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return res.status(401).json({ ok: false, message: "Unauthorized" });
  next();
}

const enquirySchema = z.object({
  fullName: z.string().trim().min(2).max(100), email: z.string().trim().email().max(255),
  mobileNumber: z.string().trim().regex(mobile), whatsappNumber: z.string().trim().max(15).nullable().optional(),
  preferredBranch: z.enum(branches), membershipType: z.string().trim().min(1).max(100), joiningDate: z.string().date().nullable().optional(),
  studyPurpose: z.string().trim().min(1).max(100), preferredTiming: z.string().trim().min(1).max(50),
  additionalMessage: z.string().trim().max(2000).nullable().optional(), consent: z.literal(true), source: z.literal("Website"),
});

const simpleSchema = z.object({
  fullName: z.string().trim().min(2).max(100), mobileNumber: z.string().trim().regex(mobile),
  email: z.string().trim().email().max(255).nullable().optional(), preferredBranch: z.enum(branches),
  plan: z.string().trim().max(100).nullable().optional(), joiningDate: z.string().date().nullable().optional(), timing: z.string().trim().max(50).nullable().optional(),
});

const normalMobile = (value) => value.replace(/\D/g, "").slice(-10);
const reference = (type, id) => `SHL-${new Date().getFullYear()}-${String(id).padStart(6, "0")}`;
const parse = (schema) => (req, res, next) => { const result = schema.safeParse(req.body); if (!result.success) return res.status(400).json({ ok: false, message: "Please check the submitted information." }); req.body = result.data; next(); };

app.get("/health", async (_req, res) => { try { await db.query("SELECT 1"); res.json({ ok: true }); } catch { res.status(503).json({ ok: false }); } });
app.get("/api/branches", async (_req, res) => { const [rows] = await db.query("SELECT name, address, contact_number, starting_membership_price, google_maps_url FROM branches WHERE is_active = TRUE ORDER BY id"); res.json({ ok: true, data: rows }); });

app.post("/api/enquiries", internalOnly, limit, parse(enquirySchema), async (req, res, next) => {
  try {
    const data = req.body;
    const result = await withTransaction(async (connection) => {
      const phone = normalMobile(data.mobileNumber);
      const [duplicates] = await connection.execute("SELECT enquiry_code FROM enquiries WHERE mobile_number = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) LIMIT 1", [phone]);
      if (duplicates.length) return { duplicate: true, reference: duplicates[0].enquiry_code };
      const [[branch]] = await connection.execute("SELECT id FROM branches WHERE name = ? AND is_active = TRUE LIMIT 1", [data.preferredBranch]);
      if (!branch) throw Object.assign(new Error("Branch unavailable"), { status: 400 });
      const [insert] = await connection.execute("INSERT INTO enquiries (enquiry_code, branch_id, full_name, mobile_number, whatsapp_number, email, membership_plan, preferred_timing, preferred_joining_date, study_purpose, customer_message, source, consent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ["PENDING", branch.id, data.fullName, phone, data.whatsappNumber ? normalMobile(data.whatsappNumber) : null, data.email, data.membershipType, data.preferredTiming, data.joiningDate || null, data.studyPurpose, data.additionalMessage || null, data.source, true]);
      const code = reference("enquiry", insert.insertId);
      await connection.execute("UPDATE enquiries SET enquiry_code = ? WHERE id = ?", [code, insert.insertId]);
      await connection.execute("INSERT INTO excel_sync_outbox (entity_type, entity_id) VALUES ('enquiry', ?)", [insert.insertId]);
      return { duplicate: false, reference: code };
    });
    res.status(201).json({ ok: true, ...result });
  } catch (error) { next(error); }
});

app.post("/api/admissions", internalOnly, limit, parse(simpleSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const code = await withTransaction(async (connection) => {
      const [[branch]] = await connection.execute("SELECT id FROM branches WHERE name = ?", [data.preferredBranch]);
      if (!branch) throw Object.assign(new Error("Branch unavailable"), { status: 400 });
      const [row] = await connection.execute("INSERT INTO admissions (admission_code, branch_id, full_name, mobile_number, email, preferred_joining_date, membership_preference) VALUES ('PENDING', ?, ?, ?, ?, ?, ?)", [branch.id, data.fullName, normalMobile(data.mobileNumber), data.email || null, data.joiningDate || null, data.plan || null]);
      const value = reference("admission", row.insertId);
      await connection.execute("UPDATE admissions SET admission_code = ? WHERE id = ?", [value, row.insertId]);
      await connection.execute("INSERT INTO excel_sync_outbox (entity_type, entity_id) VALUES ('admission', ?)", [row.insertId]);
      return value;
    });
    res.status(201).json({ ok: true, reference: code });
  } catch (error) { next(error); }
});

app.post("/api/memberships", internalOnly, limit, parse(simpleSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const code = await withTransaction(async (connection) => {
      const [[branch]] = await connection.execute("SELECT id, starting_membership_price FROM branches WHERE name = ?", [data.preferredBranch]);
      if (!branch) throw Object.assign(new Error("Branch unavailable"), { status: 400 });
      const [row] = await connection.execute("INSERT INTO memberships (membership_code, branch_id, full_name, mobile_number, plan, preferred_timing, applicable_price) VALUES ('PENDING', ?, ?, ?, ?, ?, ?)", [branch.id, data.fullName, normalMobile(data.mobileNumber), data.plan || "Unspecified", data.timing || null, branch.starting_membership_price]);
      const value = reference("membership", row.insertId);
      await connection.execute("UPDATE memberships SET membership_code = ? WHERE id = ?", [value, row.insertId]);
      await connection.execute("INSERT INTO excel_sync_outbox (entity_type, entity_id) VALUES ('membership', ?)", [row.insertId]);
      return value;
    });
    res.status(201).json({ ok: true, reference: code });
  } catch (error) { next(error); }
});

app.use((error, req, res, _next) => {
  const status = error.status || (["ECONNREFUSED", "PROTOCOL_CONNECTION_LOST", "ER_ACCESS_DENIED_ERROR", "ER_BAD_DB_ERROR"].includes(error.code) ? 503 : 500);
  console.error("API error", { endpoint: req.path, status, requestId: res.locals.requestId, code: error.code });
  void db.execute("INSERT INTO api_error_logs (endpoint, http_status, database_error_code, request_id, error_summary) VALUES (?, ?, ?, ?, ?)", [req.path, status, error.code ? String(error.code).slice(0, 50) : null, res.locals.requestId, (error.message || "Unknown error").slice(0, 2000)]).catch(() => {});
  res.status(status).json({ ok: false, message: "Unable to process the request right now." });
});
app.listen(port, () => console.log(`Study House private API listening on ${port}`));
