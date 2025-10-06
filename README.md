# Hausa Wedding Guide

A comprehensive digital guide for planning authentic Hausa weddings, featuring traditional ceremonies, cultural customs, budget planning tools, and step-by-step guidance with secure PDF download functionality.

## 🌟 Features

- **Traditional Ceremonies & Customs**: Complete guide to Hausa wedding traditions
- **Budget Planning & Management**: Comprehensive budgeting tools and expense tracking
- **Cultural Guidance**: Authentic cultural practices and ceremony explanations
- **Planning Timeline**: Step-by-step 2-month planning guide
- **Prayer Resources**: Traditional prayers and their translations
- **Secure PDF Download**: Paystack-integrated payment system with token-based downloads
- **Email Notifications**: Automated download links via Resend
- **Database Persistence**: SQLite-backed token management with download limits

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Via GitHub (Easiest)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project" and import your GitHub repository
4. Vercel will auto-detect Vite configuration and deploy automatically

#### Option 2: Via Vercel CLI

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Option 3: Quick Deploy (Windows)

Run the included `deploy.bat` file for guided deployment.

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm
- Paystack account (for payment testing)
- Resend account (for email testing)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/devbydijah/TheHausaWedingGuide.git
   cd TheHausaWedingGuide
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```env
   PAYSTACK_TEST_SECRET_KEY=your_test_secret_key
   PAYSTACK_SECRET_KEY=your_live_secret_key
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@hausaroom.com
   DOWNLOAD_TOKEN_SECRET=your_secret_for_hmac
   ```

4. **Add the PDF guide:**
   Place your `Hausa_Wedding_Guide.pdf` file in the `public/` directory

5. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

6. **Build for production:**

   ```bash
   npm run build
   ```

7. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
TheHausaWedingGuide/
├── api/                          # Vercel serverless functions
│   ├── paystack-webhook.js       # Payment webhook handler
│   ├── issue-link.js             # Manual link issuance
│   ├── validate-token.js         # Token validation
│   └── download.js               # Secure PDF download
├── lib/                          # Shared utilities
│   ├── database.cjs              # SQLite database operations
│   ├── email.js                  # Email service
│   ├── rateLimit.js              # Rate limiting
│   └── logger.js                 # PII-safe logging
├── public/
│   ├── Hausa_Wedding_Guide.pdf   # Main guide PDF
│   ├── logowhite.svg             # Logo
│   ├── debug.html                # Debug/testing page
│   └── assets/                   # Images and sample pages
├── src/
│   ├── App.jsx                   # Main application component
│   ├── SuccessPage.jsx           # Post-purchase page
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Global styles
│   └── components/
│       └── GuideForm.jsx         # Interactive guide form
├── sql/                          # Database setup scripts
├── .github/
│   └── copilot-instructions.md   # AI coding guidelines
├── index.html                    # HTML template
├── vercel.json                   # Vercel configuration
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies and scripts
└── deploy.bat                    # Windows deployment script
```

## 🎨 Technologies Used

- **React 19.1.1**: Modern React with latest features
- **Tailwind CSS 4.1.11**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **SQLite (better-sqlite3)**: Local database for token persistence
- **Paystack**: Payment processing
- **Resend**: Email delivery
- **Vercel**: Serverless deployment platform
- **Responsive Design**: Mobile-first approach

## 🔧 API Endpoints

### Payment & Downloads

- `POST /api/paystack-webhook` - Handles payment confirmations and issues download tokens
- `POST /api/issue-link` - Manually issues download links (for support/testing)
- `GET /api/validate-token` - Validates download tokens and returns status
- `GET /api/download` - Serves the PDF file with security checks

### Environment Variables Required

- `PAYSTACK_TEST_SECRET_KEY` - Test payment processing
- `PAYSTACK_SECRET_KEY` - Live payment processing
- `RESEND_API_KEY` - Email delivery service
- `FROM_EMAIL` - Sender email address
- `DOWNLOAD_TOKEN_SECRET` - HMAC signing secret
- `VERCEL_URL` - Auto-populated by Vercel

## 📧 Contact

- Email: hausaroom1@gmail.com
- Instagram: [@hausaroom](https://www.instagram.com/hausaroom/)

## 📄 License

ISC License - Feel free to use and modify for personal projects.

---

Made with ❤️ for preserving Hausa wedding traditions
