# Paystack Product Setup Guide

## Quick Reference: How to Configure Products

### Step 1: Log into Paystack Dashboard

1. Go to https://dashboard.paystack.com
2. Navigate to **Products** (or **Payment Pages**)

### Step 2: Create Your Products

---

## Product 1: PDF Guide Only

**Product Name:** `Hausa Wedding Guide - PDF Edition`  
**Price:** ₦5,000 (or your desired price)  
**Description:** `Complete downloadable PDF wedding planning guide for Hausa weddings`

**Metadata (IMPORTANT):**

```json
{
  "product_type": "pdf"
}
```

**How to add metadata in Paystack:**

1. Click on the product
2. Find "Custom Fields" or "Metadata" section
3. Add key: `product_type`, value: `pdf`

---

## Product 2: Interactive Web App Only

**Product Name:** `Hausa Wedding Guide - Interactive Access`  
**Price:** ₦8,000 (or your desired price)  
**Description:** `Lifetime access to the interactive wedding planning web app with cloud sync`

**Metadata (IMPORTANT):**

```json
{
  "product_type": "webapp"
}
```

**How to add metadata in Paystack:**

1. Click on the product
2. Find "Custom Fields" or "Metadata" section
3. Add key: `product_type`, value: `webapp`

---

## Product 3: Complete Bundle (PDF + Web App)

**Product Name:** `Hausa Wedding Guide - Complete Package`  
**Price:** ₦10,000 (or your desired price - should be discounted vs buying separately)  
**Description:** `Complete package: Downloadable PDF + lifetime interactive web app access`

**Metadata (IMPORTANT):**

```json
{
  "product_type": "bundle"
}
```

**How to add metadata in Paystack:**

1. Click on the product
2. Find "Custom Fields" or "Metadata" section
3. Add key: `product_type`, value: `bundle`

---

## Testing Your Products

### For Test Mode:

1. Switch Paystack to **Test Mode** (toggle in dashboard)
2. Create test versions of all products
3. Use test cards to purchase (see Paystack docs for test card numbers)
4. Verify you receive the correct email for each product type

### Test Card Numbers (Paystack):

- **Success:** `4084084084084081` (any future date, any CVV)
- **Insufficient funds:** `5060666666666666666`

---

## Webhook Configuration

### Webhook URL:

```
https://your-domain.vercel.app/api/paystack-webhook
```

### Events to Subscribe:

- ✅ `charge.success`

### How to set up:

1. Paystack Dashboard → Settings → Webhooks
2. Add new webhook with the URL above
3. Select `charge.success` event
4. Save

---

## Product Name Fallback (if metadata not set)

If you forget to set metadata, the system will try to detect product type from the name:

- Contains **"webapp"**, **"web app"**, or **"interactive"** → Web App
- Contains **"bundle"** or **"complete"** → Bundle
- Everything else → PDF (default)

**⚠️ Warning:** Relying on name detection is less reliable. Always set metadata!

---

## Pricing Recommendations

### Suggested Pricing Strategy:

- **PDF Only:** ₦5,000 - ₦7,000
- **Web App Only:** ₦8,000 - ₦10,000
- **Bundle:** ₦10,000 - ₦12,000 (15-20% discount vs separate purchases)

### Why Bundle Pricing Works:

- Encourages customers to buy the complete package
- Higher perceived value
- Better customer experience (best of both worlds)
- Higher average transaction value for you

---

## Environment Variables Checklist

Make sure these are set in Vercel:

```bash
# Email Service
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@hausaroom.com

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxxxx         # Live mode
PAYSTACK_TEST_SECRET_KEY=sk_test_xxxxx    # Test mode

# Web App Access
VITE_SHARED_PASSWORD=hausawedding2025     # Shared password for web app login
WEB_APP_URL=https://guide.hausaroom.com   # Your web app domain
```

---

## Troubleshooting

### Customer didn't receive email:

1. Check Vercel logs for webhook errors
2. Verify email is not in spam
3. Check Resend dashboard for delivery status
4. Verify product metadata is set correctly

### Wrong email template sent:

1. Check product metadata in Paystack
2. Review Vercel logs for "Product type detected: xxx"
3. Verify product name doesn't have misleading keywords

### Web app login not working:

1. Verify VITE_SHARED_PASSWORD is set in Vercel
2. Check customer is using the correct email (same as purchase)
3. Verify password in email matches environment variable

---

## Quick Test Commands

### Test the webhook locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev

# In another terminal, use ngrok or cloudflared to expose webhook
cloudflared tunnel --url http://localhost:3000
```

### Manually test email sending:

Use the debug page at `/debug.html` to simulate purchases.

---

**Need help?** Check the Paystack documentation or review the webhook logs in Vercel.
