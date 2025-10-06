# Local Testing Guide - Interactive Wedding Guide

## ✅ Current Status
- ✅ Environment variables configured with real credentials
- ✅ Vite development server running on http://localhost:5173
- ✅ Frontend accessible in browser
- 🔄 API endpoints need Vercel dev for testing

## Next Steps for Testing

### Step 1: Test Authentication Flow

1. **Open the app**: Visit http://localhost:5173
2. **Test login**:
   - Enter any email: `test@example.com`
   - Enter password: `HausaWedding2025`
   - Should access the interactive guide
3. **Test logout**: Click logout and verify it returns to login

### Step 2: Test Cloud Sync

1. **Make changes**: Fill out some wedding details
2. **Check notifications**: Should see "Changes saved ✓"
3. **Refresh page**: Data should persist
4. **Test isolation**: Open incognito window - should have separate data

### Step 3: Test API Endpoints (Requires Vercel Dev)

Stop the current Vite server (Ctrl+C) and run:

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Start Vercel dev server (includes API routes)
vercel dev
```

Then test webhook with:

```bash
# Test Web App purchase email
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

### Step 4: Verify Email Delivery

1. Check Resend dashboard: https://resend.com/emails
2. Verify email contains correct login link
3. Test login with email from webhook test

### Step 5: Test Error Handling

1. Try wrong password: Should show error message
2. Try invalid email format: Should handle gracefully
3. Test expired sessions: Clear localStorage and try accessing

## Success Criteria

- ✅ Authentication works with correct password
- ✅ Cloud sync saves data (check browser console for Supabase calls)
- ✅ Webhook sends emails (when using Vercel dev)
- ✅ Login links work
- ✅ Data persists across page refreshes
- ✅ No console errors in frontend

## If Issues Occur

### Frontend not loading
- Check browser console for errors
- Verify Vite server is running on port 5173

### Authentication not working
- Check .env file has `VITE_SHARED_PASSWORD=HausaWedding2025`
- Verify password is case-sensitive

### Cloud sync not working
- Check browser console for Supabase errors
- Verify Supabase URL and anon key in .env

### Emails not sending
- Check Resend API key is correct
- Verify domain is configured in Resend

## Ready for Production?

Once local testing passes, proceed to:

1. **Deploy to Vercel**: `vercel --prod`
2. **Configure production env vars** in Vercel dashboard
3. **Set up Paystack webhook** to production URL
4. **Test with real payments**

**Current Status**: Ready to test frontend authentication and cloud sync! 🚀</content>
   <parameter name="filePath">c:\Users\khadi\Desktop\TheHausaWedingGuide\LOCAL_TESTING_GUIDE.md
