# Startup Logging System

This document describes the startup logging system for the Piel Lighthouse Resort application.

## Overview

The application logs the status of three main services:
1. **Frontend** - Next.js web application
2. **Backend** - API routes
3. **Database** - MongoDB connection

## How It Works

### 1. Database Connection Logging

The database connection module ([`lib/mongodb.ts`](lib/mongodb.ts) and [`backend/lib/database/mongodb.ts`](backend/lib/database/mongodb.ts)) logs:
- When it starts connecting to MongoDB
- When the connection is successful
- When the database name is established
- When connection fails (with error details)

### 2. Health Check Endpoints

Two health check endpoints are available:

#### Frontend Health Check
- **URL**: `http://localhost:3000/api/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "services": {
      "frontend": "running",
      "database": "connected"
    }
  }
  ```

#### Backend Health Check
- **URL**: `http://localhost:3000/api/health` (within app directory)
- **Response**:
  ```json
  {
    "status": "ok",
    "services": {
      "backend": "running",
      "database": "connected"
    }
  }
  ```

## Available Scripts

### Start the Application
```bash
npm run dev
```
This starts the Next.js development server with all logging enabled.

### Check Service Status
```bash
npm run status
```
This runs the service status checker script ([`scripts/check-services.sh`](scripts/check-services.sh)) which:
- Checks if the frontend is running
- Checks if the backend API is accessible
- Checks if the database is connected
- Displays a summary of all services

## Expected Output

When you run `npm run dev`, you should see:

```
╔══════════════════════════════════════════════════════════════╗
║          PIEL LIGHTHOUSE RESORT - APPLICATION STARTED         ║
╚══════════════════════════════════════════════════════════════╝

🌐 Frontend:  Starting... (Next.js Application)
🔌 Backend:   Starting... (API Routes)
🗄️  Database:  Checking connection...
```

When the database connects:
```
[Database] Connecting to MongoDB...
[Database] ✓ MongoDB connected successfully
[Database] Database: piel_lighthouse_resort
```

When a health check is accessed:
```
[Frontend Health] Checking health...
[Frontend Health] ✓ Frontend and Database are healthy
```

## Manually Checking Services

You can manually check the health of all services by visiting:

1. **Frontend Health**: http://localhost:3000/api/health
2. **Backend Health**: http://localhost:3000/api/health (in app directory)

## Files Created/Modified

- [`lib/mongodb.ts`](lib/mongodb.ts) - Updated with database connection logging
- [`backend/lib/database/mongodb.ts`](backend/lib/database/mongodb.ts) - Updated with database connection logging
- [`app/api/health/route.ts`](app/api/health/route.ts) - Updated with health check logging
- [`backend/api/health/route.ts`](backend/api/health/route.ts) - Updated with health check logging
- [`lib/startup-logger.ts`](lib/startup-logger.ts) - Utility functions for logging
- [`lib/startup-banner.ts`](lib/startup-banner.ts) - Startup banner display
- [`scripts/check-services.sh`](scripts/check-services.sh) - Service status checker script
- [`package.json`](package.json) - Added `status` script

## Troubleshooting

If services are not running:
1. Ensure MongoDB is installed and running
2. Check that `.env.local` contains the correct `MONGODB_URI`
3. Run `npm run status` to see which services are failing
4. Check the terminal logs for error messages
