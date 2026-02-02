@echo off
REM ============================================
REM Piel Lighthouse Resort - One-Tap Setup Script
REM ============================================

setlocal enabledelayedexpansion

echo.
echo 🏝️  Piel Lighthouse Resort - Setup
echo ===================================
echo.

REM Step 1: Check for pnpm
echo [1/5] Checking for pnpm...
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('pnpm --version') do set pnpmVersion=%%i
    echo    ✓ pnpm version %pnpmVersion% found
    echo.
) else (
    echo    ✗ pnpm not found. Please install pnpm first:
    echo      npm install -g pnpm
    echo.
    exit /b 1
)

REM Step 2: Install dependencies
echo [2/5] Installing dependencies with pnpm...
call pnpm install
if %errorlevel% equ 0 (
    echo    ✓ Dependencies installed successfully
    echo.
) else (
    echo    ✗ Failed to install dependencies
    echo.
    exit /b 1
)

REM Step 3: Create environment file
echo [3/5] Setting up environment variables...
if exist ".env.local" (
    echo    ⚠ .env.local already exists, skipping...
    echo.
) else (
    if exist ".env.local.example" (
        copy ".env.local.example" ".env.local" >nul
        echo    ✓ Created .env.local from template
        echo    ⚠ Please edit .env.local and add your MongoDB URI and Gmail App Password
        echo.
    ) else (
        echo    ✗ .env.local.example not found
        echo.
        exit /b 1
    )
)

REM Step 4: Verify TypeScript configuration
echo [4/5] Verifying TypeScript configuration...
call npx tsc --noEmit >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ TypeScript configuration is valid
    echo.
) else (
    echo    ⚠ TypeScript check found issues (this may be normal during initial setup)
    echo.
)

REM Step 5: Summary
echo [5/5] Setup Complete!
echo ==================================
echo.
echo 📋 Next Steps:
echo    1. Edit .env.local and configure:
echo       - MONGODB_URI (your MongoDB connection string)
echo       - GMAIL_APP_PASSWORD (see GMAIL_SETUP.md)
echo.
echo    2. Start the development server:
echo       pnpm run dev
echo.
echo    3. Open http://localhost:3000 in your browser
echo.
echo ==================================

endlocal
