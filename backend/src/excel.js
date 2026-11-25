import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { db } from "./db.js";

const exportDir = process.env.PRIVATE_EXPORT_DIR;
let pending = Promise.resolve();

const literal = (value) => typeof value === "string" && /^[=+\-@]/.test(value) ? `'${value}` : value;
const navy = "0B0B20";
const gold = "D9A83E";

function addSheet(book, name, columns, rows) {
  const sheet = book.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = columns.map(([header, key]) => ({ header, key, width: Math.min(Math.max(header.length + 3, 14), 32) }));
  sheet.autoFilter = { from: "A1", to: String.fromCharCode(64 + columns.length) + "1" };
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${navy}` } };
    cell.alignment = { vertical: "middle" };
    cell.border = { bottom: { style: "medium", color: { argb: `FF${gold}` } } };
  });
  rows.forEach((row, index) => {
    const added = sheet.addRow(Object.fromEntries(Object.entries(row).map(([key, value]) => [key, literal(value)])));
    if (index % 2) added.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F5ED" } }; });
    if (row.status === "Pending") added.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF3CD" } }; });
    if (row.status === "Converted") added.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1E7DD" } }; });
    if (row.status === "Closed") added.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E3E5" } }; });
  });
  sheet.columns.forEach((column) => {
    column.alignment = { vertical: "top", wrapText: true };
    if (["mobile", "mobile_number", "whatsapp_number"].includes(column.key)) column.numFmt = "@";
    if (["preferred_joining_date", "follow_up_date"].includes(column.key)) column.numFmt = "dd-mm-yyyy";
    if (column.key === "created_at") column.numFmt = "dd-mm-yyyy hh:mm";
    if (column.key === "applicable_price") column.numFmt = '₹#,##0.00';
  });
}

export function queueExcelSync() {
  pending = pending.catch(() => {}).then(syncWorkbook);
  return pending;
}

export async function syncWorkbook() {
  if (!exportDir) throw new Error("PRIVATE_EXPORT_DIR is required");
  await fs.mkdir(exportDir, { recursive: true });
  const [[outbox]] = await db.query("SELECT MAX(id) AS max_id FROM excel_sync_outbox WHERE status IN ('Pending', 'Retrying')");
  if (!outbox.max_id) return;
  const [enquiries] = await db.query("SELECT e.enquiry_code, e.full_name, e.mobile_number, e.whatsapp_number, e.email, b.name AS branch, e.enquiry_type, e.membership_plan, e.preferred_timing, e.preferred_joining_date, e.study_purpose, e.customer_message, e.source, e.status, e.follow_up_date, e.management_remarks, e.created_at FROM enquiries e JOIN branches b ON b.id = e.branch_id ORDER BY e.created_at DESC");
  const [admissions] = await db.query("SELECT a.admission_code, a.full_name, a.mobile_number, a.email, b.name AS branch, a.preferred_joining_date, a.membership_preference, a.status, a.created_at FROM admissions a JOIN branches b ON b.id = a.branch_id ORDER BY a.created_at DESC");
  const [memberships] = await db.query("SELECT m.membership_code, m.full_name, m.mobile_number, b.name AS branch, m.plan, m.preferred_timing, m.applicable_price, m.status, m.created_at FROM memberships m JOIN branches b ON b.id = m.branch_id ORDER BY m.created_at DESC");
  const [followUps] = await db.query("SELECT f.id, e.enquiry_code, f.follow_up_date, f.status, f.management_remarks, f.communication_history FROM follow_ups f JOIN enquiries e ON e.id = f.enquiry_id ORDER BY f.follow_up_date ASC");
  const book = new ExcelJS.Workbook();
  const allRecords = [
    ...enquiries.map((x) => ({ reference: x.enquiry_code, type: "Enquiry", name: x.full_name, mobile: x.mobile_number, branch: x.branch, status: x.status, created_at: x.created_at })),
    ...admissions.map((x) => ({ reference: x.admission_code, type: "Admission", name: x.full_name, mobile: x.mobile_number, branch: x.branch, status: x.status, created_at: x.created_at })),
    ...memberships.map((x) => ({ reference: x.membership_code, type: "Membership", name: x.full_name, mobile: x.mobile_number, branch: x.branch, status: x.status, created_at: x.created_at })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  addSheet(book, "All Records", [["Reference", "reference"], ["Type", "type"], ["Name", "name"], ["Mobile", "mobile"], ["Branch", "branch"], ["Status", "status"], ["Submitted", "created_at"]], allRecords);
  const enquiryColumns = [["Reference", "enquiry_code"], ["Name", "full_name"], ["Mobile", "mobile_number"], ["WhatsApp", "whatsapp_number"], ["Email", "email"], ["Branch", "branch"], ["Plan", "membership_plan"], ["Timing", "preferred_timing"], ["Joining Date", "preferred_joining_date"], ["Purpose", "study_purpose"], ["Message", "customer_message"], ["Status", "status"], ["Submitted", "created_at"]];
  addSheet(book, "Enquiries", enquiryColumns, enquiries);
  addSheet(book, "Admissions", [["Reference", "admission_code"], ["Name", "full_name"], ["Mobile", "mobile_number"], ["Email", "email"], ["Branch", "branch"], ["Joining Date", "preferred_joining_date"], ["Plan", "membership_preference"], ["Status", "status"], ["Submitted", "created_at"]], admissions);
  addSheet(book, "Memberships", [["Reference", "membership_code"], ["Name", "full_name"], ["Mobile", "mobile_number"], ["Branch", "branch"], ["Plan", "plan"], ["Timing", "preferred_timing"], ["Price", "applicable_price"], ["Status", "status"], ["Submitted", "created_at"]], memberships);
  ["Gotri", "Nizampura", "Fatehgunj", "Waghodia Road"].forEach((branch) => addSheet(book, branch, enquiryColumns, enquiries.filter((row) => row.branch === branch)));
  addSheet(book, "Follow-ups", [["ID", "id"], ["Reference", "enquiry_code"], ["Follow-up Date", "follow_up_date"], ["Status", "status"], ["Remarks", "management_remarks"], ["History", "communication_history"]], followUps);
  addSheet(book, "Summary", [["Metric", "metric"], ["Value", "value"]], [
    { metric: "Total enquiries", value: enquiries.length }, { metric: "Total admissions", value: admissions.length }, { metric: "Total memberships", value: memberships.length },
    { metric: "Pending enquiries", value: enquiries.filter((x) => x.status === "Pending" || x.status === "New").length }, { metric: "Converted enquiries", value: enquiries.filter((x) => x.status === "Converted").length },
    ...["Gotri", "Nizampura", "Fatehgunj", "Waghodia Road"].map((branch) => ({ metric: `${branch} records`, value: enquiries.filter((x) => x.branch === branch).length })),
  ]);
  const target = path.join(exportDir, "Study_House_Library_Master_Data.xlsx");
  const temp = `${target}.${process.pid}.tmp`;
  await book.xlsx.writeFile(temp);
  await fs.rename(temp, target);
  await db.execute("INSERT INTO excel_sync_logs (status, exported_at, record_count) VALUES ('Success', NOW(), ?)", [enquiries.length + admissions.length + memberships.length]);
  await db.execute("UPDATE excel_sync_outbox SET status = 'Completed', processed_at = NOW(), last_error = NULL WHERE id <= ? AND status IN ('Pending', 'Retrying')", [outbox.max_id]);
}
