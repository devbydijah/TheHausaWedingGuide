# Go-Live Checklist - Hausa Wedding Guide

## Pre-Launch Preparation ✅

### 1. Environment Configuration

- [ ] Set production environment variables in Vercel:
  - `PAYSTACK_SECRET_KEY` (live key)
  - `RESEND_API_KEY`
  - `FROM_EMAIL`
  - `DOWNLOAD_TOKEN_SECRET`
- [ ] Verify Paystack webhook URL: `https://your-domain.vercel.app/api/paystack-webhook`
- [ ] Test email domain verification (SPF/DKIM/DMARC) in Resend
- [ ] Configure Google Analytics measurement ID in `index.html`

### 2. Database Setup

- [ ] SQLite database auto-creates on first run (no manual setup needed)
- [ ] Test database operations in staging environment
- [ ] Verify token storage and validation works

### 3. Security Verification

- [ ] Test HMAC signature validation for download URLs
- [ ] Verify rate limiting (60 requests/minute per IP)
- [ ] Confirm PII-safe logging (email masking)
- [ ] Test download limits (3 downloads per token)

### 4. Payment Testing

- [ ] Test live Paystack storefront with real payment
- [ ] Verify webhook processing and token generation
- [ ] Test email delivery with download links
- [ ] Confirm token expiration (24 hours)

### 5. Content & Assets

- [ ] Upload final PDF: `Hausa_Wedding_Guide.pdf` to `/public/`
- [ ] Verify all images load correctly
- [ ] Test PDF download functionality
- [ ] Check responsive design on mobile/tablet/desktop

## Launch Day Tasks 🚀

### 6. Domain & Hosting

- [ ] Point domain to Vercel (update DNS records)
- [ ] Enable HTTPS certificate
- [ ] Test SSL certificate validity
- [ ] Verify domain redirects work correctly

### 7. Final Testing

- [ ] Complete end-to-end test: Visit site → Purchase → Receive email → Download PDF
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on multiple devices (iOS Safari, Android Chrome)
- [ ] Verify all links and buttons work
- [ ] Test error scenarios (expired tokens, invalid signatures)

### 8. Monitoring Setup

- [ ] Enable Vercel Analytics or Google Analytics
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure uptime monitoring
- [ ] Set up email alerts for critical errors

### 9. Backup & Recovery

- [ ] Create database backup before launch
- [ ] Document backup procedures for ongoing operations
- [ ] Test backup restoration process

## Post-Launch Verification ✅

### 10. Live Site Checks

- [ ] Visit production URL and verify site loads
- [ ] Test a real purchase flow (use test card if needed)
- [ ] Verify email delivery works
- [ ] Confirm PDF downloads successfully
- [ ] Check Google Analytics tracking

### 11. Marketing Launch

- [ ] Update social media profiles with live links
- [ ] Send launch announcement emails
- [ ] Post on social media platforms
- [ ] Submit to relevant directories/websites

### 12. Monitoring & Support

- [ ] Monitor error logs for first 24-48 hours
- [ ] Set up customer support email forwarding
- [ ] Prepare FAQ for common issues
- [ ] Monitor payment success rates

## Emergency Contacts 📞

- **Technical Issues**: [Your contact info]
- **Payment Issues**: Paystack support
- **Email Issues**: Resend support
- **Hosting Issues**: Vercel support

## Rollback Plan (if needed)

1. If critical issues found:
   - Pause marketing/promotion
   - Fix issues in development
   - Redeploy to staging for re-testing
   - Re-launch after fixes verified

2. Database issues:
   - Restore from backup
   - Communicate with affected customers
   - Offer manual download links if needed

## Success Metrics 📊

Track these KPIs post-launch:

- Site traffic (Google Analytics)
- Conversion rate (visits → purchases)
- Payment success rate
- Email delivery rate
- Download completion rate
- Customer support ticket volume

## Timeline

- **T-7 days**: Complete all pre-launch tasks
- **T-1 day**: Final testing and backups
- **Launch Day**: Domain switch, monitoring activation
- **Launch +1 hour**: First purchase verification
- **Launch +24 hours**: Full system verification

---

**Remember**: Test everything multiple times. Better to delay launch than ship with bugs. Have a support plan ready for the first customers.</content>
<parameter name="filePath">c:\Users\khadi\Desktop\TheHausaWedingGuide\GO_LIVE_CHECKLIST.md
