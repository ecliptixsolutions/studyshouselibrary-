# Study House Library private backend

This service is the only process that can access MySQL or the private Excel workbook. Keep `backend/.env` and `PRIVATE_EXPORT_DIR` outside the website's public root.

## Deploy

1. Create a dedicated MySQL user with privileges only on `study_house_library`; run `mysql -u root -p < backend/migrations/001_initial.sql`.
2. Copy `backend/.env.example` to `backend/.env`, set all values, and use the same long random value for `INTERNAL_API_TOKEN` and the website's `MYSQL_API_INTERNAL_TOKEN`.
3. Run both private processes under systemd or a process manager: `npm run backend` and `npm run backend:worker`. Put the API behind HTTPS (for example, Nginx on a Hostinger VPS) and set `ALLOWED_ORIGIN` to the public site origin.
4. Add a daily cron job: `0 2 * * * cd /srv/study-house-library && /usr/bin/npm run backup`. The MySQL defaults file must be mode `0600` and contain the MySQL backup account credentials.
5. Set the public site's server-only `MYSQL_API_URL` and `MYSQL_API_INTERNAL_TOKEN` values. Run the app build and submit a real test enquiry. Confirm the database row and server-only workbook exist; never expose either directory via the web server.

## Restore

Restore the timestamped SQL file with `mysql --defaults-extra-file=/etc/study-house-library/mysql-backup.cnf study_house_library < backup.sql`, then restore the matching workbook only if needed. MySQL remains the authoritative source; regenerate the workbook after a restore by submitting a controlled sync or restarting the worker.
