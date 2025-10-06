# Paystack Storefront Setup Guide

## Overview

You're using **Paystack Storefront** (https://paystack.shop/hausa-room), which is a pre-built shop page where customers can browse and purchase your products.

## Storefront Configuration

Your storefront URL: **https://paystack.shop/hausa-room**

You need to add **TWO** products to your Paystack Storefront:

### Product 1: Hausa Wedding Guide PDF

- **Name**: `Hausa Wedding Guide PDF`
- **Price**: ₦100
- **Product Type/SKU**: Include "pdf" in the product name or description
- **Redirect URL (after payment)**: `https://the-hausa-weding-guide.vercel.app/?claim=1`
- **Description**: "Comprehensive PDF guide for authentic Hausa wedding planning"

### Product 2: Interactive Wedding Guide

- **Name**: `Interactive Wedding Guide`
- **Price**: ₦100
- **Product Type/SKU**: Include "interactive" or "webapp" in the product name or description
- **Redirect URL (after payment)**: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`
- **Description**: "Interactive web application for comprehensive wedding planning"

## Setup Steps

1. **Log into Paystack Dashboard**
   - Go to https://dashboard.paystack.com
   - Navigate to "Storefront" or "Commerce" section

2. **Add PDF Guide Product to Storefront**
   - Click "Add Product" on your storefront
   - Set name: `Hausa Wedding Guide PDF`
   - Set price: ₦100
   - Set redirect URL: `https://the-hausa-weding-guide.vercel.app/?claim=1`
   - Add description: "Comprehensive PDF guide for authentic Hausa wedding planning"
   - Save the product

3. **Add Interactive Guide Product to Storefront**
   - Click "Add Product" on your storefront
   - Set name: `Interactive Wedding Guide`
   - Set price: ₦100
   - Set redirect URL: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`
   - Add description: "Interactive web application for comprehensive wedding planning"
   - Save the product

4. **Configure Webhooks**
   - Go to Settings → Webhooks
   - Add your webhook URL (Vercel deployment URL + `/api/paystack-webhook`)
   - Example: `https://your-app.vercel.app/api/paystack-webhook`
   - Save the webhook

## Product Detection Logic

The webhook automatically detects which product was purchased by checking the product name:

1. **Product Name Check**:
   - Contains "PDF" → Routes to PDF guide
   - Contains "Interactive" or "webapp" → Routes to Interactive guide
2. **Fallback**: Defaults to PDF for backward compatibility

### Routing After Purchase

- **PDF Guide** buyers → Receive email with download link to PDF guide site
- **Interactive Guide** buyers → Receive email with access link to interactive guide site

## Landing Pages

Both landing pages have "Buy Now" buttons that redirect to your Paystack Storefront:

- **PDF Guide Site**: https://the-hausa-weding-guide.vercel.app
  - Button → `https://paystack.shop/hausa-room`
- **Interactive Guide Site**: https://the-hausa-weding-guide-interactive.vercel.app
  - Button → `https://paystack.shop/hausa-room`

Customers browse products on your storefront and select which one they want to purchase.

## Testing

1. Visit your landing pages and click the "Buy" buttons
2. Verify you're redirected to `https://paystack.shop/hausa-room`
3. Complete a test purchase using Paystack test card: **4084 0840 8408 4081**
4. Check that you're redirected to the correct claim page after payment
5. Verify you receive the correct email with the appropriate product URL
6. Confirm the download/access link works

## Production Checklist

- [ ] Add both products to your Paystack Storefront
- [ ] Set redirect URLs for each product
- [ ] Configure webhook URL in Paystack: `https://your-app.vercel.app/api/paystack-webhook`
- [ ] Test both purchase flows end-to-end
- [ ] Switch to live Paystack keys when ready
- [ ] Update .env with live keys
- [ ] Redeploy both branches to production

## Notes

- Both products are ₦100 each for testing/demo purposes
- Webhook detects product type from the **product name** in the purchase data
- Email templates automatically customize based on detected product type
- All "Buy Now" buttons on both landing pages redirect to the same storefront
- Customers choose which product to buy on the storefront page
- After payment, customers are redirected to product-specific claim pages based on what they purchased
