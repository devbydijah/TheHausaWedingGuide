# Post-Payment Redirect Configuration

## Overview

After customers complete their Paystack payment, they will be redirected to a claim page where they can access their purchased product.

## Redirect URLs

### PDF Guide (Main Branch)

- **Paystack Payment Link**: `https://paystack.com/pay/hausaweddingguidepdf`
- **Redirect After Payment**: `https://the-hausa-weding-guide.vercel.app/?claim=1`
- **What Happens**: Customer lands on PDF guide site with claim parameter, can enter email to receive download link

### Interactive Guide (Interactive-Guide Branch)

- **Paystack Payment Link**: `https://paystack.com/pay/hausaweddingguideinteractive`
- **Redirect After Payment**: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`
- **What Happens**: Customer lands on interactive guide site with claim parameter, can enter email to receive access credentials

## How It Works

### Payment Flow

1. **Customer clicks "Buy" button** on landing page
2. **Redirected to Paystack** payment page
3. **Completes payment** with card/bank
4. **Paystack redirects** to appropriate claim URL
5. **Customer enters email** to claim their purchase
6. **System sends email** with download link (PDF) or access credentials (Interactive)

### Email Flow (Webhook)

In parallel with the redirect:

1. **Paystack sends webhook** to your server
2. **Webhook verifies payment** and detects product type
3. **System generates** secure token/credentials
4. **Email sent** with download link or access credentials

### Claim Page Purpose

The `?claim=1` parameter triggers a claim interface where customers can:

- Enter their purchase email
- Request their download link/access credentials to be resent
- Get immediate access without waiting for email

## Configuration in Paystack Dashboard

### For PDF Guide Payment Link

```
Name: Hausa Wedding Guide PDF
Amount: ₦100
Slug: hausaweddingguidepdf
Redirect URL: https://the-hausa-weding-guide.vercel.app/?claim=1
```

### For Interactive Guide Payment Link

```
Name: Interactive Wedding Guide
Amount: ₦100
Slug: hausaweddingguideinteractive
Redirect URL: https://the-hausa-weding-guide-interactive.vercel.app/?claim=1
```

## Webhook Configuration

The webhook automatically:

- Detects product type from payment reference or product name
- Generates appropriate tokens/credentials
- Sends product-specific emails
- Routes customers to correct URLs

### Product Detection Logic

```javascript
// Check reference/product name for keywords
if (reference.includes("interactive") || productName.includes("Interactive")) {
  → Send to Interactive Guide URL
  → Email with access credentials
} else {
  → Send to PDF Guide URL
  → Email with download link
}
```

## Email Templates

### PDF Guide Email

- **Subject**: "Your Hausa Wedding Guide PDF is Ready"
- **Content**: Download link with 24-hour expiration
- **Link Format**: `https://the-hausa-weding-guide.vercel.app/?download=TOKEN&expires=TIMESTAMP&email=EMAIL&sig=SIGNATURE`

### Interactive Guide Email

- **Subject**: "Your Hausa Wedding Guide – Interactive Access"
- **Content**: Login credentials and access link
- **Link Format**: `https://the-hausa-weding-guide-interactive.vercel.app/?claim=1`

## Testing Checklist

- [ ] Add both products to Paystack storefront
- [ ] Set redirect URLs correctly for each product
- [ ] Configure webhook URL: `https://the-hausa-weding-guide.vercel.app/api/paystack-webhook`
- [ ] Test PDF purchase flow end-to-end
- [ ] Test Interactive guide purchase flow end-to-end
- [ ] Verify emails are sent with correct content
- [ ] Verify redirects work after payment
- [ ] Test claim page functionality

## Production URLs

Once you have custom domains, update these to:

- **PDF Guide**: `https://hausaweddingguide.com/?claim=1`
- **Interactive Guide**: `https://app.hausaweddingguide.com/?claim=1`

## Notes

- Redirect happens **immediately** after payment
- Email arrives **within 60 seconds** via webhook
- Customers get **instant access** via redirect + email backup
- `?claim=1` parameter can be used to show special UI for post-purchase flow
- Both systems work independently for reliability
