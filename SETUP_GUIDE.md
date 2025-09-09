# Clean Supabase Setup Guide

## Step 1: Run SQL Setup in Supabase

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `/sql/setup.sql`
4. Click "Run" to execute the setup

This will create:

- ✅ `sales` table with proper structure
- ✅ Row Level Security policies
- ✅ Storage bucket and policies
- ✅ Performance indexes

## Step 2: Upload PDF to Storage

1. Go to Supabase Storage
2. Navigate to the `private` bucket
3. Upload your `Hausa_Wedding_Guide.pdf` file
4. Make sure it's in the root of the bucket

## Step 3: Verify Environment Variables

Make sure these are set in your Vercel project:

```
SUPABASE_URL=https://govkdzssysvyivpgskrw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=private
RESEND_API_KEY=re_your_resend_key
PAYSTACK_SECRET=sk_test_your_paystack_key
PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```

## Step 4: Test the Setup

After completing steps 1-3, visit:
`https://your-vercel-domain.vercel.app/api/test-setup`

This will verify:

- ✅ Database connection
- ✅ Sales table exists
- ✅ Storage bucket access
- ✅ Email configuration

## Step 5: Test Complete Flow

1. Visit your main site
2. Enter an email address
3. Click "Get Instant Access"
4. Complete Paystack payment with test card
5. You should receive both:
   - Payment confirmation from Paystack
   - Download instructions via email from your system

---

## What's Changed

- ❌ Removed Supabase Edge Functions (simpler setup)
- ✅ Direct Resend API integration
- ✅ Clean, single SQL setup file
- ✅ Proper error handling and logging
- ✅ Test endpoint to verify setup

## Files Created/Updated

- `/sql/setup.sql` - Complete database setup
- `/api/email.js` - Clean Resend email integration
- `/api/get-download-details.js` - Updated to use direct email
- `/api/test-setup.js` - Setup verification endpoint
