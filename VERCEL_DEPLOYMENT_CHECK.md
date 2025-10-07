# Vercel Deployment Status Check

## Current Deployment URLs

### Main Branch (PDF Guide)
- **Production URL**: https://the-hausa-weding-guide.vercel.app
- **Branch**: `main`
- **Status**: ✅ Should be deployed
- **Test URL**: https://the-hausa-weding-guide.vercel.app/?claim=1

### Interactive Guide Branch
- **Expected URL Options**:
  1. **Git Branch Preview**: `https://the-hausa-weding-guide-git-interactive-guide-[username].vercel.app`
  2. **Separate Project** (recommended): `https://hausa-wedding-interactive-guide.vercel.app`
- **Branch**: `interactive-guide`
- **Current Status**: ❓ May not be deployed - getting 404 errors
- **Test URL**: Should be `[deployment-url]/?claim=1`

---

## Deployment Check Steps

### Step 1: Verify Main Branch Deployment
1. Visit: https://the-hausa-weding-guide.vercel.app
2. Should see: PDF guide landing page with enhanced design
3. Test claim page: https://the-hausa-weding-guide.vercel.app/?claim=1
4. Should see: Success/thank you page

### Step 2: Check Vercel Dashboard
Go to: https://vercel.com/dashboard

Look for project: `the-hausa-weding-guide` or `TheHausaWedingGuide`

Check:
- [ ] Is main branch deployed?
- [ ] Are preview deployments enabled for other branches?
- [ ] Is interactive-guide branch showing in deployments?
- [ ] What is the actual URL for interactive-guide branch?

### Step 3: Verify Branch Settings
In Vercel project settings → Git:
- [ ] **Production Branch**: Should be `main`
- [ ] **Preview Deployments**: Should be enabled for "All Branches" or specific branches including `interactive-guide`
- [ ] Check if `interactive-guide` appears in deployment list

---

## Two Deployment Options for Interactive Guide

### Option 1: Use Git Branch Preview (Automatic)
**Pros**: Automatic, uses same project  
**Cons**: Longer URL with git branch in it

**Setup**:
1. Go to Vercel dashboard → Your project
2. Settings → Git
3. Enable "Preview Deployments" for all branches
4. Vercel auto-deploys interactive-guide branch
5. URL will be: `https://the-hausa-weding-guide-git-interactive-guide-devbydijah.vercel.app`

**Update Paystack with this URL**: 
```
https://the-hausa-weding-guide-git-interactive-guide-devbydijah.vercel.app/?claim=1
```

### Option 2: Create Separate Vercel Project (Recommended)
**Pros**: Clean URL, separate project settings  
**Cons**: Manual setup required

**Setup**:
1. Go to https://vercel.com/new
2. Import the same GitHub repo: `devbydijah/TheHausaWedingGuide`
3. Configure:
   - **Project Name**: `hausa-wedding-interactive-guide`
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Git Branch**: `interactive-guide` (IMPORTANT!)
4. Deploy
5. You'll get: `https://hausa-wedding-interactive-guide.vercel.app`

**Update Paystack with this URL**: 
```
https://hausa-wedding-interactive-guide.vercel.app/?claim=1
```

---

## Environment Variables Check

Both deployments need these environment variables:

### Required for Webhook (PDF deployment)
- `PAYSTACK_SECRET_KEY` - Live mode
- `PAYSTACK_TEST_SECRET_KEY` - Test mode
- `RESEND_API_KEY` - Email sending
- `FROM_EMAIL` - Sender email (noreply@hausaroom.com)

### Required for Interactive Guide
- (None for frontend - all handled by webhook)

---

## Testing Checklist

### After Deployment Verified:

#### PDF Guide
- [ ] Visit https://the-hausa-weding-guide.vercel.app
- [ ] Landing page displays correctly
- [ ] Click "Buy" button → redirects to Paystack storefront
- [ ] Visit claim page: /?claim=1
- [ ] Success page displays correctly

#### Interactive Guide
- [ ] Visit deployment URL (whichever option you chose)
- [ ] Landing page displays correctly
- [ ] Click "Buy" button → redirects to Paystack storefront
- [ ] Visit claim page: /?claim=1
- [ ] Success page displays with "Access Guide" button

#### Webhook
- [ ] Webhook URL configured: https://the-hausa-weding-guide.vercel.app/api/paystack-webhook
- [ ] Environment variables set in Vercel
- [ ] Test purchase sends email correctly
- [ ] Email contains correct download/access link

---

## Troubleshooting 404 Errors

If you're getting 404 on interactive guide:

### Check 1: Branch is Deployed
```bash
# Check Vercel CLI (if installed)
vercel ls

# Should show both deployments
```

### Check 2: URL is Correct
The git branch preview URL format is:
```
https://[project-name]-git-[branch-name]-[vercel-username].vercel.app
```

For your project:
```
https://the-hausa-weding-guide-git-interactive-guide-devbydijah.vercel.app
```

### Check 3: Preview Deployments Enabled
1. Vercel Dashboard → Project → Settings → Git
2. Under "Ignored Build Step", make sure it's not ignoring the interactive-guide branch
3. Under "Production Branch", keep as `main`
4. Enable preview deployments for all branches

### Check 4: Trigger New Deployment
```bash
# Make a small change and push
git checkout interactive-guide
git commit --allow-empty -m "Trigger deployment"
git push origin interactive-guide
```

---

## Next Steps

1. **Check Vercel Dashboard**: Confirm which URLs are actually deployed
2. **Test Both URLs**: Visit actual deployment URLs and verify they work
3. **Update Paystack**: Add correct redirect URLs to both products
4. **Test Complete Flow**: Make test purchases and verify redirects work

---

## Current URLs Summary

| Product | Landing Page | Claim Page | Paystack Storefront |
|---------|--------------|------------|---------------------|
| PDF Guide | https://the-hausa-weding-guide.vercel.app | /?claim=1 | Product 1 |
| Interactive | [VERIFY IN VERCEL] | /?claim=1 | Product 2 |

**Action Required**: Check Vercel dashboard to get actual interactive guide URL, then update this document and Paystack.
