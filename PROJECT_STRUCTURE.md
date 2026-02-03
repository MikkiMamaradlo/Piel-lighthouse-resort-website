# Piel Lighthouse Resort - Project Structure

## Overview

A full-stack resort management website with public-facing pages, admin panel, and staff portal. Built with Next.js 14 App Router, MongoDB, and TypeScript.

## Directory Structure

```
Piel-lighthouse-resort-website/
├── app/                              # Next.js App Router (v14)
│   ├── api/                          # API Routes
│   │   ├── admin/                    # Admin API endpoints
│   │   │   ├── auth/                 # Admin authentication
│   │   │   │   ├── route.ts          # Login/logout
│   │   │   │   └── check/            # Session verification
│   │   │   ├── bookings/             # Booking management
│   │   │   ├── gallery/              # Gallery management
│   │   │   ├── rooms/                # Room management
│   │   │   ├── staff/                # Staff management
│   │   │   └── testimonials/         # Testimonial management
│   │   ├── bookings/                 # Public booking API
│   │   ├── health/                   # Health check endpoint
│   │   └── staff/                    # Staff API endpoints
│   │       ├── auth/                 # Staff authentication
│   │       │   ├── route.ts          # Login/logout
│   │       │   └── check/            # Session verification
│   │       ├── attendance/           # Attendance tracking
│   │       └── register/             # Staff registration
│   │
│   ├── admin/                        # Admin Panel
│   │   ├── layout.tsx               # Admin layout with sidebar
│   │   ├── page.tsx                 # Admin dashboard
│   │   ├── accommodations/           # Accommodations management
│   │   ├── activities/               # Activities management
│   │   ├── bookings/                 # Bookings management
│   │   ├── gallery/                  # Gallery management
│   │   ├── login/                    # Admin login page
│   │   ├── settings/                 # System settings
│   │   ├── staff/                    # Staff management
│   │   └── testimonials/             # Testimonials management
│   │
│   ├── staff/                        # Staff Portal
│   │   ├── layout.tsx               # Staff layout with navigation
│   │   ├── page.tsx                 # Staff dashboard
│   │   ├── attendance/               # Attendance tracking
│   │   ├── bookings/                 # View bookings
│   │   ├── guests/                   # Guest information
│   │   ├── login/                    # Staff login
│   │   ├── register/                 # Staff registration
│   │   └── rooms/                    # Room status
│   │
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page (public)
│
├── backend/                          # Backend utilities
│   ├── api/                         # Additional API routes
│   │   ├── bookings/                # Booking handlers
│   │   └── health/                  # Health check
│   └── lib/                         # Backend libraries
│       ├── database/
│       │   └── mongodb.ts           # MongoDB connection
│       └── schemas/
│           ├── admin.ts             # Admin schema
│           ├── booking.ts           # Booking schema
│           └── staff.ts             # Staff schema
│
├── components/                      # React Components
│   ├── room-details-modal.tsx      # Room details modal
│   ├── theme-provider.tsx          # Theme provider
│   ├── sections/                   # Page sections
│   │   ├── accommodations.tsx      # Accommodations section
│   │   ├── activities.tsx          # Activities section
│   │   ├── amenities.tsx           # Amenities section
│   │   ├── back-to-top.tsx         # Back to top button
│   │   ├── contact.tsx             # Contact section
│   │   ├── cta.tsx                 # Call to action
│   │   ├── experiences.tsx         # Experiences section
│   │   ├── footer.tsx              # Footer
│   │   ├── gallery.tsx             # Gallery section
│   │   ├── hero.tsx                # Hero section
│   │   ├── navigation.tsx          # Navigation
│   │   └── testimonials.tsx        # Testimonials section
│   └── ui/                          # UI Components
│       ├── button.tsx              # Button component
│       ├── card.tsx                # Card component
│       └── toast.tsx               # Toast notifications
│
├── hooks/                           # Custom React hooks
│   └── use-toast.ts                # Toast hook
│
├── lib/                             # Utility libraries
│   ├── booking-schema.ts           # Booking validation
│   ├── email.ts                    # Email sending
│   ├── mongodb.ts                  # MongoDB connection (duplicate)
│   ├── startup-banner.ts           # Startup banner
│   ├── startup-logger.ts           # Logging utilities
│   └── utils.ts                    # Utility functions
│
├── public/                          # Static assets
│   ├── images/                     # Resort images
│   │   └── piel1.jpg - piel10.jpg
│   ├── apple-icon.png
│   ├── icon-dark-32x32.png
│   ├── icon-light-32x32.png
│   ├── icon.svg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
│
├── styles/                          # Additional styles
│   └── globals.css
│
├── types/                           # TypeScript types
│   └── nodemailer.d.ts             # Nodemailer types
│
├── scripts/                         # Utility scripts
│   └── check-services.sh           # Service checker
│
├── .env.local                      # Environment variables
├── .env.local.example              # Environment template
├── .gitignore
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Dependencies
├── pnpm-lock.yaml                  # Lock file
├── tsconfig.json                   # TypeScript config
├── README.md                       # Project readme
├── PROJECT_STRUCTURE.md            # This file
├── GMAIL_SETUP.md                  # Gmail setup guide
└── STARTUP_LOGGING.md              # Logging documentation
```

## Key Features

### Authentication System
- **Admin Auth**: Separate admin authentication with session management
- **Staff Auth**: Staff portal with login/register functionality
- **JWT Tokens**: Secure token-based authentication

### Database Schemas
- **Admin**: Admin user accounts with hashed passwords
- **Staff**: Staff records with personal information
- **Bookings**: Booking requests with guest details

### UI/UX
- **Dark/Light Theme**: Theme switching support
- **Responsive Design**: Mobile-first approach
- **Toast Notifications**: User feedback system
- **Modal Dialogs**: Room details and confirmations

## API Endpoints

### Admin API (`/api/admin`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/auth` | POST | Admin login |
| `/api/admin/auth/check` | GET | Verify admin session |
| `/api/admin/auth` | DELETE | Admin logout |
| `/api/admin/bookings` | GET/POST | Manage bookings |
| `/api/admin/rooms` | GET/POST | Manage rooms |
| `/api/admin/gallery` | GET/POST | Manage gallery |
| `/api/admin/testimonials` | GET/POST | Manage testimonials |
| `/api/admin/staff` | GET/POST | Manage staff |

### Staff API (`/api/staff`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/staff/register` | POST | Staff registration |
| `/api/staff/auth` | POST | Staff login |
| `/api/staff/auth/check` | GET | Verify staff session |
| `/api/staff/auth` | DELETE | Staff logout |
| `/api/staff/attendance` | GET/POST | Manage attendance |

### Public API (`/api`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookings` | POST | Submit booking request |
| `/api/health` | GET | Health check |

## Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/piel_lighthouse_resort

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email (Gmail SMTP)
GMAIL_APP_PASSWORD=your_gmail_app_password

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Development

### Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start
```

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Email**: Nodemailer
- **Package Manager**: pnpm
