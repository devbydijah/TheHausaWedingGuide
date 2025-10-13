# Complete Environment Variables Guide

## ✅ Required Environment Variables

Set these in your Vercel project dashboard under **Settings → Environment Variables**:

### 1. Payment Processing (Paystack)

| Variable | Value | Example | Notes |
|----------|-------|---------|-------|
| `PAYSTACK_SECRET_KEY` | Your live secret key | `sk_live_...` | For production payments |
| `PAYSTACK_TEST_SECRET_KEY` | Your test secret key | `sk_test_...` | Optional, for testing |

**Where to get:** [Paystack Dashboard → Settings → API Keys & Webhooks](https://dashboard.paystack.com/#/settings/developers)

---

### 2. Email Service (Resend)

| Variable | Value | Example | Notes |
|----------|-------|---------|-------|
| `RESEND_API_KEY` | Your API key | `re_...` | Required for sending emails |
| `FROM_EMAIL` | Verified sender email | `noreply@hausaroom.ng` | Must be verified in Resend |
| `FROM_NAME` | Sender display name | `Hausa Wedding Guide` | Shows in email client |

**Email Format:** Customers will see: `Hausa Wedding Guide <noreply@hausaroom.ng>`

**Where to get:** [Resend Dashboard → API Keys](https://resend.com/api-keys)

**Domain Setup:** You must verify your domain in Resend and add:
- SPF record
- DKIM record
- DMARC record

---

### 3. Database & Authentication (Supabase)

| Variable | Value | Example | Notes |
|----------|-------|---------|-------|
| `VITE_SUPABASE_URL` | Project URL | `https://xxxxx.supabase.co` | Public, embedded in frontend |
| `VITE_SUPABASE_ANON_KEY` | Anonymous key | `eyJhbGciOiJIUzI1NiI...` | Public, safe for frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGciOiJIUzI1NiI...` | **SECRET!** Server-only |

**Where to get:** [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/_/settings/api)

⚠️ **Security:** 
- `VITE_` prefix = Public (frontend accessible)
- No `VITE_` = Secret (backend only)
- Never commit service role key to git!

---

## 📋 Complete Checklist

Copy this to verify all variables are set:

```env
# Payment
✅ PAYSTACK_SECRET_KEY=sk_live_...
✅ PAYSTACK_TEST_SECRET_KEY=sk_test_... (optional)

# Email
✅ RESEND_API_KEY=re_...
✅ FROM_EMAIL=noreply@hausaroom.ng
✅ FROM_NAME=Hausa Wedding Guide

# Database (Frontend - public)
✅ VITE_SUPABASE_URL=https://nhmuzzvuwcecgfejdmyi.supabase.co
✅ VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database (Backend - secret)
✅ SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 How Each Variable is Used

### Payment Flow
```
Customer pays → Paystack webhook uses PAYSTACK_SECRET_KEY 
             → Verifies transaction
             → Sends email using RESEND_API_KEY
             → Creates user in Supabase using SUPABASE_SERVICE_ROLE_KEY
```

### Email Flow
```
Email sent from: FROM_NAME <FROM_EMAIL>
Example: "Hausa Wedding Guide <noreply@hausaroom.ng>"
```

### Authentication Flow
```
Frontend uses: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
Backend uses: SUPABASE_SERVICE_ROLE_KEY (in webhook)
```

---

## ⚙️ Setting Variables in Vercel

### Method 1: Via Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter Name, Value
6. Select **Production**, **Preview**, **Development**
7. Click **Save**
8. Repeat for all variables

### Method 2: Via CLI
```bash
vercel env add PAYSTACK_SECRET_KEY production
vercel env add RESEND_API_KEY production
vercel env add FROM_EMAIL production
vercel env add FROM_NAME production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

---

## 🔄 After Adding Variables

**You MUST redeploy** for changes to take effect:

1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**
4. ✅ Check "Use existing Build Cache"
5. Click **Redeploy**

---

## 🧪 Testing Variables

### Test Email Service
```bash
# Check FROM_NAME is working
# Send a test purchase email and verify sender shows as:
# "Hausa Wedding Guide <noreply@hausaroom.ng>"
```

### Test Supabase Connection
```bash
# Buy Web Guide (₦100)
# Check if user record created in web_app_users table
```

### Test Payment Processing
```bash
# Use Paystack test card
# Verify webhook receives payment
# Check email sent successfully
```

---

## 🚨 Troubleshooting

### "Email not delivered"
- ✅ Check `RESEND_API_KEY` is set
- ✅ Verify `FROM_EMAIL` domain in Resend
- ✅ Check SPF/DKIM/DMARC records
- ✅ Verify `FROM_NAME` is set (optional but recommended)

### "Supabase connection failed"
- ✅ Check `VITE_SUPABASE_URL` format (must include https://)
- ✅ Verify `VITE_SUPABASE_ANON_KEY` is correct
- ✅ Ensure variables have `VITE_` prefix

### "Webhook authentication failed"
- ✅ Check `PAYSTACK_SECRET_KEY` is set
- ✅ Verify key matches your Paystack account
- ✅ Use live key for production, test key for testing

### "Cannot create user in database"
- ✅ Check `SUPABASE_SERVICE_ROLE_KEY` is set
- ✅ Verify service role key is correct (not anon key)
- ✅ Check database tables exist (run complete_setup.sql)

---

## 📞 Support Resources

- **Paystack Docs:** https://paystack.com/docs
- **Resend Docs:** https://resend.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Env Vars:** https://vercel.com/docs/environment-variables

---

**Last Updated:** October 13, 2025  
**Status:** All variables implemented and tested ✅
