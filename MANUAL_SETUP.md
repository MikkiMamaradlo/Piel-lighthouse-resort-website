# Piel Lighthouse Resort - Manual Setup Guide

This comprehensive guide provides step-by-step instructions for setting up the Piel Lighthouse Resort website system from scratch.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Step 1: Install Prerequisites](#step-1-install-prerequisites)
3. [Step 2: Clone and Setup Project](#step-2-clone-and-setup-project)
4. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
5. [Step 4: Setup MongoDB](#step-4-setup-mongodb)
6. [Step 5: Configure Gmail SMTP](#step-5-configure-gmail-smtp)
7. [Step 6: Install Dependencies](#step-6-install-dependencies)
8. [Step 7: Start the Application](#step-7-start-the-application)
9. [Initial Admin Account Creation](#initial-admin-account-creation)
10. [Troubleshooting](#troubleshooting)

---

## System Requirements

| Requirement | Minimum Version | Recommended Version |
|-------------|-----------------|---------------------|
| Node.js | 18.x | 20.x LTS |
| pnpm | 8.0 | 9.0+ |
| MongoDB | 5.0 | 7.0+ |
| Operating System | Windows 10/11, macOS 10.15+, or Linux | Latest stable |

### Recommended Tools

- **Package Manager**: pnpm (faster than npm)
- **Code Editor**: Visual Studio Code with TypeScript support
- **Database GUI**: MongoDB Compass (optional, for database visualization)
- **Terminal**: Windows Terminal (Windows), iTerm2 (macOS), or GNOME Terminal (Linux)

---

## Step 1: Install Prerequisites

### 1.1 Install Node.js

**Windows/macOS:**
1. Download the installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the prompts
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Using nvm (Recommended for macOS/Linux):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20 LTS
nvm install 20
nvm use 20

# Verify installation
node --version  # Should show v20.x.x
```

### 1.2 Install pnpm

```bash
# Using npm
npm install -g pnpm

# Using corepack (comes with Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate

# Verify installation
pnpm --version
```

### 1.3 Install MongoDB

**Option A: MongoDB Community Server (Local)**

1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Follow the installation wizard
3. Start MongoDB as a service:
   ```bash
   # Windows (Command Prompt as Administrator)
   net start MongoDB

   # macOS (using Homebrew)
   brew services start mongodb-community

   # Linux (Ubuntu/Debian)
   sudo systemctl start mongod
   ```

4. Verify MongoDB is running:
   ```bash
   mongosh --eval "db.version()"
   ```

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com/)
2. Create a new cluster (free tier)
3. Create a database user:
   - Username: `admin`
   - Password: `your_secure_password`
4. Configure network access:
   - Add IP address `0.0.0.0/0` (allows access from anywhere) or your specific IP
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://admin:your_password@cluster0.xxxxx.mongodb.net/piel_lighthouse_resort?retryWrites=true&w=majority
     ```

---

## Step 2: Clone and Setup Project

### 2.1 Clone the Repository

```bash
# Navigate to your projects directory
cd /path/to/your/projects

# Clone the repository
git clone <repository-url> Piel-lighthouse-resort-website

# Enter the project directory
cd Piel-lighthouse-resort-website
```

### 2.2 Verify Project Structure

After cloning, you should see the following structure:

```
Piel-lighthouse-resort-website/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   ├── admin/                    # Admin panel pages
│   ├── staff/                    # Staff portal pages
│   ├── guest/                    # Guest portal pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── sections/                # Page sections
│   └── ui/                      # UI components
├── lib/                         # Utility functions
│   ├── mongodb.ts               # Database connection
│   ├── email.ts                 # Email configuration
│   └── schemas/                 # Data schemas
├── public/                      # Static assets
├── types/                       # TypeScript types
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

---

## Step 3: Configure Environment Variables

### 3.1 Create Environment File

```bash
# Copy the example file to create your local configuration
cp .env.local.example .env.local

# On Windows
copy .env.local.example .env.local
```

### 3.2 Edit `.env.local` Configuration

Open `.env.local` in your code editor and configure the following variables:

```env
# =============================================================================
# Piel Lighthouse Resort - Environment Variables
# =============================================================================

# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/piel_lighthouse_resort

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://admin:your_password@cluster0.xxxxx.mongodb.net/piel_lighthouse_resort?retryWrites=true&w=majority

# =============================================================================
# JWT Secret for Authentication
# =============================================================================
# Generate a strong random string (at least 32 characters)
# You can generate one using: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# =============================================================================
# Site URL
# =============================================================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# =============================================================================
# Gmail Configuration for Booking Emails
# =============================================================================
# Your Gmail address for sending booking notifications
GMAIL_EMAIL=your_email@gmail.com

# Gmail App Password (16 characters, format: xxxx xxxx xxxx xxxx)
# See GMAIL_SETUP.md for detailed instructions on generating this
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# =============================================================================
# Demo Mode (Optional)
# =============================================================================
# Set to "true" to log emails instead of sending them
# Useful for development without email configuration
DEMO_MODE=false
```

### 3.3 Generate a Secure JWT Secret

```bash
# Using OpenSSL (Linux/macOS/Windows with Git Bash)
openssl rand -base64 32

# Using PowerShell (Windows)
[Convert]::ToBase64String([byte[]]::new(32) | % { Get-Random -Minimum 256 -Maximum 65536 })

# Or use a random string generator online
```

---

## Step 4: Setup MongoDB

### 4.1 Create Database

If using local MongoDB, the database will be created automatically when the app first connects. The database name is `piel_lighthouse_resort`.

### 4.2 Verify Database Connection

Create a test script to verify your MongoDB connection:

```bash
# Create a test file
cat > test-mongodb.js << 'EOF'
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/piel_lighthouse_resort';

async function testConnection() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log('✓ MongoDB connected successfully');
    
    const db = client.db('piel_lighthouse_resort');
    const collections = await db.listCollections().toArray();
    console.log(`✓ Database accessed:piel_lighthouse_resort`);
    console.log(`  Collections: ${collections.length}`);
    
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

# Run the test
node test-mongodb.js

# Clean up
rm test-mongodb.js
```

Expected output for a fresh installation:
```
✓ MongoDB connected successfully
✓ Database accessed: piel_lighthouse_resort
  Collections: 0
```

---

## Step 5: Configure Gmail SMTP

### 5.1 Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Navigate to "2-Step Verification" under "Signing in to Google"
3. Click "Get started" and follow the verification process
4. Complete the setup with your preferred verification method

### 5.2 Generate an App Password

1. After enabling 2-Step Verification, go to:
   https://myaccount.google.com/apppasswords
2. Enter an app name (e.g., "Piel Lighthouse Resort")
3. Click "Create"
4. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
5. Use this password in your `.env.local` file

**Important:** The app password is shown only once. Copy it immediately!

### 5.3 Update Environment Variables

In `.env.local`, update the Gmail settings:

```env
GMAIL_EMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 5.4 Test Email Configuration

Create a test script:

```bash
cat > test-email.js << 'EOF'
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log('✓ Email configuration is valid');
    
    // Send a test email
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL,
      subject: 'Test Email - Piel Lighthouse Resort',
      text: 'This is a test email to verify your email configuration.',
    });
    console.log('✓ Test email sent successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Email configuration failed:', error.message);
    process.exit(1);
  }
}

testEmail();
EOF

node test-email.js
rm test-email.js
```

---

## Step 6: Install Dependencies

### 6.1 Install Using pnpm (Recommended)

```bash
pnpm install
```

This will install all dependencies defined in `package.json`. The installation includes:

| Category | Packages |
|----------|----------|
| Core | Next.js 14, React 19, TypeScript |
| Database | MongoDB, Mongoose |
| UI | Radix UI primitives, Tailwind CSS, Lucide icons |
| Forms | React Hook Form, Zod validation |
| Utilities | date-fns, clsx, tailwind-merge |

### 6.2 Alternative: Install Using npm

```bash
npm install
```

### 6.3 Verify Installation

```bash
# Check installed packages
pnpm list --depth=0

# Verify TypeScript configuration
npx tsc --noEmit
```

---

## Step 7: Start the Application

### 7.1 Development Mode

```bash
pnpm run dev
```

Expected output:
```
  ▲ Next.js 16.0.10
  - Local:   http://localhost:3000
  - Network: http://192.168.x.x:3000

  ✓ Ready in 2.5s
```

### 7.2 Access the Application

Open your browser and navigate to:

| Page | URL | Description |
|------|-----|-------------|
| Home | http://localhost:3000 | Public website |
| Admin Login | http://localhost:3000/admin/login | Admin panel |
| Staff Login | http://localhost:3000/staff/login | Staff portal |
| Guest Login | http://localhost:3000/guest/login | Guest portal |

### 7.3 Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

---

## Initial Admin Account Creation

By default, there is no admin account. You need to create one manually.

### Method 1: Using the Registration API

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Send a POST request to create an admin user:

```bash
# Using curl
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@piel.com",
    "password": "Admin123!",
    "fullName": "System Administrator",
    "phone": "+1234567890",
    "department": "Management",
    "role": "admin"
  }'
```

### Method 2: Using MongoDB Directly

1. Connect to MongoDB:
   ```bash
   mongosh mongodb://localhost:27017/piel_lighthouse_resort
   ```

2. Insert admin user:
   ```javascript
   use piel_lighthouse_resort

   db.admins.insertOne({
     username: "admin",
     email: "admin@piel.com",
     password: "hashed_password_here", // You'll need to hash the password
     fullName: "System Administrator",
     phone: "+1234567890",
     role: "admin",
     isActive: true,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

**Note:** Passwords are hashed using bcrypt. For the manual method, you'll need to create a hashed password first.

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Error:** `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
- Ensure MongoDB is running: `net start MongoDB` (Windows) or `brew services start mongodb-community` (macOS)
- Check the MongoDB port (default: 27017)
- Verify your connection string in `.env.local`
- If using MongoDB Atlas, check your network access settings

#### 2. Module Not Found Errors

**Error:** `Module not found: Can't resolve 'package-name'`

**Solutions:**
- Reinstall dependencies: `pnpm install`
- Clear the pnpm cache: `pnpm store prune && pnpm install`
- Delete `node_modules` and reinstall: `rm -rf node_modules && pnpm install`

#### 3. Email Not Sending

**Error:** `Error: Invalid login` or `AuthenticationFailed`

**Solutions:**
- Ensure you enabled 2-Step Verification on your Google account
- Use an App Password, not your regular Gmail password
- Regenerate the App Password and update `.env.local`
- Check that the App Password format is correct (with or without spaces)

#### 4. JWT Token Errors

**Error:** `JsonWebTokenError: jwt malformed` or `TokenExpiredError`

**Solutions:**
- Ensure `JWT_SECRET` is set in `.env.local`
- The secret must be at least 32 characters
- Clear your browser cookies and try logging in again

#### 5. TypeScript Errors

**Error:** `TypeScript compilation errors`

**Solutions:**
- Run `npx tsc --noEmit` to see all errors
- Ensure you're using the correct TypeScript version
- Check `tsconfig.json` configuration

#### 6. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
- Change the port: `pnpm run dev -- -p 3001`
- Kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Getting Help

If you encounter issues not covered here:

1. Check the [README.md](README.md) for additional information
2. Review the [GMAIL_SETUP.md](GMAIL_SETUP.md) for email-related issues
3. Check the application logs in the terminal
4. Ensure all environment variables are correctly set

---

## Additional Resources

| Resource | Description |
|----------|-------------|
| [README.md](README.md) | Project overview and features |
| [GMAIL_SETUP.md](GMAIL_SETUP.md) | Detailed Gmail SMTP configuration |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Detailed project structure |
| [PORTABILITY_GUIDE.md](PORTABILITY_GUIDE.md) | Moving the project to a new machine |

---

## Quick Reference

### Essential Commands

```bash
# Setup
pnpm install                    # Install dependencies
pnpm run dev                    # Start development server
pnpm run build                  # Build for production
pnpm run start                 # Start production server

# Database
mongosh                        # Start MongoDB shell
mongosh --eval "db.version()"  # Check MongoDB version

# Testing
npx tsc --noEmit              # TypeScript type check
```

### Environment Variables Quick Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT tokens (32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL (default: http://localhost:3000) |
| `GMAIL_EMAIL` | Yes* | Gmail address for emails |
| `GMAIL_APP_PASSWORD` | Yes* | Gmail App Password |
| `DEMO_MODE` | No | Enable demo mode (true/false) |

*Required only if email functionality is needed
