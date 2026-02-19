# Production Deployment Guide

This guide covers everything needed to deploy the Piel Lighthouse Resort system for long-term production use on the internet.

## Prerequisites

- Node.js 18+ installed
- A MongoDB database (local or cloud)
- A domain name (recommended)
- Git for version control

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd piel-lighthouse-resort

# Install dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database (required) - Use MongoDB Atlas for production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/piel_lighthouse_resort

# Security Secrets (CRITICAL - generate unique values)
ADMIN_SECRET=your-random-secret-key-at-least-32-chars
GUEST_SECRET=your-random-secret-key-at-least-32-chars
STAFF_SECRET=your-random-secret-key-at-least-32-chars

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<hashed-password>

# Site URL (required for production)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Email (optional - for booking notifications)
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### 3. Generate Security Secrets

Run this command to generate secure random secrets:

```bash
node -e "console.log('ADMIN_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('GUEST_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('STAFF_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Generate Admin Password Hash

```bash
# Replace 'your-admin-secret' with your ADMIN_SECRET value
# Replace 'your-password' with your desired admin password
node -e "console.log(require('crypto').createHmac('sha256', 'your-admin-secret').update('your-password').digest('hex'))"
```

### 5. Build and Start

```bash
# Build for production
npm run build

# Start the production server
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com) and sign up
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy

**Required Vercel Environment Variables:**
- `MONGODB_URI` - Your MongoDB connection string
- `ADMIN_SECRET` - Generate a random 32+ character string
- `GUEST_SECRET` - Generate a random 32+ character string
- `STAFF_SECRET` - Generate a random 32+ character string
- `ADMIN_USERNAME` - Your admin username
- `ADMIN_PASSWORD_HASH` - Hash of your admin password
- `NEXT_PUBLIC_SITE_URL` - Your Vercel domain (e.g., your-app.vercel.app)

### Option 2: Traditional Server

```bash
# Install Node.js and PM2
sudo apt update
sudo apt install nodejs npm
sudo npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "piel-lighthouse" -- start

# Setup startup script
pm2 startup
pm2 save
```

### Option 3: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Create `.dockerignore`:

```
node_modules
.next
.git
*.md
```

Build and run:

```bash
docker build -t piel-lighthouse .
docker run -p 3000:3000 -d piel-lighthouse
```

## MongoDB Setup

### Using MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free cluster
3. Create database user
4. Get connection string
5. Add to environment variables

### Using Local MongoDB

```bash
# Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongodb
```

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to Security > App Passwords
3. Create a new app password
4. Use the 16-character password in `GMAIL_APP_PASSWORD`

### Alternative Email Services

You can modify `lib/email.ts` to use other SMTP services:

```typescript
// For other SMTP providers
const transporter = nodemailer.createTransport({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use unique, random secrets for ADMIN_SECRET, GUEST_SECRET, STAFF_SECRET
- [ ] Use HTTPS in production
- [ ] Configure domain in NEXT_PUBLIC_SITE_URL
- [ ] Use MongoDB Atlas or secure local MongoDB
- [ ] Enable firewall on server (if using local)
- [ ] Regular backups of database

## Monitoring

### Health Check Endpoint

The system includes a health check at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

### Logging

Production logs are available in:
- Console output when running locally
- Vercel dashboard for Vercel deployments
- PM2 logs: `pm2 logs piel-lighthouse`

## Troubleshooting

### Database Connection Issues

1. Verify MONGODB_URI is correct
2. Check MongoDB Atlas network settings (allow access from everywhere or your IP)
3. Verify database name in connection string

### Authentication Issues

1. Verify ADMIN_SECRET matches between builds
2. Check ADMIN_PASSWORD_HASH is correct
3. Clear browser cookies and try again

### Email Not Sending

1. Check GMAIL_APP_PASSWORD is correct (16 characters)
2. Verify 2FA is enabled on Gmail account
3. Check DEMO_MODE is not set to "true"

## Backup and Maintenance

### Database Backup (MongoDB Atlas)

1. Go to MongoDB Atlas Dashboard
2. Click on your cluster
3. Click "Backup"
4. Schedule automated backups or create manual snapshot

### Manual Backup

```bash
# If using mongodump locally
mongodump --db=piel_lighthouse_resort --out=./backup
```

### Updating the Application

```bash
# Pull latest changes
git pull

# Install dependencies
npm install

# Rebuild
npm run build

# Restart (if using PM2)
pm2 restart piel-lighthouse
```

## Support

For issues and questions:
- Check the logs for error messages
- Review this documentation
- Check MongoDB Atlas status
