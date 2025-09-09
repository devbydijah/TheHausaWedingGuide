@echo off
echo Building the project...
npm run build

echo.
echo Project built successfully!
echo.
echo To deploy to Vercel:
echo 1. Install Vercel CLI: npm install -g vercel
echo 2. Login: vercel login
echo 3. Deploy: vercel --prod
echo.
echo Alternatively, deploy via GitHub:
echo 1. Push to GitHub
echo 2. Go to vercel.com
echo 3. Import your repository
echo 4. Deploy automatically
echo.
pause
