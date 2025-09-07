# Hausa Wedding Guide - Paystack Storefront Integration

## 🚀 Setup Instructions

### 1. Environment Variables

Add these to your Vercel environment variables:

```env
PAYSTACK_SECRET_KEY=sk_your_secret_key_here
RESEND_API_KEY=re_your_resend_key_here
FROM_EMAIL=noreply@yourdomain.com
```

### 2. Paystack Webhook Configuration

Set your Paystack webhook URL to:

```
https://hausaroom.ng/wc-api/Tbz_WC_Paystack_Webhook/
```

### 3. Storefront URL ✅ CONFIGURED

The Paystack storefront URL has been set to:

```javascript
const PAYSTACK_STOREFRONT_URL = "https://paystack.shop/hausaroom-wedding-guide";
```

✅ This is already configured in `src/App.jsx`

## 📋 How It Works

1. **Customer visits your website** - Views the guide details
2. **Customer clicks "Buy Now"** - Redirected to Paystack storefront
3. **Customer completes payment** - On Paystack's secure platform
4. **Paystack sends webhook** - To your webhook endpoint
5. **System generates download token** - 24-hour temporary access
6. **Customer receives email** - With link back to your website + token
7. **Customer downloads PDF** - One-time download from your site

## 🔧 Technical Details

- **Frontend**: React with Tailwind CSS
- **Backend**: Vercel serverless functions
- **Email**: Resend API
- **Payment**: Paystack storefront + webhook
- **File Storage**: Static PDF in `/public` folder
- **Token System**: Simple crypto-generated tokens with expiration

## 📁 Core Files

- `src/App.jsx` - Main React application with download logic
- `api/paystack-webhook.js` - Processes payment webhooks
- `api/email.js` - Sends download emails via Resend
- `public/Hausa_Wedding_Guide.pdf` - The product file

## 🛠 Deploy

```bash
npm install
npm run build
# Deploy to Vercel
```

Webhook will be available at: `https://yourdomain.vercel.app/api/paystack-webhook`
