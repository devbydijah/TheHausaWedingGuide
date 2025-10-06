# Paystack Storefront vs Payment Links - Quick Reference

## What You're Using: STOREFRONT ✅

**Your Storefront URL**: https://paystack.shop/hausa-room

## The Difference

### Paystack Storefront (What you have)
- ✅ **One shop page** with multiple products
- ✅ Customers browse and select which product to buy
- ✅ Example: https://paystack.shop/hausa-room
- ✅ Both your landing pages redirect here

### Payment Links (What you DON'T need)
- ❌ Individual checkout page per product
- ❌ Example: https://paystack.com/pay/product-slug
- ❌ Not needed for your setup

## Your Current Setup

### Both Landing Pages → Same Storefront
```
PDF Guide Landing Page
  Button clicks → https://paystack.shop/hausa-room

Interactive Guide Landing Page  
  Button clicks → https://paystack.shop/hausa-room
```

### Customer Journey
1. Customer visits your landing page (PDF or Interactive)
2. Clicks "Buy Now" button
3. Redirected to **https://paystack.shop/hausa-room**
4. Sees both products listed on storefront
5. Selects which product they want
6. Completes payment
7. Redirected to appropriate claim page based on purchase

## What to Do in Paystack Dashboard

### Step 1: Add Products to Storefront
Log into Paystack → Go to your Storefront → Add these two products:

**Product 1:**
- Name: `Hausa Wedding Guide PDF`
- Price: ₦100
- Redirect URL: `https://the-hausa-weding-guide.vercel.app/?claim=1`

**Product 2:**
- Name: `Interactive Wedding Guide`
- Price: ₦100
- Redirect URL: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`

### Step 2: Configure Webhook
Settings → Webhooks → Add:
- URL: `https://the-hausa-weding-guide.vercel.app/api/paystack-webhook`
- Events: Select all or just `charge.success`

## How Product Detection Works

The webhook checks the **product name** from Paystack:
- Contains "PDF" → Sends PDF download email
- Contains "Interactive" → Sends web app access email

## No Payment Links Needed! 

You only need:
1. ✅ Your Paystack Storefront (already have it)
2. ✅ Two products added to that storefront
3. ✅ Redirect URLs configured per product
4. ✅ Webhook configured

That's it!
