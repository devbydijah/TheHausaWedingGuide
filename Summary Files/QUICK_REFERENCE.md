# 🎯 Quick Reference Card - Hausa Wedding Guide

## 🔗 **Essential URLs**

| Service | URL | Purpose |
|---------|-----|---------|
| **Live Website** | `https://your-app.vercel.app` | Customer-facing site |
| **Vercel Dashboard** | `https://vercel.com/dashboard` | Hosting & deployments |
| **Paystack Dashboard** | `https://dashboard.paystack.com` | Payment monitoring |
| **Resend Dashboard** | `https://resend.com/dashboard` | Email delivery tracking |
| **GitHub Repo** | `https://github.com/devbydijah/TheHausaWedingGuide` | Source code |

---

## 📞 **Emergency Contacts**

- **Developer:** [Add your contact]
- **Vercel Support:** support@vercel.com
- **Paystack Support:** support@paystack.com (24/7 via dashboard)
- **Resend Support:** support@resend.com

---

## 🚨 **Common Issues & Quick Fixes**

### **1. Customer didn't receive email**
```
Step 1: Ask customer to check spam/junk folder
Step 2: Verify payment succeeded in Paystack dashboard
Step 3: Check Resend dashboard for delivery status
Step 4: If needed, re-send via: https://your-app.vercel.app/api/claim-by-email
```

### **2. Download link expired**
```
Links expire after 24 hours.
Solution: Customer can claim new link at: https://your-app.vercel.app/?claim=email
Enter their purchase email to get new download link.
```

### **3. Hit 3-download limit**
```
Each purchase allows 3 downloads.
Solution: Developer can issue new token via /api/issue-link endpoint
(Contact developer for this - requires admin access)
```

### **4. Website is down**
```
Step 1: Check Vercel status page: https://www.vercel-status.com
Step 2: Check Vercel dashboard → Project → Deployments for errors
Step 3: If needed, rollback to previous deployment (click "..." → Promote)
```

### **5. Payment succeeded but no access**
```
Check Paystack webhook deliveries in dashboard.
If webhook failed, manually trigger from Paystack dashboard.
Or contact developer to re-issue token.
```

---

## 💰 **Payment Test Card**

Use for testing only (never charges real money):
```
Card Number: 4084 0840 8408 4081
CVV: 408
PIN: 0000
Expiry: Any future date
OTP: 123456
```

---

## 📊 **Daily Monitoring Checklist**

**Every Morning (5 mins):**
- [ ] Check Paystack for new sales
- [ ] Check Resend for email delivery rate (should be >99%)
- [ ] Check Vercel logs for errors (should be minimal)
- [ ] Review customer support emails

**Every Week (15 mins):**
- [ ] Review analytics (sales trends)
- [ ] Check for customer feedback
- [ ] Update inventory/content if needed
- [ ] Backup database (download `downloads.db` from Vercel)

---

## 🔑 **Important Credentials**

**Store these securely (use password manager):**

### Production Passwords
- Vercel account password
- Paystack account password  
- Resend account password
- GitHub account password

### API Keys (stored in Vercel env vars)
- `PAYSTACK_SECRET_KEY` - Live payments
- `PAYSTACK_TEST_SECRET_KEY` - Testing
- `RESEND_API_KEY` - Email sending
- `VITE_SHARED_PASSWORD` - Planner access (shared with customers)

**⚠️ NEVER share API keys publicly or in emails!**

---

## 📈 **Success Metrics**

**Week 1 Goals:**
- Sales: 10+ purchases
- Email delivery: >99%
- Support tickets: <5% of sales
- Customer satisfaction: >4.5/5 stars

**Track These Numbers:**
- Daily sales volume
- Conversion rate (visitors → purchases)
- Email bounce rate (<1%)
- Download completion rate (>95%)
- Support response time (<2 hours)

---

## 🛠️ **How to Make Simple Updates**

### **Change Pricing:**
1. Update in Paystack dashboard
2. Update display price in `src/components/Pricing.jsx`
3. Commit & push to GitHub
4. Auto-deploys in 2 minutes

### **Update PDF Content:**
1. Replace `public/Hausa_Wedding_Guide.pdf`
2. Commit & push to GitHub
3. Clear browser cache to see new version

### **Change Email Template:**
1. Edit `lib/email.js`
2. Test with test payment first
3. Deploy when satisfied

---

## 🎯 **Marketing Quick Start**

### **Social Media Posts (Templates)**

**Instagram Caption:**
```
🎊 Plan your dream Hausa wedding with confidence!

Our comprehensive digital guide includes:
✨ Traditional ceremony details
💰 Smart budget planning tools
👰 Attire & beauty recommendations
🎉 Cultural protocols & etiquette

Get instant access → [link in bio]

#HausaWedding #NigerianWedding #WeddingPlanning #HausaCulture
```

**Twitter/X Post:**
```
Planning a Hausa wedding? 💒

Get our complete digital guide:
📱 Interactive wedding planner
💍 Traditional ceremony checklist
💰 Budget tracking tools
📖 Cultural insights

Instant download → [link]
```

**Facebook Ad Copy:**
```
Headline: Plan Your Perfect Hausa Wedding
Body: Complete digital guide with budget tools, vendor checklists, and cultural insights. Instant download.
CTA: Get Your Guide Now
```

---

## 📧 **Email Templates**

### **Customer Support Response Template**
```
Subject: Re: [Customer Issue]

Hi [Name],

Thank you for reaching out about [issue].

[Solution/answer]

Your download link: [if applicable]
Expires in: 24 hours
Downloads remaining: [number]

Need more help? Just reply to this email.

Best regards,
Hausa Wedding Guide Team
```

### **Refund Policy (Suggested)**
```
We offer a 7-day money-back guarantee if you're not satisfied.

To request a refund:
1. Email support@hausaroom.com within 7 days of purchase
2. Include your payment confirmation email
3. Brief reason for refund (helps us improve)

Refunds processed within 3-5 business days.
```

---

## 🎉 **Launch Day Checklist**

**24 Hours Before:**
- [ ] Final test purchase completed
- [ ] All social media posts scheduled
- [ ] Customer support email ready to monitor
- [ ] Analytics tracking confirmed
- [ ] Payment gateway in live mode
- [ ] Email domain DNS records verified

**Launch Day:**
- [ ] Announce on all social channels
- [ ] Monitor Vercel logs for errors
- [ ] Watch Paystack for first sale
- [ ] Respond to customer questions <1 hour
- [ ] Celebrate first sale! 🎊

**Week After Launch:**
- [ ] Send thank you email to first 10 customers
- [ ] Ask for testimonials/reviews
- [ ] Analyze conversion funnel
- [ ] Address any common support issues
- [ ] Plan week 2 marketing push

---

## 💡 **Pro Tips**

1. **Set up Alerts:**
   - Paystack: Enable email for every sale
   - Vercel: Alert on deployment failures
   - Resend: Alert on high bounce rate

2. **Backup Strategy:**
   - Weekly: Download `downloads.db` from Vercel
   - Monthly: Full codebase backup
   - After changes: Git commit with clear message

3. **Customer Delight:**
   - Respond to support emails within 2 hours
   - Send personalized thank-you to first 50 customers
   - Create Facebook group for customers to share experiences

4. **Growth Hacks:**
   - Referral bonus: 10% off for referrals
   - Limited-time launch discount
   - Bundle with wedding website service
   - Partner with Nigerian wedding planners

---

## 📱 **Mobile App (Future)**

If you get >100 sales in first month, consider:
- React Native mobile app
- Push notifications for planning milestones
- Offline access to planner
- Photo gallery for inspiration

Cost estimate: $5,000-10,000 development
Timeline: 2-3 months

---

**Remember:** You've got a solid product! Focus on marketing and customer service. The tech works. 🚀

**Questions?** Refer to `HANDOVER_NOTES.md` for detailed info.
