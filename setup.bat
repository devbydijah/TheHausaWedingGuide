@echo off
REM Hausa Wedding Guide Setup Script (Windows)
REM This script helps new developers get started quickly

echo 🏠 Setting up Hausa Wedding Guide development environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1 delims=v." %%i in ('node --version') do set NODE_MAJOR=%%i
if %NODE_MAJOR% lss 18 (
    echo ❌ Node.js version 18+ is required. You have:
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js detected:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm detected:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check for environment file
if not exist ".env.local" (
    echo ⚠️  No .env.local file found. Creating template...
    (
        echo # Paystack Configuration
        echo PAYSTACK_TEST_SECRET_KEY=your_test_secret_key_here
        echo PAYSTACK_SECRET_KEY=your_live_secret_key_here
        echo.
        echo # Email Configuration
        echo RESEND_API_KEY=your_resend_api_key_here
        echo FROM_EMAIL=noreply@hausaroom.com
        echo.
        echo # Security
        echo DOWNLOAD_TOKEN_SECRET=your_secure_random_string_here
        echo.
        echo # Vercel (auto-populated in production)
        echo VERCEL_URL=http://localhost:3000
    ) > .env.local
    echo ✅ Created .env.local template
    echo    Please edit .env.local with your actual API keys
    echo.
) else (
    echo ✅ .env.local file already exists
)

REM Check for PDF file
if not exist "public\Hausa_Wedding_Guide.pdf" (
    echo ⚠️  PDF guide not found in public\ directory
    echo    Please place your Hausa_Wedding_Guide.pdf file in the public\ folder
    echo.
) else (
    echo ✅ PDF guide found
)

REM Initialize database (if using SQLite)
echo 🗄️  Initializing database...
node -e "try { const { tokenDB } = require('./lib/database.cjs'); console.log('Database initialized successfully'); } catch (e) { console.log('Database initialization skipped (may auto-create on first run)'); }"

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your API keys
echo 2. Add your PDF guide to public\Hausa_Wedding_Guide.pdf
echo 3. Run 'npm run dev' to start the development server
echo 4. Visit http://localhost:5173 in your browser
echo.
echo For testing payments, use Paystack test mode with these cards:
echo   - Success: 4084084084084081
echo   - Declined: 4000000000000002
echo   - CVV: 408
echo   - Expiry: Any future date
echo.
echo Happy coding! 🎊
echo.
pause