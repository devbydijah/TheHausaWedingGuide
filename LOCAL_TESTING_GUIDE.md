# Local Testing Guide - Interactive Wedding Guide

## Overview

Test the complete interactive wedding guide system locally before production deployment.

## Prerequisites

- Paystack account with test keys
- Resend account with verified domain
- Supabase project (already configured)

## Step 1: Configure Environment Variables

Update your `.env` file with actual credentials:

```bash
# Keep existing Supabase config
VITE_SUPABASE_URL=https://nhmuzzvuwcecgfejdmyi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add your Paystack test keys
PAYSTACK_TEST_SECRET_KEY=sk_test_your_test_key_here
PAYSTACK_SECRET_KEY=sk_live_your_live_key_here

# Add your Resend credentials
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@hausaroom.com

# Keep existing shared password
VITE_SHARED_PASSWORD=HausaWedding2025
```

## Step 2: Start Local Development Server

```bash
npm install
npm run dev
```

Server will run on: http://localhost:5173

## Step 3: Test Authentication Flow

1. Visit: http://localhost:5173
2. Should see login gate
3. Enter password: `HausaWedding2025`
4. Should access the interactive guide

## Step 4: Test Cloud Sync

1. Make changes to wedding details
2. Should see "Changes saved ✓" notification
3. Refresh page - changes should persist
4. Open incognito window - changes should be isolated

## Step 5: Test Webhook Locally

### Option A: Use Debug Page

1. Visit: http://localhost:5173/debug.html?secret=hausadebug2024
2. Test API endpoints
3. Simulate webhook calls

### Option B: Use ngrok for Live Webhooks

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 5173

# Copy the https://xxxxx.ngrok.io URL
```

Configure Paystack webhook to point to: `https://xxxxx.ngrok.io/api/paystack-webhook`

## Step 6: Test Email Templates

### Test PDF Purchase Email

```bash
curl -X POST http://localhost:5173/api/paystack-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "test_pdf_123",
      "customer": {"email": "test@example.com"},
      "metadata": {"product_type": "pdf"}
    }
  }'
```

### Test Web App Purchase Email

```bash
curl -X POST http://localhost:5173/api/paystack-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "test_webapp_123",
      "customer": {"email": "test@example.com"},
      "metadata": {"product_type": "webapp"}
    }
  }'
```

### Test Bundle Purchase Email

```bash
curl -X POST http://localhost:5173/api/paystack-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "test_bundle_123",
      "customer": {"email": "test@example.com"},
      "metadata": {"product_type": "bundle"}
    }
  }'
```

## Step 7: Verify Email Delivery

1. Check Resend dashboard for sent emails
2. Verify email content includes correct links
3. Test download links (PDF) and login links (Web App)

## Step 8: Test Download Limits

1. Make multiple download requests with same token
2. Verify 3-download limit is enforced
3. Test token expiration (24 hours)

## Step 9: Test Error Handling

1. Try invalid tokens
2. Try expired tokens
3. Try tokens with exceeded download limits
4. Verify appropriate error messages

## Success Criteria

- ✅ Authentication works
- ✅ Cloud sync saves data
- ✅ Webhook processes payments
- ✅ Emails send successfully
- ✅ Download links work
- ✅ Login links work
- ✅ Error handling works
- ✅ No console errors

## Common Issues & Fixes

### Issue: Emails not sending

**Fix:** Check Resend API key and domain verification

### Issue: 401 Unauthorized (Supabase)

**Fix:** Run `sql/fix_rls.sql` in Supabase dashboard

### Issue: Webhook signature invalid

**Fix:** Ensure PAYSTACK_TEST_SECRET_KEY matches Paystack dashboard

### Issue: Login not working

**Fix:** Verify VITE_SHARED_PASSWORD matches email template

## Next Steps

Once local testing passes:

1. Deploy to Vercel
2. Configure production environment variables
3. Set up production webhook URL
4. Test with real Paystack payments
5. Go live!</content>
   <parameter name="filePath">c:\Users\khadi\Desktop\TheHausaWedingGuide\LOCAL_TESTING_GUIDE.md
