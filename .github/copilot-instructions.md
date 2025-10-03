# Hausa Wedding Guide - AI Coding Agent Instructions

## Architecture Overview

This is a React-based e-commerce application for selling a PDF wedding guide with Paystack payment integration.

**Frontend:** Single-page React app (`src/App.jsx`) handling UI, token validation, and download logic
**Backend:** Vercel serverless functions in `/api/` directory
**Payment:** Paystack storefront integration with webhook processing
**Email:** Resend API for transactional emails
**Storage:** Static PDF served from `/public/` directory
**Security:** Crypto-generated tokens with 24-hour expiration

## Critical Workflows

### Payment Flow

1. Customer clicks "Buy Now" → redirects to Paystack storefront
2. Payment completion → Paystack webhook hits `/api/paystack-webhook.js`
3. Webhook generates secure download token and sends email via Resend
4. Customer receives email with download link containing token
5. Frontend validates token and serves PDF from `/public/Hausa_Wedding_Guide.pdf`

### Token System

- Tokens generated using `crypto.randomBytes(32).toString('hex')`
- URL format: `/?download={token}&expires={timestamp}&email={email}`
- 24-hour expiration enforced on frontend and backend
- Single-use download tracking (up to 3 downloads per purchase) - **currently not implemented**

### Environment Configuration

```javascript
// Dual Paystack key support (test/live)
PAYSTACK_TEST_SECRET_KEY; // for development/testing
PAYSTACK_SECRET_KEY; // for production

// Email configuration
RESEND_API_KEY; // for sending emails
FROM_EMAIL; // sender address (noreply@hausaroom.com)

// Deployment
VERCEL_URL; // auto-populated by Vercel
```

## Key Files & Patterns

### API Endpoints (`/api/`)

- `paystack-webhook.js` - Processes payment confirmations, generates tokens with HMAC signatures
- `issue-link.js` - Manual token generation for testing/support with HMAC signatures
- `validate-token.js` - Server-side token verification returning JSON status
- `download.js` - Hardened PDF download endpoint with signature verification and rate limiting
- `email.js` - Email sending utilities with PII-safe logging

### Frontend Patterns (`src/App.jsx`)

- State management for download status: `'valid' | 'expired' | 'downloading' | null`
- Countdown timer for token expiration display
- Email claim flow for post-purchase access
- Mobile-first responsive design with Tailwind CSS

### Security Headers (`vercel.json`)

- CSP allowing Paystack scripts and API calls
- Cache control preventing PDF caching (`max-age=0, must-revalidate`)
- Download options set to prevent auto-opening (`X-Download-Options: noopen`)
- Content-Disposition: attachment for PDF downloads

### Security Utilities (`/lib/`)

- `rateLimit.js` - In-memory rate limiting per IP (token bucket)
- `logger.js` - PII-safe logging with email masking
- `email.js` - Email service with masked logging
- `database.cjs` - SQLite database operations for token persistence

### Database Schema (`sql/complete_setup.sql`)

```sql
CREATE TABLE public.sales (
    tx_ref TEXT NOT NULL UNIQUE,      -- Paystack transaction reference
    email TEXT NOT NULL,              -- customer email
    password_hash TEXT NOT NULL,      -- unused legacy field
    downloads INTEGER DEFAULT 0,      -- download count tracking (not implemented)
    max_downloads INTEGER DEFAULT 3,  -- download limit (not implemented)
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### SQLite Database (`downloads.db`)

```sql
CREATE TABLE tokens (
    email TEXT NOT NULL,
    token TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    downloads_remaining INTEGER NOT NULL DEFAULT 3,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    last_download_at INTEGER
);
```

## Development Commands

```bash
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Production build to /dist
npm run preview  # Preview production build locally
vercel dev       # Local Vercel serverless environment testing
```

## Deployment Checklist

1. **Environment Variables** (Vercel dashboard):
   - `PAYSTACK_SECRET_KEY` - Live payment processing
   - `PAYSTACK_TEST_SECRET_KEY` - Test payment processing
   - `RESEND_API_KEY` - Email delivery
   - `FROM_EMAIL` - Email sender address (verify domain SPF/DKIM/DMARC)

2. **Paystack Webhook** (Paystack dashboard):
   - URL: `https://your-app.vercel.app/api/paystack-webhook`
   - Events: `charge.success`
   - Raw body access required for signature verification

3. **Database Setup**: SQLite database (`downloads.db`) is auto-created on first run
4. **PDF Upload**: Place `Hausa_Wedding_Guide.pdf` in `/public/` directory

## Testing Flow

1. Use `?test=1` URL parameter to enable test storefront
2. Complete payment with test card (Paystack provides test cards)
3. Verify email delivery and download link functionality
4. Test token expiration (24 hours) and download limits
5. **Debug Page**: Visit `/debug.html` to simulate payment flows and test endpoints
6. **Local Webhooks**: Use `vercel dev` + ngrok/cloudflared to receive live Paystack webhooks locally

## Environment Matrix

| Environment | Paystack Key               | Email Domain    | Debug Access |
| ----------- | -------------------------- | --------------- | ------------ |
| Preview     | `PAYSTACK_TEST_SECRET_KEY` | Sandbox domain  | Available    |
| Production  | `PAYSTACK_SECRET_KEY`      | Verified domain | Disabled     |

## Go-Live Checklist

- [ ] Environment variables set in Vercel
- [ ] Domain verified in Resend (SPF/DKIM/DMARC pass)
- [ ] Paystack webhook URL configured
- [ ] Test payment succeeds with test card
- [ ] Email delivered within 60 seconds
- [ ] Download link works and forces PDF download
- [ ] Invalid signature returns 401
- [ ] Expired link shows correct UI
- [ ] Debug page removed or gated in production

## Common Patterns

- **Error Handling**: Return JSON `{error: "message"}` with appropriate HTTP status
- **Environment Detection**: Check `VERCEL_URL` for production vs localhost
- **Dual Mode Support**: Test/live keys tried in sequence for flexibility
- **Email Templates**: Inline CSS styling for reliable rendering, HTML + plaintext versions
- **Token Security**: HMAC verification for webhook authenticity
- **Logging**: `console.log/error/warn` for runtime info, errors go to Vercel logs
- **PII Safety**: Mask emails in logs (e.g., `k****@domain.com`), never log tokens/signatures

## Error Response Codes

| Status | Error Case        | Example                                   |
| ------ | ----------------- | ----------------------------------------- |
| 400    | Invalid params    | `{error: "reference is required"}`        |
| 401    | Invalid signature | `{error: "Invalid signature"}`            |
| 404    | No payment found  | `{error: "No recent successful payment"}` |
| 429    | Rate limited      | `{error: "Too many requests"}`            |
| 500    | Server error      | `{error: "Internal server error"}`        |

## File Structure Conventions

```
api/           # Vercel serverless functions
lib/           # Shared utilities (email.js)
public/        # Static assets including PDF and debug.html
sql/           # Database setup scripts (optional/legacy)
src/           # React application
  components/  # Reusable React components
```

## Gotchas

- Paystack webhooks require raw body access for signature verification
- Token URLs must include `expires` timestamp for validation
- Email claim flow bypasses payment for support scenarios
- Supabase integration partially implemented but may be deprecated
- PDF served with `noopen` header to prevent browser auto-opening
- **NEW:** SQLite database (`downloads.db`) auto-creates on first run
- **NEW:** Download limits enforced (3 downloads per token)
- Database tracking for downloads is now fully implemented
- `validate-token.js` returns database-backed status (`valid`|`expired`|`invalid`|`limit_reached`)
- **NEW:** HMAC signatures required for all download URLs (`sig` parameter)
- **NEW:** Rate limiting applied to download endpoints (60 requests/minute per IP)
- **NEW:** All logging masks email addresses for PII compliance
- Webhook idempotency: check `tx_ref` exists and return 200 early for retries
- Protect `debug.html` in production (remove or gate with secret query param)
- Email deliverability requires domain verification (SPF/DKIM/DMARC)
- PDF access hardening needed (signed URLs or download API route)</content>
  <parameter name="filePath">c:\Users\khadi\Desktop\TheHausaWedingGuide\.github\copilot-instructions.md
