#!/usr/bin/env pwsh
# ============================================
# Piel Lighthouse Resort - One-Tap Setup Script
# ============================================

$ErrorActionPreference = "Stop"

# Change to the script's directory
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath

Write-Host "`n🏝️  Piel Lighthouse Resort - Setup`n" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "" 

# Step 1: Check for pnpm
Write-Host "[1/5] Checking for pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "    ✓ pnpm version $pnpmVersion found`n" -ForegroundColor Green
} catch {
    Write-Host "    ✗ pnpm not found. Please install pnpm first:" -ForegroundColor Red
    Write-Host "      npm install -g pnpm`n" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Install dependencies
Write-Host "[2/5] Installing dependencies with pnpm..." -ForegroundColor Yellow
try {
    pnpm install
    Write-Host "    ✓ Dependencies installed successfully`n" -ForegroundColor Green
} catch {
    Write-Host "    ✗ Failed to install dependencies`n" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Create environment file
Write-Host "[3/5] Setting up environment variables..." -ForegroundColor Yellow
$envFile = ".env.local"
$envExample = ".env.local.example"

if (Test-Path $envFile) {
    Write-Host "    ⚠ .env.local already exists, skipping...`n" -ForegroundColor Yellow
} else {
    if (Test-Path $envExample) {
        Copy-Item $envExample $envFile
        Write-Host "    ✓ Created .env.local from template`n" -ForegroundColor Green
        Write-Host "    ⚠ Please edit .env.local and add your MongoDB URI and Gmail App Password`n" -ForegroundColor Yellow
    } else {
        Write-Host "    ✗ .env.local.example not found`n" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Step 4: Verify TypeScript configuration
Write-Host "[4/5] Verifying TypeScript configuration..." -ForegroundColor Yellow
try {
    npx tsc --noEmit
    Write-Host "    ✓ TypeScript configuration is valid`n" -ForegroundColor Green
} catch {
    Write-Host "    ⚠ TypeScript check found issues (this may be normal during initial setup)`n" -ForegroundColor Yellow
}

# Step 5: Summary
Write-Host "[5/5] Setup Complete!`n" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host "`n📋 Next Steps:" -ForegroundColor White
Write-Host "   1. Edit .env.local and configure:" -ForegroundColor White
Write-Host "      - MONGODB_URI (your MongoDB connection string)" -ForegroundColor White
Write-Host "      - GMAIL_APP_PASSWORD (see GMAIL_SETUP.md)`n" -ForegroundColor White
Write-Host "   2. Start the development server:" -ForegroundColor White
Write-Host "      pnpm run dev`n" -ForegroundColor White
Write-Host "   3. Open http://localhost:3000 in your browser`n" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
