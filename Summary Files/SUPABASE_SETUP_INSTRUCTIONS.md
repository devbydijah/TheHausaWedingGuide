# Supabase Database Setup Instructions

## ✅ Environment Variables Already Set

You've successfully added these to Vercel:

- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

## 📝 Next Step: Create Database Tables

### 1. Open Supabase SQL Editor

Visit: [https://supabase.com/dashboard/project/nhmuzzvuwcecgfejdmyi/editor](https://supabase.com/dashboard/project/nhmuzzvuwcecgfejdmyi/editor)

Click **SQL Editor** → **New Query**

### 2. Copy & Paste This SQL Script

Open the file: `sql/complete_setup.sql` in your project folder

Copy **ALL 380 lines** of SQL code

Paste into the Supabase SQL Editor

### 3. Run the Script

Click **Run** (or press Ctrl+Enter)

Wait 5-10 seconds for completion

You should see: "Success. No rows returned"

### 4. Verify Tables Created

Run this query to verify:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('web_app_users', 'user_progress');
```

You should see 2 rows returned:

- web_app_users
- user_progress

## ✅ What This Creates

### Tables:

1. **web_app_users** - Stores customer purchases and access
   - Email, paystack reference, bride name, wedding date
   - Access expiration (20 days from first login)
   - Onboarding status

2. **user_progress** - Stores planning data
   - Vision quiz results
   - Budget builder data
   - Vendor list
   - Timeline tasks
   - All data in JSONB format

### Security:

- Row Level Security (RLS) policies
- Users can only access their own data
- Webhook can insert new users

### Functions:

- `check_user_access()` - Validates if user has active access
- `update_login_tracking()` - Tracks login count and sets expiry
- `complete_onboarding()` - Saves bride name (immutable after set)

### Triggers:

- Prevents bride_name from being changed after onboarding

## 🚀 After Database Setup

1. **Redeploy on Vercel** (if not already done)
   - Go to Deployments tab
   - Click ⋮ on latest deployment
   - Click "Redeploy"

2. **Test the Flow**
   - Buy Web Guide (₦100) from Paystack
   - Check email for signup link
   - Create account with your own password
   - Complete onboarding (bride name + wedding date)
   - Access interactive planner

## 📞 Troubleshooting

### "Tables already exist" error:

- This is OK! It means tables were created before
- You can skip running the script

### "Permission denied" error:

- Make sure you're logged into Supabase
- Check you're in the correct project

### "Function already exists" error:

- This is OK! Just means setup was run before
- Your database is ready to use

## ✅ Success Checklist

After running the SQL script, verify:

- [ ] Tables exist (run verification query above)
- [ ] No error messages in SQL editor
- [ ] Vercel redeployed with new env vars
- [ ] Ready to test with real purchase

---

**Next:** Test the complete flow with a Paystack purchase!
