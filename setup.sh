#!/bin/bash

# Hausa Wedding Guide Setup Script
# This script helps new developers get started quickly

echo "🏠 Setting up Hausa Wedding Guide development environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have $(node -v)."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check for environment file
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local file found. Creating template..."
    cat > .env.local << EOL
# Paystack Configuration
PAYSTACK_TEST_SECRET_KEY=your_test_secret_key_here
PAYSTACK_SECRET_KEY=your_live_secret_key_here

# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@hausaroom.com

# Security
DOWNLOAD_TOKEN_SECRET=your_secure_random_string_here

# Vercel (auto-populated in production)
VERCEL_URL=http://localhost:3000
EOL
    echo "✅ Created .env.local template"
    echo "   Please edit .env.local with your actual API keys"
    echo ""
else
    echo "✅ .env.local file already exists"
fi

# Check for PDF file
if [ ! -f "public/Hausa_Wedding_Guide.pdf" ]; then
    echo "⚠️  PDF guide not found in public/ directory"
    echo "   Please place your Hausa_Wedding_Guide.pdf file in the public/ folder"
    echo ""
else
    echo "✅ PDF guide found"
fi

# Initialize database (if using SQLite)
echo "🗄️  Initializing database..."
node -e "
try {
  const { tokenDB } = require('./lib/database.cjs');
  console.log('Database initialized successfully');
} catch (e) {
  console.log('Database initialization skipped (may auto-create on first run)');
}
"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Add your PDF guide to public/Hausa_Wedding_Guide.pdf"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:5173 in your browser"
echo ""
echo "For testing payments, use Paystack test mode with these cards:"
echo "  - Success: 4084084084084081"
echo "  - Declined: 4000000000000002"
echo "  - CVV: 408"
echo "  - Expiry: Any future date"
echo ""
echo "Happy coding! 🎊"