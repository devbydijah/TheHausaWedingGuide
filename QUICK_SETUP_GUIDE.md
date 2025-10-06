# Paystack Configuration Summary

## Quick Reference - Copy & Paste These Values

### Storefront URL
```
https://paystack.shop/hausaroom-wedding-guide-GLQSt
```

### Webhook URL
```
https://the-hausa-weding-guide.vercel.app/api/paystack-webhook
```

### Product 1: Hausa Wedding Guide PDF
- **Name**: `Hausa Wedding Guide PDF`
- **Price**: ₦100
- **Redirect URL**: `https://the-hausa-weding-guide.vercel.app/?claim=1`
- **Description**: Comprehensive PDF guide for authentic Hausa wedding planning

### Product 2: Interactive Wedding Guide
- **Name**: `Interactive Wedding Guide`
- **Price**: ₦100
- **Redirect URL**: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`
- **Description**: Interactive web application for comprehensive wedding planning

---

## Paystack Dashboard Setup Steps

### 1. Configure Webhook
1. Log into https://dashboard.paystack.com
2. Go to **Settings** → **Webhooks**
3. Click **Add Webhook URL**
4. Paste: `https://the-hausa-weding-guide.vercel.app/api/paystack-webhook`
5. Select events: `charge.success` (or all events)
6. Save

### 2. Add Products to Storefront
1. Go to **Commerce** → **Storefront** (or find your storefront)
2. Open your storefront: `hausaroom-wedding-guide-GLQSt`

**Add Product #1:**
- Click "Add Product"
- Name: `Hausa Wedding Guide PDF`
- Price: `100`
- Currency: NGN (₦)
- Redirect URL: `https://the-hausa-weding-guide.vercel.app/?claim=1`
- Description: `Comprehensive PDF guide for authentic Hausa wedding planning`
- Save

**Add Product #2:**
- Click "Add Product"
- Name: `Interactive Wedding Guide`
- Price: `100`
- Currency: NGN (₦)
- Redirect URL: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`
- Description: `Interactive web application for comprehensive wedding planning`
- Save

---

## How It Works

### Customer Flow
1. Customer visits your landing page (PDF or Interactive)
2. Clicks "Buy Now" button
3. Redirected to: `https://paystack.shop/hausaroom-wedding-guide-GLQSt`
4. Browses products and selects one
5. Completes payment
6. **Immediately redirected** to claim page based on purchase
7. **Receives email** within 60 seconds with download/access link

### Behind the Scenes
- **Webhook receives** payment notification
- **Detects product type** from product name (PDF vs Interactive)
- **Generates** secure token or credentials
- **Sends email** with appropriate content and links
- **Customer gets both** instant redirect + email backup

---

## Testing

Use Paystack test card for testing:
- **Card Number**: 4084 0840 8408 4081
- **CVV**: 408
- **Expiry**: Any future date
- **PIN**: 0000

### Test Checklist
- [ ] Webhook configured and saved
- [ ] Both products added to storefront
- [ ] Visit PDF landing page, click Buy, check redirect
- [ ] Visit Interactive landing page, click Buy, check redirect
- [ ] Complete test purchase for PDF guide
- [ ] Verify email received with PDF download link
- [ ] Complete test purchase for Interactive guide
- [ ] Verify email received with access credentials
- [ ] Test both redirect URLs work after payment

---

## Current Deployment URLs

### Main Deployments (Production)
- **PDF Guide**: https://the-hausa-weding-guide.vercel.app
- **Interactive Guide**: https://the-hausa-weding-guide-interactive.vercel.app

### Both point to same storefront
All "Buy Now" buttons redirect to: `https://paystack.shop/hausaroom-wedding-guide-GLQSt`

---

## Environment Variables

Ensure these are set in Vercel:

```bash
# Paystack Keys
PAYSTACK_TEST_SECRET_KEY=sk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx

# Resend Email
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@hausaroom.com

# Optional
DOWNLOAD_TOKEN_SECRET=your-secret-here
```

---

## Production Readiness

### Before Going Live:
1. ✅ Webhook URL configured
2. ✅ Both products added to storefront
3. ✅ Redirect URLs set for each product
4. ✅ Test purchases completed successfully
5. ⏳ Switch `PAYSTACK_SECRET_KEY` to live key
6. ⏳ Verify FROM_EMAIL domain (SPF/DKIM)
7. ⏳ Test with real payment
8. ⏳ Monitor webhook logs

### To Switch to Live:
1. Update `PAYSTACK_SECRET_KEY` in Vercel to your **live** key
2. Keep `PAYSTACK_TEST_SECRET_KEY` for testing
3. Redeploy if needed (Vercel usually auto-deploys on env changes)
4. Test with a small real payment
5. Monitor first few transactions closely

---

## Support & Troubleshooting

### If webhooks aren't working:
1. Check webhook URL is exactly: `https://the-hausa-weding-guide.vercel.app/api/paystack-webhook`
2. Verify `charge.success` event is selected
3. Check Vercel logs for webhook errors
4. Ensure Paystack keys are correct in .env

### If emails aren't sending:
1. Verify `RESEND_API_KEY` is set
2. Check `FROM_EMAIL` domain is verified in Resend
3. Look for errors in Vercel function logs
4. Test email service separately

### If product detection fails:
1. Ensure product names contain "PDF" or "Interactive"
2. Check webhook logs to see what data Paystack sends
3. Verify webhook signature validation is passing
