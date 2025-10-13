# Environment Variables Setup - Complete Checklist ✅

## 📋 Overview

This document lists ALL environment variables needed for the Hausa Wedding Guide application to work properly.

---

## ✅ Current Status Check

### Local Development (.env file):

- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ PAYSTACK_SECRET_KEY
- ✅ PAYSTACK_TEST_SECRET_KEY
- ✅ RESEND_API_KEY
- ✅ FROM_EMAIL
- ✅ FROM_NAME
- ✅ SUPABASE_SERVICE_ROLE_KEY

### Vercel Production:

All variables must be added to Vercel Dashboard → Settings → Environment Variables

---

## 🔑 Required Environment Variables

### 1. Supabase (Database & Auth)

```bash
# FRONTEND (Public - embedded in client bundle)
VITE_SUPABASE_URL=https://nhmuzzvuwcecgfejdmyi.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# BACKEND (Secret - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Where to get:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/nhmuzzvuwcecgfejdmyi/settings/api)
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`
4. Copy **service_role key** (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT**:

- `VITE_` prefix = Public (safe to expose in frontend)
- No `VITE_` = Secret (never expose to client)

---

### 2. Paystack (Payment Processing)

```bash
# LIVE (Production payments)
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key_here

# TEST (Development/testing) - Optional
PAYSTACK_TEST_SECRET_KEY=sk_test_your_test_secret_key_here
```

**Where to get:**

1. Go to [Paystack Dashboard → Settings → API Keys](https://dashboard.paystack.com/#/settings/developers)
2. Copy **Live Secret Key** → `PAYSTACK_SECRET_KEY`
3. Copy **Test Secret Key** → `PAYSTACK_TEST_SECRET_KEY`

---

### 3. Resend (Email Service)

```bash
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=noreply@hausaroom.ng
FROM_NAME=Hausa Wedding Guide
```

**Where to get:**

1. Go to [Resend Dashboard → API Keys](https://resend.com/api-keys)
2. Create new API key → `RESEND_API_KEY`
3. Set your verified sender email → `FROM_EMAIL`
4. Choose display name → `FROM_NAME`

⚠️ **IMPORTANT**: Domain `hausaroom.ng` must be verified in Resend with SPF, DKIM, and DMARC records.

---

## 📝 Setup Instructions

### Local Development:

1. **Check .env file exists:**

   ```bash
   ls .env
   ```

2. **Verify all variables are set:**

   ```bash
   cat .env
   ```

3. **Add missing SUPABASE_SERVICE_ROLE_KEY:**
   - Get from Supabase Dashboard (see above)
   - Add to `.env` file:
     ```
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
     ```

4. **Never commit .env to git!**
   - Already in `.gitignore` ✅
   - Contains secrets that would compromise security

---

### Vercel Production:

1. **Go to Vercel Dashboard:**
   - Project: the-hausa-weding-guide
   - Settings → Environment Variables

2. **Add each variable:**
   - Click "Add New"
   - Name: `PAYSTACK_SECRET_KEY`
   - Value: `sk_live_your_actual_secret_key`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

3. **Repeat for all variables:**
   - PAYSTACK_SECRET_KEY
   - PAYSTACK_TEST_SECRET_KEY
   - RESEND_API_KEY
   - FROM_EMAIL
   - FROM_NAME
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

4. **Redeploy:**
   - Go to Deployments
   - Click ⋮ → Redeploy
   - ✅ Use existing build cache

---

## 🧪 Verification Tests

### Test Email Functionality:

```bash
# 1. Webhook should send emails after payment
# 2. Check Vercel logs for email service errors
# 3. Verify FROM_NAME appears correctly in emails
```

### Test Supabase Connection:

```bash
# 1. Signup page should work without localStorage warning
# 2. User data should save to cloud
# 3. Check browser console for Supabase errors
```

### Test Payment Processing:

```bash
# 1. Complete test purchase with test card
# 2. Webhook should detect product ID correctly
# 3. Appropriate email should be sent
```

---

## 🚨 Common Issues & Solutions

### Issue: "Supabase credentials not configured"

**Solution:** Check `VITE_` prefix is present for frontend variables

### Issue: Emails not sending

**Solution:**

1. Verify `RESEND_API_KEY` is correct
2. Check domain is verified in Resend
3. Confirm `FROM_EMAIL` domain matches verified domain

### Issue: Webhook errors

**Solution:**

1. Check `PAYSTACK_SECRET_KEY` is set in Vercel
2. Verify `SUPABASE_SERVICE_ROLE_KEY` for user creation
3. Check Vercel logs for specific error messages

### Issue: CSP errors in console

**Solution:** Already fixed in `vercel.json` with Google Fonts and Supabase domains

---

## 📊 Environment Variable Summary Table

| Variable                    | Type   | Location | Purpose                   |
| --------------------------- | ------ | -------- | ------------------------- |
| `VITE_SUPABASE_URL`         | Public | Frontend | Supabase project URL      |
| `VITE_SUPABASE_ANON_KEY`    | Public | Frontend | Supabase public key       |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Backend  | Admin database access     |
| `PAYSTACK_SECRET_KEY`       | Secret | Backend  | Live payment processing   |
| `PAYSTACK_TEST_SECRET_KEY`  | Secret | Backend  | Test payment processing   |
| `RESEND_API_KEY`            | Secret | Backend  | Email sending             |
| `FROM_EMAIL`                | Config | Backend  | Email sender address      |
| `FROM_NAME`                 | Config | Backend  | Email sender display name |

---

## ✅ Final Checklist

Before going live, verify:

- [ ] All 8 environment variables set in Vercel
- [ ] `.env` file has all variables for local development
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added to both local and Vercel
- [ ] Domain verified in Resend (SPF, DKIM, DMARC)
- [ ] Paystack webhook URL configured
- [ ] Test purchase completes successfully
- [ ] Email received with correct FROM_NAME
- [ ] Supabase user creation working
- [ ] No console errors on signup page

---

**Last Updated:** October 13, 2025  
**Status:** All variables documented ✅ | Missing: SUPABASE_SERVICE_ROLE_KEY in production
