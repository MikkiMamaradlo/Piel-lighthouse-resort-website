# Portability Guide

This guide explains how to manually set up the Piel Lighthouse Resort website on any device using terminal commands.

---

## Manual Terminal Setup

### Step 1: Open Terminal

**Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Or search for "Command Prompt" or "PowerShell"

**macOS:**
- Press `Cmd + Space`, type "Terminal", press Enter

**Linux:**
- Press `Ctrl + Alt + T`

### Step 2: Navigate to Project Directory

```bash
cd "d:/ASUS-PC/Documents/Piel LightHouse/Piel-lighthouse-resort-website-1"
```

### Step 3: Install Node.js (if not installed)

Check if Node.js is installed:
```bash
node --version
```

If not installed, download from https://nodejs.org (choose LTS version)

### Step 4: Install pnpm (package manager)

```bash
npm install -g pnpm
```

Verify installation:
```bash
pnpm --version
```

### Step 5: Install Project Dependencies

```bash
pnpm install
```

This will install all packages listed in `package.json`. Wait for it to complete.

### Step 6: Create Environment File

Copy the example file to create your local environment file:

**Windows (Command Prompt):**
```bash
copy .env.local.example .env.local
```

**Windows (PowerShell):**
```bash
Copy-Item .env.local.example .env.local
```

**macOS/Linux (Bash):**
```bash
cp .env.local.example .env.local
```

### Step 7: Configure Environment Variables

Edit the `.env.local` file using a text editor:

**Windows (using notepad):**
```bash
notepad .env.local
```

**Using VS Code:**
```bash
code .env.local
```

Make sure these values are set:
```
MONGODB_URI=mongodb://localhost:27017/piel_lighthouse_resort
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 8: Start the Development Server

```bash
pnpm run dev
```

You should see output similar to:
```
▲ Next.js 16.0.10
   - Local: http://localhost:3000
   - Environments: .env.local
```

### Step 9: Open in Browser

Open your web browser and navigate to:
```
http://localhost:3000
```

---

## Setup with NPM (Alternative)

If you prefer using npm instead of pnpm:

```bash
# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local

# Start development server
npm run dev
```

---

## Available Terminal Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Run ESLint |
| `pnpm run setup` | Run automated setup (Windows) |

---

## Troubleshooting Common Issues

### Issue: "command not found: pnpm"

**Solution:** Install pnpm globally:
```bash
npm install -g pnpm
```

### Issue: "Port 3000 already in use"

**Solution 1:** Kill the process using port 3000
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill by PID (replace PID_NUMBER)
taskkill /PID PID_NUMBER /F
```

**Solution 2:** Use a different port
```bash
# Set port before running dev
set PORT=3001
pnpm run dev
```

### Issue: "Cannot find module 'next'"

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: MongoDB connection failed

**Solution:** 
1. Make sure MongoDB is running
2. Check your `MONGODB_URI` in `.env.local`
3. For local MongoDB, ensure it's installed and running:
   ```bash
   # Start MongoDB service (Windows)
   net start MongoDB
   ```

### Issue: "Electron not found" (Windows build tools)

**Solution:** Install build tools:
```bash
npm install -g windows-build-tools
```

---

## Quick Reference: One-Line Setup

Combine all steps into a single command:

```bash
cd "d:/ASUS-PC/Documents/Piel LightHouse/Piel-lighthouse-resort-website-1" && npm install -g pnpm && pnpm install && copy .env.local.example .env.local && notepad .env.local && pnpm run dev
```

---

## Stopping the Server

To stop the development server:
- Press `Ctrl + C` in the terminal
- Or close the terminal window

---

## Checking Server Status

To verify the server is running:
```bash
# Check if port 3000 is listening
netstat -ano | findstr :3000

# Or try to curl the localhost
curl http://localhost:3000
```

---

## Files to Transfer to Another Device

When moving to a new computer, copy these files/folders:

**Required:**
- Entire project folder (all files)
- `.env.local` file (contains all your configuration)

**Optional (can be regenerated):**
- `node_modules/` - Will be reinstalled with `pnpm install`
- `.next/` - Will be rebuilt automatically
- `pnpm-lock.yaml` - Will be regenerated

---

## Backup Your Configuration

Regularly backup your `.env.local` file as it contains:
- Database connection strings
- Email credentials
- Authentication secrets
