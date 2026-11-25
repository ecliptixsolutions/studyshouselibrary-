import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const exportsDir = process.env.PRIVATE_EXPORT_DIR;
const backupsDir = process.env.PRIVATE_BACKUP_DIR;
const stamp = new Date().toISOString().slice(0, 10);

if (!exportsDir || !backupsDir || !process.env.MYSQL_BACKUP_DEFAULTS_FILE) throw new Error("Backup environment is incomplete.");
await fs.mkdir(backupsDir, { recursive: true });
await fs.copyFile(path.join(exportsDir, "Study_House_Library_Master_Data.xlsx"), path.join(backupsDir, `Study_House_Library_Backup_${stamp}.xlsx`));
await new Promise(async (resolve, reject) => {
  const handle = await fs.open(path.join(backupsDir, `study_house_library_${stamp}.sql`), "w");
  const dump = spawn("mysqldump", [`--defaults-extra-file=${process.env.MYSQL_BACKUP_DEFAULTS_FILE}`, "--single-transaction", "--routines", process.env.MYSQL_DATABASE], { stdio: ["ignore", "pipe", "pipe"] });
  dump.stdout.pipe(handle.createWriteStream());
  dump.on("error", reject);
  dump.on("exit", async (code) => {
    await handle.close();
    code === 0 ? resolve() : reject(new Error(`mysqldump exited with ${code}`));
  });
});
const retention = Number(process.env.BACKUP_RETENTION_DAYS || 30) * 86400000;
for (const file of await fs.readdir(backupsDir)) { const target = path.join(backupsDir, file); if (Date.now() - (await fs.stat(target)).mtimeMs > retention) await fs.rm(target); }
