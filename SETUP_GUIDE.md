# Database Setup Guide

This guide covers setting up the SQLite database for the Hausa Wedding Guide application.

## Overview

The application uses SQLite with better-sqlite3 for persistent storage of download tokens. The database auto-creates on first run and requires no manual setup.

## Database Schema

The `downloads.db` file contains a `tokens` table:

```sql
CREATE TABLE tokens (
    email TEXT NOT NULL,
    token TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    downloads_remaining INTEGER NOT NULL DEFAULT 3,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    last_download_at INTEGER
);
```

## Automatic Setup

The database and tables are created automatically when the application starts. No manual intervention is required.

## Environment Variables

No additional environment variables are needed for the database. The SQLite file (`downloads.db`) is created in the project root.

## Backup

To backup the database:

```bash
cp downloads.db downloads.backup.db
```

## Migration (if needed)

If you need to modify the schema, update the database initialization code in `lib/database.cjs`.

## Troubleshooting

- **Permission issues**: Ensure the application has write permissions to create `downloads.db`
- **Corruption**: Delete `downloads.db` and restart the app (tokens will be lost)
- **Performance**: SQLite is suitable for this low-traffic application

---

**Note**: This replaces the previous Supabase setup. The application now uses local SQLite for simplicity and reliability.

- `/sql/setup.sql` - Complete database setup
- `/api/email.js` - Clean Resend email integration
- `/api/get-download-details.js` - Updated to use direct email
- `/api/test-setup.js` - Setup verification endpoint
