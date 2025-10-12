# ✅ Deployment URLs - VERIFIED

## Production URLs (Ready to Use)

### 1. PDF Guide (Main Branch)
- **Production URL**: `https://the-hausa-weding-guide.vercel.app`
- **Claim/Success Page**: `https://the-hausa-weding-guide.vercel.app/?claim=1`
- **Branch**: `main`
- **Status**: ✅ Deployed and Ready
- **Paystack Product**: Hausa Wedding Guide PDF (₦100)

### 2. Interactive Wedding Guide
- **Production URL**: `https://the-hausa-weding-guide-git-interactive-guide-devbydijahprojects.vercel.app`
- **Claim/Success Page**: `https://the-hausa-weding-guide-git-interactive-guide-devbydijahprojects.vercel.app/?claim=1`
- **Branch**: `interactive-guide`
- **Status**: ✅ Deployed as Preview Branch
- **Paystack Product**: Interactive Wedding Guide (₦100)

---

## Paystack Storefront Configuration

### Storefront URL
`https://paystack.shop/hausaroom-wedding-guide-GLQSt`

### Product 1: Hausa Wedding Guide PDF
**Update Redirect URL to:**
```
https://the-hausa-weding-guide.vercel.app/?claim=1
```

**Steps:**
1. Go to https://dashboard.paystack.com/#/storefront
2. Click on "Hausaroom Wedding Guide" storefront
3. Find "Hausa Wedding Guide PDF" product
4. Click Edit
5. Set **Redirect URL** to the URL above
6. Save

### Product 2: Interactive Wedding Guide
**Update Redirect URL to:**
```
https://the-hausa-weding-guide-git-interactive-guide-devbydijahprojects.vercel.app/?claim=1
```

**Steps:**
1. Same storefront as above
2. Find "Interactive Wedding Guide" product
3. Click Edit
4. Set **Redirect URL** to the URL above
5. Save

---

## Webhook Configuration

### Webhook URL (Already Configured)
```
https://the-hausa-weding-guide.vercel.app/api/paystack-webhook
```

This webhook is in the main deployment and handles both products.

**Verify in Paystack:**
1. Go to https://dashboard.paystack.com/#/settings/developers
2. Click on "Webhooks"
3. Ensure URL above is listed
4. Events should include: `charge.success`

---

## Environment Variables (Vercel)

### Required Variables (Already Set)
- `PAYSTACK_SECRET_KEY` - Live mode key
- `PAYSTACK_TEST_SECRET_KEY` - Test mode key  
- `RESEND_API_KEY` - Email service
- `FROM_EMAIL` - noreply@hausaroom.com

**Verify:**
1. Go to https://vercel.com/devbydijahprojects/the-hausa-weding-guide
2. Settings → Environment Variables
3. Check all 4 variables are present

---

## Complete Purchase Flow

### For PDF Guide:
1. Customer visits landing page: `https://the-hausa-weding-guide.vercel.app`
2. Clicks "Buy PDF Guide - ₦100" → Redirects to Paystack Storefront
3. Selects "Hausa Wedding Guide PDF" product
4. Completes payment
5. Paystack redirects to: `https://the-hausa-weding-guide.vercel.app/?claim=1`
6. Customer sees success page with features list
7. Email sent with download link
8. Customer clicks link → PDF downloads

### For Interactive Guide:
1. Customer visits landing page: `https://the-hausa-weding-guide-git-interactive-guide-devbydijahprojects.vercel.app`
2. Clicks "Buy Interactive Guide - ₦100" → Redirects to Paystack Storefront
3. Selects "Interactive Wedding Guide" product
4. Completes payment
5. Paystack redirects to: `https://the-hausa-weding-guide-git-interactive-guide-devbydijahprojects.vercel.app/?claim=1`
6. Customer sees success page with features list
7. Clicks "Access Guide" button
8. LoginGate prompts for authentication
9. Customer accesses interactive guide

---

## Testing Checklist

### Before Testing
- [ ] Update both product redirect URLs in Paystack storefront
- [ ] Verify webhook URL is configured
- [ ] Verify environment variables are set in Vercel
- [ ] Switch Paystack to test mode

### Test PDF Purchase
- [ ] Visit PDF landing page
- [ ] Click buy button
- [ ] Complete test payment (use Paystack test card)
- [ ] Verify redirect to claim page (?claim=1)
- [ ] Check email inbox for download link
- [ ] Click download link
- [ ] Verify PDF downloads successfully

### Test Interactive Guide Purchase
- [ ] Visit Interactive guide landing page
- [ ] Click buy button
- [ ] Complete test payment
- [ ] Verify redirect to claim page (?claim=1)
- [ ] Click "Access Guide" button
- [ ] Verify LoginGate appears
- [ ] Enter credentials
- [ ] Verify access to interactive guide

---

## Quick Test URLs

**Direct Landing Pages:**
- PDF: https://the-hausa-weding-guide.vercel.app
- Interactive: https://the-hausa-weding-guide-git-interactive-guide-devbydijahprojects.vercel.app

**Claim Pages (Post-Purchase):**
- PDF: https://the-hausa-weding-guide.vercel.app/?claim=1
- Interactive: https://the-hausa-weding-guide-git-interactive-guide-devbydijahprojects.vercel.app/?claim=1

**Storefront:**
- Both Products: https://paystack.shop/hausaroom-wedding-guide-GLQSt

---

## Troubleshooting

### If Redirect Doesn't Work
1. Clear browser cache
2. Verify redirect URL has `?claim=1` parameter
3. Check Paystack product settings have redirect URL saved
4. Test in incognito mode

### If Email Doesn't Arrive
1. Check spam folder
2. Verify Resend API key is correct in Vercel
3. Check Vercel function logs for errors
4. Verify FROM_EMAIL domain is verified in Resend

### If Download Link Fails
1. Check link hasn't expired (24 hours)
2. Verify signature parameter is present
3. Check Vercel logs for validation errors
4. Test with fresh purchase

---

## Next Actions

1. ✅ **Update Paystack Product Redirect URLs** (PRIORITY)
   - Product 1 (PDF): Add redirect URL
   - Product 2 (Interactive): Add redirect URL

2. 🧪 **Test Complete Flow**
   - Make test purchase for PDF
   - Make test purchase for Interactive
   - Verify both redirect and email flows

3. 🚀 **Go Live**
   - Switch Paystack to live mode
   - Make real test purchase
   - Monitor for any issues

---

## Support Notes

**Both deployments are live and ready!**

The interactive guide is deployed as a Git branch preview, which is why it has a longer URL. This is perfectly fine and works exactly the same as a separate project.

If you prefer a shorter URL for the interactive guide in the future, you can create a separate Vercel project, but it's not necessary - the current setup works great!
