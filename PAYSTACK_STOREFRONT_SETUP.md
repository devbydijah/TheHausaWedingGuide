# Paystack Storefront Setup Guide

## Product Configuration

You need to create **TWO** payment links/products in your Paystack dashboard:

### Product 1: Hausa Wedding Guide PDF
- **Name**: `Hausa Wedding Guide PDF`
- **Price**: ₦100
- **Payment Link Slug**: `hausaweddingguidepdf`
- **Full URL**: `https://paystack.com/pay/hausaweddingguidepdf`
- **Redirect URL (after payment)**: `https://the-hausa-weding-guide.vercel.app/?claim=1`
- **Description**: "Comprehensive PDF guide for authentic Hausa wedding planning"

### Product 2: Interactive Wedding Guide
- **Name**: `Interactive Wedding Guide`
- **Price**: ₦100
- **Payment Link Slug**: `hausaweddingguideinteractive`
- **Full URL**: `https://paystack.com/pay/hausaweddingguideinteractive`
- **Redirect URL (after payment)**: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`
- **Description**: "Interactive web application for comprehensive wedding planning"

## Setup Steps

1. **Log into Paystack Dashboard**
   - Go to https://dashboard.paystack.com
   - Navigate to "Payment Pages" or "Payment Links"

2. **Create PDF Guide Payment Link**
   - Click "Create Payment Link"
   - Set name: `Hausa Wedding Guide PDF`
   - Set amount: ₦100
   - Set slug: `hausaweddingguidepdf`
   - Set redirect URL: `https://the-hausa-weding-guide.vercel.app/?claim=1`
   - Save the link

3. **Create Interactive Guide Payment Link**
   - Click "Create Payment Link"
   - Set name: `Interactive Wedding Guide`
   - Set amount: ₦100
   - Set slug: `hausaweddingguideinteractive`
   - Set redirect URL: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`
   - Save the link

4. **Configure Webhooks**
   - Go to Settings → Webhooks
   - Add your webhook URL (Vercel deployment URL + `/api/paystack-webhook`)
   - Example: `https://your-app.vercel.app/api/paystack-webhook`
   - Save the webhook

## Product Detection Logic

The webhook automatically detects which product was purchased by checking:

1. **Payment Link Reference**: Contains "pdf" or "interactive"
2. **Product Name**: Contains "PDF" or "Interactive"
3. **Default Fallback**: PDF (for backward compatibility)

### Routing After Purchase

- **PDF Guide** buyers → Receive email with download link to PDF guide site
- **Interactive Guide** buyers → Receive email with access link to interactive guide site

## Deployment URLs

- **PDF Guide Site**: https://the-hausa-weding-guide-6bvl57j7j-devbydijahprojects.vercel.app
- **Interactive Guide Site**: https://the-hausa-weding-guide-ez4t8wviq-devbydijahprojects.vercel.app

## Testing

1. Click the button on each site to ensure Paystack payment link works
2. Complete a test purchase (use Paystack test card: 4084084084084081)
3. Verify you receive the correct email with the correct product URL
4. Confirm the download/access link works

## Production Checklist

- [ ] Create both payment links in Paystack
- [ ] Configure webhook URL in Paystack
- [ ] Test both purchase flows
- [ ] Switch to live Paystack keys when ready
- [ ] Update .env with live keys
- [ ] Redeploy to production

## Notes

- Both products are now ₦100 each for testing/demo purposes
- Webhook detects product type from payment link reference
- Email templates automatically customize based on product type
- No metadata required - detection works automatically
