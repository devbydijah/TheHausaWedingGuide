# Phase 3: Production Deployment Checklist

## Overview

Deploy the interactive guide to production and integrate with your existing PDF sales flow.

---

## Pre-Deployment Checklist

### ✅ Code Readiness

- [x] Phase 1a: Authentication complete
- [x] Phase 1b: Supabase setup complete
- [x] Phase 1c: Cloud sync & UX polished
- [x] Phase 2: Email integration & product detection complete
- [ ] All features tested locally
- [ ] No console errors in production build
- [ ] Dark mode working
- [ ] Mobile responsive

### ✅ Environment Variables

Ensure ALL of these are set in Vercel:

```bash
# Supabase (for cloud sync)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Authentication
VITE_SHARED_PASSWORD=hausawedding2025

# Paystack (payment processing)
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_TEST_SECRET_KEY=sk_test_xxxxx

# Resend (email delivery)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@hausaroom.com

# Web App (for emails)
WEB_APP_URL=https://guide.hausaroom.com

# Download Security (optional - uses Paystack key as fallback)
DOWNLOAD_TOKEN_SECRET=your_random_secret_here
```

### ✅ External Services

- [ ] Supabase project created and accessible
- [ ] Resend account verified and domain configured
- [ ] Paystack account set up with products
- [ ] Domain DNS configured (if using custom domain)

---

## Deployment Steps

### Step 1: Prepare the Branch

```bash
# Make sure you're on the interactive-guide branch
git checkout interactive-guide

# Ensure all changes are committed
git status
git add .
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin interactive-guide
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. **IMPORTANT:** Change the branch to `interactive-guide`
5. Framework Preset: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Add all environment variables (see checklist above)
9. Click "Deploy"

#### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts, select interactive-guide branch
```

### Step 3: Configure Custom Domain

1. In Vercel project settings → Domains
2. Add `guide.hausaroom.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: guide
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (can take up to 48 hours, usually < 1 hour)

### Step 4: Configure Paystack Products

Follow the instructions in `PAYSTACK_SETUP_GUIDE.md`:

1. Create three products:
   - PDF Guide (`product_type: "pdf"`)
   - Interactive Web App (`product_type: "webapp"`)
   - Complete Bundle (`product_type: "bundle"`)

2. Set up webhook:
   ```
   URL: https://guide.hausaroom.com/api/paystack-webhook
   Event: charge.success
   ```

### Step 5: Test End-to-End Flow

#### Test 1: PDF Purchase

1. Switch Paystack to test mode
2. Purchase PDF product with test card
3. Verify email received with download link
4. Test download link works
5. Verify link expires after 24 hours

#### Test 2: Web App Purchase

1. Purchase web app product with test card
2. Verify email received with login credentials
3. Click web app link
4. Log in with email + password from email
5. Verify dashboard loads
6. Make changes, verify they save
7. Log out and log back in, verify data persists

#### Test 3: Bundle Purchase

1. Purchase bundle product with test card
2. Verify email received with both sections
3. Test PDF download link
4. Test web app login
5. Verify both work correctly

### Step 6: Switch to Live Mode

1. **Paystack:** Switch from test mode to live mode
2. **Vercel:** Verify `PAYSTACK_SECRET_KEY` is the live key (not test)
3. **Webhook:** Update webhook URL if needed
4. **Real Purchase:** Make a real purchase to verify everything works
5. **Refund Test Purchase:** Refund the test purchase in Paystack

---

## Post-Deployment Tasks

### ✅ Monitoring Setup

- [ ] Check Vercel Analytics for errors
- [ ] Monitor Resend dashboard for email delivery
- [ ] Check Supabase for database usage
- [ ] Set up Vercel deployment notifications

### ✅ Customer Communication

- [ ] Update website to show new products
- [ ] Add product descriptions and pricing
- [ ] Create comparison table (PDF vs Web App vs Bundle)
- [ ] Update FAQ with web app info

### ✅ Documentation

- [ ] Customer onboarding guide for web app
- [ ] FAQ updates
- [ ] Support email templates for common issues

---

## Rollback Plan

If something goes wrong:

```bash
# Option 1: Revert to previous deployment in Vercel dashboard
# Go to Deployments → Find previous working deployment → Promote to Production

# Option 2: Rollback code
git revert HEAD
git push origin interactive-guide
# Vercel will auto-deploy the reverted code
```

---

## Troubleshooting Guide

### Issue: "401 Unauthorized" in console

**Solution:** Check Supabase RLS policies are set correctly (run `sql/fix_rls.sql`)

### Issue: Emails not sending

**Solution:**

1. Check Resend API key is set
2. Verify `FROM_EMAIL` domain is verified in Resend
3. Check Vercel logs for email errors

### Issue: Login not working

**Solution:**

1. Verify `VITE_SHARED_PASSWORD` is set in Vercel
2. Check password in email matches environment variable
3. Ensure customer using same email as purchase

### Issue: Data not saving

**Solution:**

1. Check Supabase connection (verify URL and anon key)
2. Check browser console for errors
3. Verify RLS policies allow inserts/updates

### Issue: Webhook not firing

**Solution:**

1. Verify webhook URL in Paystack is correct
2. Check Paystack signature secret matches
3. Review Vercel function logs for errors
4. Test webhook manually using debug page

---

## Success Metrics

Track these to measure success:

- **Conversion Rate:** What % of visitors purchase?
- **Product Mix:** PDF vs Web App vs Bundle sales
- **Average Order Value:** Are bundles boosting AOV?
- **Email Deliverability:** What % of emails reach inbox?
- **Login Success Rate:** What % of web app buyers log in?
- **Active Users:** How many customers use the web app weekly?
- **Support Tickets:** What are common issues?

---

## Next Steps After Launch

1. **Gather Feedback:** Survey first 10-20 customers
2. **Iterate:** Add requested features to web app
3. **Marketing:** Promote the new interactive guide
4. **Upsell:** Email PDF-only customers about web app access
5. **Analytics:** Add Google Analytics or similar to track usage

---

**Status:** 📋 Ready to execute  
**Estimated Time:** 2-3 hours  
**Risk Level:** Low (can rollback easily)  
**Prerequisites:** Phases 1 & 2 complete ✅
