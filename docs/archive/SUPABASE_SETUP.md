# 🚀 Supabase Setup Guide - Phase 1b

## Step-by-Step Instructions

### Prerequisites

- ✅ Supabase client installed (`@supabase/supabase-js`)
- ✅ Supabase client configured (`src/lib/supabase.js`)
- ✅ Database schema ready (`sql/supabase_schema.sql`)
- ✅ Cloud sync hook created (`src/hooks/useSyncToCloud.js`)

---

## 1. Create Supabase Project (5 minutes)

### 1.1 Sign Up / Login

1. Visit: https://supabase.com
2. Click **"Start your project"** or **"Sign in"**
3. Use GitHub OAuth for quick signup

### 1.2 Create New Project

1. Click **"New Project"**
2. Select your organization (or create one)
3. Fill in project details:
   - **Name:** `hausa-wedding-guide`
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to Nigeria (e.g., `eu-west-1` or `us-east-1`)
   - **Pricing Plan:** Free tier is sufficient for MVP

4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

---

## 2. Get API Credentials (2 minutes)

### 2.1 Navigate to Settings

1. In your project dashboard, click **Settings** (gear icon, bottom left)
2. Click **API** in the sidebar

### 2.2 Copy Credentials

You'll need these two values:

**Project URL:**

```
https://xxxxxxxxxxxxx.supabase.co
```

**Anon/Public Key:** (starts with `eyJ...`)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **DO NOT** copy the `service_role` key - that's for backend only!

---

## 3. Run Database Schema (5 minutes)

### 3.1 Open SQL Editor

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**

### 3.2 Paste and Run Schema

1. Open the file: `sql/supabase_schema.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **"Run"** (bottom right)

### 3.3 Verify Success

You should see:

```
Success. No rows returned
```

Check tables were created:

1. Click **Database** (left sidebar)
2. Click **Tables**
3. You should see:
   - ✅ `web_app_users`
   - ✅ `user_progress`

---

## 4. Configure Environment Variables (2 minutes)

### 4.1 Update Local `.env`

Open `.env` file and replace placeholders:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.2 Restart Dev Server

The dev server should auto-restart when `.env` changes.

If not, stop and restart:

```bash
# Press Ctrl+C to stop
npm run dev
```

---

## 5. Test Cloud Sync (5 minutes)

### 5.1 Test Connection

1. Open browser console (F12)
2. Visit: `http://localhost:5174/?guide=1`
3. Login with password: `HausaWedding2025`
4. Check console for logs:
   ```
   ✨ Created new user in cloud: [your-email]
   🆕 Initialized new progress in cloud
   ```

### 5.2 Test Data Sync

1. Fill in some data (e.g., Vision Quiz, Budget)
2. Wait 2 seconds (debounced save)
3. Check console for: `✅ Synced to cloud`
4. Refresh page - data should persist

### 5.3 Verify in Supabase

1. Go to Supabase dashboard
2. Click **Table Editor** → **web_app_users**
3. You should see your email
4. Click **user_progress** → your data should be there

---

## 6. Multi-Device Test (Optional)

### Test Cloud Sync Across Devices

1. Login on Device 1, add data
2. Wait for sync (check console: `✅ Synced to cloud`)
3. Login on Device 2 with same email
4. Data should automatically load from cloud

---

## 7. Add to Vercel (Production Setup)

### 7.1 Go to Vercel Dashboard

1. Visit: https://vercel.com
2. Select your project: `TheHausaWedingGuide`

### 7.2 Add Environment Variables

1. Click **Settings** → **Environment Variables**
2. Add these two variables:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://xxxxxxxxxxxxx.supabase.co`
   - **Environment:** Production, Preview, Development
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Environment:** Production, Preview, Development

3. Click **Save**

### 7.3 Redeploy

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## 8. Troubleshooting

### Issue: "Supabase not configured" in console

**Solution:** Check `.env` file has correct values and dev server restarted

### Issue: "permission denied for table web_app_users"

**Solution:** RLS policies not applied correctly. Re-run schema SQL

### Issue: "duplicate key value violates unique constraint"

**Solution:** User already exists. This is normal on re-login.

### Issue: Data not syncing

**Solutions:**

1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Check Supabase dashboard → Logs for errors
4. Ensure RLS policies allow insert/update

### Issue: "Invalid JWT" error

**Solution:** Session expired. Logout and login again.

---

## 9. Verify Phase 1b Complete ✅

### Checklist:

- [ ] Supabase project created
- [ ] Database schema deployed (tables + RLS)
- [ ] Environment variables configured (local + Vercel)
- [ ] Dev server restarted and running
- [ ] Test user created in `web_app_users`
- [ ] Test data synced to `user_progress`
- [ ] Console shows: `✅ Synced to cloud`
- [ ] Data persists across page reloads
- [ ] Multi-device sync tested (optional)

---

## 10. Next Steps: Phase 1c - Integration

Once Supabase is working, we'll:

1. Replace `useLocalProgress` with `useSyncToCloud` in `InteractiveGuide.jsx`
2. Add email input to `LoginGate` for user identification
3. Test full flow: login → sync → multi-device
4. Add sync status indicator in UI

**Ready to proceed to Phase 1c?** ✅

---

## Quick Reference

### Supabase Dashboard URLs

- **Project:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- **Table Editor:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
- **SQL Editor:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
- **API Settings:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api
- **Logs:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID/logs/explorer

### Environment Variables

```env
# Local (.env)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel (Dashboard → Settings → Environment Variables)
Same as above, added to all environments
```

### Console Log Messages

- `✨ Created new user in cloud` → New user registered
- `☁️ Loaded data from cloud` → Cloud data loaded successfully
- `🔄 Migrated localStorage data to cloud` → Local data moved to cloud
- `✅ Synced to cloud` → Auto-save successful
- `📦 Cloud sync disabled - using localStorage only` → Supabase not configured

---

**Need Help?** Check Supabase documentation: https://supabase.com/docs
