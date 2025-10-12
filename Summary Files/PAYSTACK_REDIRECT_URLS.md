# Paystack Product Redirect URLs

## Setup Instructions

Update each product in your Paystack Storefront with the correct redirect URL:

### Product 1: Hausa Wedding Guide PDF

**Price:** ₦100  
**Redirect URL:** `https://the-hausa-weding-guide.vercel.app/?claim=1`

### Product 2: Interactive Wedding Guide

**Price:** ₦100  
**Redirect URL:** `https://the-hausa-weding-guide-git-interactive-guide-devbydijah.vercel.app/?claim=1`

_(Replace `devbydijah` with your actual Vercel username if different)_

---

## How to Update in Paystack:

1. Go to https://dashboard.paystack.com/#/storefront
2. Click on your storefront: **Hausaroom Wedding Guide**
3. For each product:
   - Click **Edit** button
   - Scroll to **Redirect URL** field
   - Paste the appropriate URL from above
   - Click **Save**

---

## Alternative: Use Separate Deployment for Interactive Guide

If you prefer a cleaner URL for the interactive guide:

1. Create a new Vercel project for the interactive guide
2. Import the same GitHub repo
3. Configure it to deploy the `interactive-guide` branch
4. You'll get a URL like: `hausa-wedding-interactive-guide.vercel.app`
5. Update Product 2 redirect to: `https://hausa-wedding-interactive-guide.vercel.app/?claim=1`

---

## Testing the Flow:

1. Visit your storefront: https://paystack.shop/hausaroom-wedding-guide-GLQSt
2. Click "Buy" on the PDF product
3. Complete test payment
4. Should redirect to: PDF landing page with success/claim message
5. Check email for download link
6. Repeat for Interactive product

---

## What Happens After Redirect:

✅ Customer lands on success/claim page (not buy page)  
✅ Sees confirmation message with celebration emoji  
✅ Gets list of features they purchased  
✅ Sees email reminder to check inbox  
✅ For interactive guide: "Access Guide" button appears  
✅ For PDF: Email contains secure download link
