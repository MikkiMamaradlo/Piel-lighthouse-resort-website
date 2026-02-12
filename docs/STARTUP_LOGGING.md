# Startup Logging System

This document describes the startup logging system for the Piel Lighthouse Resort application.

## Overview

The application logs the status of services during startup and runtime:

1. **Frontend** - Next.js web application
2. **Backend** - API routes and MongoDB connection
3. **Database** - MongoDB connection status

## Logging Components

### Database Connection Logging

The MongoDB connection modules log connection status:

- **[`lib/mongodb.ts`](lib/mongodb.ts)** - Shared MongoDB connection
- **[`backend/lib/database/mongodb.ts`](backend/lib/database/mongodb.ts)** - Backend MongoDB connection

Both files log:
- Connection initialization
- Connection success/failure
- Database name establishment
- Cached connection usage

### Health Check Endpoints

Two health check endpoints are available:

#### Main Health Check
- **URL**: `http://localhost:3000/api/health`
- **Method**: GET
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
- **URL**: `http://localhost:3000/backend/api/health`
- **Method**: GET

## Available Commands

### Start the Application
```bash
pnpm run dev
```
This starts the Next.js development server with all logging enabled.

### Check Service Status
```bash
pnpm run status
```
This runs the service status checker script which checks all services.

## Expected Output

### Development Server Startup
When you run `pnpm run dev`, you should see:
```
○ Compiling / ...
✓ Compiled / in Xs
GET / 200 in Xms
```

### Database Connection
```
[Database] Using cached MongoDB connection
```

### API Requests
Successful API calls are logged:
```
GET /api/admin/auth/check 200 in XXms
POST /api/admin/auth 200 in XXms
```

## Log Format

### Database Logs
```
[Database] <message>
```

Examples:
- `[Database] Using cached MongoDB connection`
- `[Database] MongoDB connected successfully`

### API Logs
```
<Method> /api/<route> <status> in <time>
```

Examples:
- `GET /api/health 200 in 15ms`
- `POST /api/bookings 200 in 245ms`

## Files Involved

- [`lib/mongodb.ts`](lib/mongodb.ts) - MongoDB connection with logging
- [`backend/lib/database/mongodb.ts`](backend/lib/database/mongodb.ts) - Backend database connection
- [`app/api/health/route.ts`](app/api/health/route.ts) - Health check endpoint
- [`backend/api/health/route.ts`](backend/api/health/route.ts) - Backend health check
- [`lib/startup-logger.ts`](lib/startup-logger.ts) - Logging utilities
- [`lib/startup-banner.ts`](lib/startup-banner.ts) - Startup banner
- [`scripts/check-services.sh`](scripts/check-services.sh) - Service checker script
- [`package.json`](package.json) - Scripts configuration

## Troubleshooting

### Services Not Running

1. Ensure MongoDB is installed and running
2. Check that `.env.local` contains the correct `MONGODB_URI`
3. Run `pnpm run status` to see which services are failing
4. Check terminal logs for error messages

### Database Connection Issues

- Verify MongoDB is running: `mongod` or check MongoDB service
- Check MongoDB URI format: `mongodb+srv://username:password@host/dbname`
- Ensure network connectivity to MongoDB Atlas (if using cloud)

### API Returns 404

- Ensure development server is running
- Check API route file exists at correct path
- Verify route handler exports correct method (GET, POST, etc.)

### API Returns 500

- Check server logs for error details
- Verify environment variables are set
- Ensure database connection is successful
