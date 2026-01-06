# Piel Lighthouse Beach Resort - Project Structure

## Overview
Clean separation of frontend and backend concerns for maintainability and scalability.

## Directory Structure

\`\`\`
project/
├── frontend/                          # Next.js Frontend Application
│   ├── app/
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Global styles
│   │   └── api/                      # Note: API routes now in backend/
│   ├── components/
│   │   ├── sections/                 # Page sections (Hero, Contact, etc.)
│   │   ├── ui/                       # shadcn/ui components
│   │   └── theme-provider.tsx        # Theme setup
│   ├── hooks/                        # React hooks
│   ├── public/                       # Static assets and images
│   └── styles/                       # Additional stylesheets
│
├── backend/                          # Backend Services & APIs
│   ├── api/
│   │   ├── bookings/
│   │   │   └── route.ts             # Booking CRUD endpoints
│   │   └── health/
│   │       └── route.ts             # Health check endpoint
│   └── lib/
│       ├── database/
│       │   └── mongodb.ts           # MongoDB connection
│       └── schemas/
│           └── booking.ts           # Booking TypeScript interface
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.mjs                   # Next.js config
└── PROJECT_STRUCTURE.md             # This file
\`\`\`

## Key Directories

### Frontend (`/frontend`)
- **app/**: Next.js app router configuration
- **components/**: Reusable React components organized by feature
- **hooks/**: Custom React hooks for state management
- **public/**: Static assets (images, icons, etc.)
- **styles/**: Global and component-specific styles

### Backend (`/backend`)
- **api/**: Route handlers for REST endpoints
- **lib/database/**: Database connection and pooling
- **lib/schemas/**: TypeScript interfaces and types

## API Endpoints

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Fetch bookings (with optional status filter)

### Health
- `GET /api/health` - Check database connectivity

## Environment Variables Required

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
\`\`\`

## Architecture Notes

- **Separation of Concerns**: Frontend logic isolated from backend services
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Scalability**: Easy to expand backend with new modules
- **Maintainability**: Clear folder organization for team collaboration
