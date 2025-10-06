# Phase 2: Email Integration & Product Detection

## Overview

Modify the payment webhook to detect which product was purchased (PDF, Web App, or Bundle) and send appropriate access credentials.

## Product Types

### 1. **PDF Only** (Current - Already Working)

- **What customer gets:** Download link for PDF guide
- **Email:** Current template with download link
- **Access:** 24-hour download window, 3 downloads max

### 2. **Web App Only** (New)

- **What customer gets:** Login credentials for interactive web app
- **Email:** Welcome email with shared password and web app link
- **Access:** Permanent access via email + shared password

### 3. **Bundle** (New - PDF + Web App)

- **What customer gets:** Both PDF download + web app access
- **Email:** Combined email with both download link and login credentials
- **Access:** Both 24-hour PDF download + permanent web app access

## Implementation Steps

### Step 1: Product Detection Logic

Add logic to detect product type from Paystack metadata or product name:

- Check `metadata.product_type` field
- Fallback to checking product name/description
- Default to PDF for backward compatibility

### Step 2: Create New Email Templates

- `sendWebAppAccessEmail()` - For web app only purchases
- `sendBundleEmail()` - For bundle purchases
- Keep existing `sendDownloadEmail()` for PDF only

### Step 3: Update Webhook Handler

- Add product type detection
- Route to appropriate email template
- Log product type for analytics

### Step 4: Environment Variables

Add to `.env`:

```
VITE_SHARED_PASSWORD=your_shared_password
WEB_APP_URL=https://guide.hausaroom.com
```

## Paystack Product Setup

### Configure Products in Paystack Dashboard:

1. **PDF Guide**
   - Metadata: `{"product_type": "pdf"}`
2. **Interactive Web App**
   - Metadata: `{"product_type": "webapp"}`
3. **Complete Bundle**
   - Metadata: `{"product_type": "bundle"}`

## Email Templates

### Web App Access Email

```
Subject: Your Hausa Wedding Guide – Interactive Access
Body:
- Welcome message
- Shared password: [PASSWORD]
- Web app link: [WEB_APP_URL]/?guide=1
- Instructions to log in with their email + shared password
- Reminder: Data syncs across devices
```

### Bundle Email

```
Subject: Your Hausa Wedding Guide – Complete Package
Body:
- Welcome message
- PDF Download link (24-hour window)
- Web app access (shared password + link)
- Instructions for both
```

## Next Actions

1. Create new email templates in `lib/email.js`
2. Add product detection logic to webhook
3. Test with different product types
4. Update Paystack product metadata
