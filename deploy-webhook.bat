@echo off
echo ========================================
echo Deploying Cryptomus Webhook to Supabase
echo ========================================
echo.

echo Step 1: Installing Supabase CLI...
echo y | npx supabase@latest --version
echo.

echo Step 2: Logging in to Supabase...
npx supabase@latest login
echo.

echo Step 3: Linking to your project...
npx supabase@latest link --project-ref vttnpbucjgaddyyukbog
echo.

echo Step 4: Deploying webhook function...
npx supabase@latest functions deploy cryptomus-webhook
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your webhook URL is:
echo https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
echo.
echo Next: Add this URL to your Cryptomus dashboard
echo https://cryptomus.com/dashboard
echo.
pause
