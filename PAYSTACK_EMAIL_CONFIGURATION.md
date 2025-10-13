# Paystack Email Configuration

## 🚨 Issue: PDF Download Message in Web Guide Receipt

### Problem
When customers purchase the **Interactive Web Guide** (₦100), they receive TWO emails:

1. **Paystack Receipt Email** (automatic) - Shows PDF download message ❌
2. **Our Custom Email** (via webhook) - Shows correct signup instructions ✅

### Root Cause
Paystack automatically sends receipt emails for storefront purchases. The message content comes from the **product description** in your Paystack product settings, NOT from our code.

---

## 📝 Solution: Update Paystack Product Descriptions

### Step 1: Access Paystack Dashboard
1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Navigate to **Commerce** → **Products**
3. You'll see your two products:
   - **Northern Wedding Guide (PDF)** - ID: 2183419
   - **Interactive Northern Wedding Web Guide** - ID: 2183415

### Step 2: Edit Interactive Web Guide Product
1. Click on **Interactive Northern Wedding Web Guide**
2. Look for **Description** or **Success Message** field
3. **Current text (WRONG):**
   ```
   Success! Your payment was received. We've emailed your 24‑hour download link to the 
   email used at checkout. Please check your inbox (and spam) and save the PDF after 
   download. Need help? support@hausaroom.ng
   ```

4. **Change to:**
   ```
   Success! Your payment was received. We've emailed your account setup instructions to 
   the email used at checkout. Please check your inbox (and spam) to create your account 
   and start planning. Need help? support@hausaroom.ng
   ```

### Step 3: Verify PDF Product Description
1. Click on **Northern Wedding Guide (PDF)**
2. Confirm description says:
   ```
   Success! Your payment was received. We've emailed your 24‑hour download link to the 
   email used at checkout. Please check your inbox (and spam) and save the PDF after 
   download. Need help? support@hausaroom.ng
   ```
3. This is CORRECT for PDF product - leave as is ✅

### Step 4: Save Changes
1. Click **Save** or **Update Product**
2. Test with a new purchase to verify

---

## 📧 Email Flow Explained

### PDF Guide Purchase (₦110)
**Paystack Receipt:**
- Subject: "Your receipt from Hausa Room"
- Message: "Success! Your payment was received. We've emailed your 24‑hour download link..."
- ✅ Correct

**Our Custom Email:**
- Subject: "Your Hausa Wedding Guide is Ready! 🎉"
- From: "Hausa Wedding Guide <noreply@hausaroom.ng>"
- Content: Download link with 24-hour token
- ✅ Correct

---

### Web Guide Purchase (₦100)
**Paystack Receipt:**
- Subject: "Your receipt from Hausa Room"
- Message: ❌ Currently shows PDF message (needs fixing)
- Should say: "Success! Your payment was received. We've emailed your account setup instructions..."

**Our Custom Email:**
- Subject: "Welcome to Your Interactive Wedding Guide! 🎉"
- From: "Hausa Wedding Guide <noreply@hausaroom.ng>"
- Content: Signup link with instructions to create account
- ✅ Correct

---

## 🔗 Product URLs Reference

### Live Storefront
- **Storefront Home:** https://paystack.shop/hausaroom-wedding-guide-GLQSt
- **PDF Product:** https://paystack.com/buy/northern-wedding-guide-pdf-jgokdm
- **Web Guide Product:** https://paystack.com/buy/interactive-northern-wedding-web-guide-iqsdyi

### Product IDs
- **PDF Guide:** 2183419
- **Web Guide:** 2183415

### API Keys
- **Live Public Key:** `pk_live_4505c90c4a3942da677938e9c44b531f6f6af901`
- **Live Secret Key:** `sk_live_***` (set in Vercel env vars)

### Webhook URL
- **Live Webhook:** https://the-hausa-weding-guide.vercel.app/api/paystack-webhook

---

## ✅ Verification Checklist

After updating Paystack product descriptions:

- [ ] PDF product description mentions "24-hour download link"
- [ ] Web Guide product description mentions "account setup instructions"
- [ ] Test PDF purchase → Receipt shows download message
- [ ] Test Web Guide purchase → Receipt shows signup message
- [ ] Both products send correct custom emails from webhook
- [ ] Customers receive 2 emails per purchase (Paystack + Custom)

---

## 🛠️ Technical Notes

### How Our Webhook Detects Products

**Primary Method: Product ID** (Most Reliable)
```javascript
const PDF_PRODUCT_ID = 2183419;
const WEBAPP_PRODUCT_ID = 2183415;

if (productId === PDF_PRODUCT_ID) {
  productType = "pdf";
} else if (productId === WEBAPP_PRODUCT_ID) {
  productType = "webapp";
}
```

**Fallback Methods:**
1. Metadata `product_type` field
2. Transaction reference keywords (e.g., "webapp", "pdf")
3. Amount-based (legacy support)

### Why We Can't Control Paystack Receipt Emails

Paystack sends receipt emails **automatically** for all storefront purchases. We have two options:

1. ✅ **Update product descriptions** (Recommended)
   - Easy to implement
   - Gives customers confirmation
   - Maintains Paystack branding

2. ❌ **Disable Paystack receipts entirely**
   - Requires contacting Paystack support
   - May not be possible for storefront products
   - Removes payment confirmation

**Recommendation:** Keep both emails. Customers expect receipts from payment processors.

---

## 📞 Support Resources

- **Paystack Dashboard:** https://dashboard.paystack.com/
- **Paystack Docs:** https://paystack.com/docs
- **Contact Paystack:** support@paystack.com

---

**Last Updated:** October 13, 2025  
**Status:** Product ID detection implemented ✅ | CSP updated for Supabase ✅ | Paystack descriptions need manual update
