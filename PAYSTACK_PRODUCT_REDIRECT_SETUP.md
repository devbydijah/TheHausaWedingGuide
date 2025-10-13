# Paystack Product-Specific Redirect URLs Setup

## 🎯 Overview

This guide shows how to configure **product-specific redirect URLs** in Paystack for a better post-purchase experience. Each product redirects to its own URL, giving you more control and cleaner separation.

---

## ✅ Benefits of Product-Specific Redirects

- ✅ **Cleaner separation** between PDF and Web Guide
- ✅ **More control** over each product's user journey
- ✅ **Easier tracking** - know which product was purchased
- ✅ **Future-proof** - can customize experience per product
- ✅ **Better analytics** - track conversions per product

---

## 🔧 Setup Instructions

### Step 1: Configure PDF Product

**Location:** Paystack Dashboard → Commerce → Products → Northern Wedding Guide (PDF)

**Product ID:** 2183419

**Find the redirect URL field and set to:**

```
https://the-hausa-weding-guide.vercel.app/?purchased=pdf
```

**Save the product.**

---

### Step 2: Configure Web Guide Product

**Location:** Paystack Dashboard → Commerce → Products → Interactive Northern Wedding Web Guide

**Product ID:** 2183415

**Find the redirect URL field and set to:**

```
https://the-hausa-weding-guide.vercel.app/?purchased=webapp
```

**Save the product.**

---

### Step 3: Clear Storefront-Wide Redirect (IMPORTANT)

**Location:** Storefronts → HausaRoom Wedding Guide → After Purchase Tab

**Action:** **Clear/Remove** the storefront-wide redirect URL field (leave it blank/empty)

**Why:** Product-specific URLs take precedence. Having both can cause conflicts.

---

## 📧 What Happens After Purchase

### PDF Guide Purchase (₦110):

1. **Customer completes payment on Paystack**
2. **Redirects to:** `yoursite.com/?purchased=pdf`
3. **Success modal appears** with:
   - 🎉 Payment confirmation
   - 📧 "Check your email for download link"
   - ⏱️ Auto-closes after 15 seconds
   - 💬 Support contact info
4. **Customer receives email** with download link (24-hour validity)
5. **Customer downloads PDF**

---

### Web Guide Purchase (₦100):

1. **Customer completes payment on Paystack**
2. **Redirects to:** `yoursite.com/?purchased=webapp`
3. **Success modal appears** with:
   - 🎉 Payment confirmation
   - 📧 "Check your email for signup instructions"
   - ⏱️ Auto-closes after 15 seconds
   - 💬 Support contact info
4. **Customer receives email** with signup link + instructions
5. **Customer creates account** and starts planning

---

## 🎨 Success Modal Features

The modal that appears is the same for both products but explains:

### For All Purchases:

- ✅ Payment successful confirmation
- ✅ "Check Your Email" alert box
- ✅ Clear next steps
- ✅ Product-specific instructions:
  - **PDF:** Download link (valid 24 hours)
  - **Web Guide:** Signup instructions (create account)
- ✅ Support contact: support@hausaroom.ng
- ✅ Auto-close after 15 seconds
- ✅ Manual close buttons (X and "Got It, Thanks!")

---

## 💻 How It Works (Technical)

### URL Parameter Detection

The app detects the `purchased` parameter:

```javascript
// URL: yoursite.com/?purchased=pdf
const purchasedParam = params.get("purchased");

if (purchasedParam) {
  // Can be "pdf" or "webapp"
  setShowPurchaseSuccess(true);
  // Auto-close after 15 seconds
  setTimeout(() => {
    setShowPurchaseSuccess(false);
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }, 15000);
}
```

### Future Enhancement Possibility

Since we now know which product was purchased from the URL, we could:

- Show product-specific success messages
- Track analytics per product
- Customize the modal content
- Show product-specific upsells

---

## 🧪 Testing Checklist

### Before Go-Live:

- [ ] Set PDF product redirect URL to `?purchased=pdf`
- [ ] Set Web Guide product redirect URL to `?purchased=webapp`
- [ ] Clear storefront-wide redirect URL (leave blank)
- [ ] Redeploy Vercel to pick up code changes
- [ ] Test PDF purchase with test card
  - [ ] Redirects to `?purchased=pdf`
  - [ ] Success modal appears
  - [ ] Modal shows "download link" instructions
  - [ ] Receive email with download link
- [ ] Test Web Guide purchase with test card
  - [ ] Redirects to `?purchased=webapp`
  - [ ] Success modal appears
  - [ ] Modal shows "signup instructions"
  - [ ] Receive email with signup link
- [ ] Verify modal auto-closes after 15 seconds
- [ ] Verify close buttons work (X and "Got It, Thanks!")
- [ ] Test on mobile devices

---

## 🔗 Quick Reference

### Product URLs:

- **PDF Guide:** https://paystack.com/buy/northern-wedding-guide-pdf-jgokdm
- **Web Guide:** https://paystack.com/buy/interactive-northern-wedding-web-guide-iqsdyi
- **Storefront Home:** https://paystack.shop/hausaroom-wedding-guide-GLQSt

### Product IDs:

- **PDF:** 2183419
- **Web Guide:** 2183415

### Redirect URLs to Set:

- **PDF Product:** `https://the-hausa-weding-guide.vercel.app/?purchased=pdf`
- **Web Guide Product:** `https://the-hausa-weding-guide.vercel.app/?purchased=webapp`

---

## 📊 Customer Journey Map

```
PDF Purchase:
Customer → Paystack → Payment → Redirect (?purchased=pdf) → Success Modal → Email → Download PDF

Web Guide Purchase:
Customer → Paystack → Payment → Redirect (?purchased=webapp) → Success Modal → Email → Signup → Planning
```

---

## 🚀 Deployment Steps

### 1. Update Paystack Products (5 minutes):

- Go to Products in Paystack dashboard
- Set PDF product redirect URL
- Set Web Guide product redirect URL
- Clear storefront-wide redirect
- Save all changes

### 2. Code is Already Updated ✅

- App.jsx now detects `?purchased=pdf` OR `?purchased=webapp`
- Success modal works for both
- No additional code changes needed

### 3. Redeploy Vercel (2 minutes):

- Go to Vercel Dashboard → Deployments
- Click ⋮ → Redeploy
- ✅ Use existing build cache
- Wait for deployment

### 4. Test Both Products (10 minutes):

- Test PDF purchase flow
- Test Web Guide purchase flow
- Verify emails arrive
- Check mobile experience

---

## 📞 Support Resources

- **Paystack Docs:** https://paystack.com/docs
- **Paystack Dashboard:** https://dashboard.paystack.com/
- **Your Support Email:** support@hausaroom.ng

---

**Last Updated:** October 13, 2025  
**Status:** Product-specific redirects implemented ✅ | Ready for Paystack configuration  
**Approach:** RECOMMENDED - Better than storefront-wide redirect
