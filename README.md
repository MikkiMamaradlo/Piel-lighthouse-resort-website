# Piel Lighthouse Resort Website

A full-stack resort management website built with Next.js 14, MongoDB, and TypeScript.

## Features

### Frontend (Public)
- **Home Page** - Hero section, accommodations, amenities, activities, gallery, testimonials, contact
- **Booking System** - Online booking requests with email notifications
- **Responsive Design** - Mobile-friendly UI with dark/light theme support

### Admin Panel (`/admin`)
- **Dashboard** - Overview of system status
- **Accommodations** - Manage room types and descriptions
- **Activities** - Manage resort activities
- **Bookings** - View and manage booking requests
- **Gallery** - Manage resort images
- **Staff** - Manage admin staff accounts
- **Testimonials** - Manage customer reviews
- **Settings** - System configuration

### Staff Portal (`/staff`)
- **Dashboard** - Staff overview
- **Attendance** - Track daily attendance
- **Bookings** - View booking information
- **Guests** - Guest information management
- **Rooms** - Room status management
- **Authentication** - Login and registration system

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Custom UI with shadcn-inspired components
- **Authentication**: JWT-based auth for admin and staff
- **Email**: Nodemailer for booking notifications
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Piel-lighthouse-resort-website
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure `.env.local` with your MongoDB URI and other settings:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
GMAIL_APP_PASSWORD=your_app_password
JWT_SECRET=your_jwt_secret
```

5. Start the development server:
```bash
pnpm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin API endpoints
│   │   ├── bookings/            # Booking API
│   │   ├── health/              # Health check
│   │   └── staff/               # Staff API endpoints
│   ├── admin/                   # Admin panel pages
│   ├── staff/                   # Staff portal pages
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── backend/                     # Backend utilities
│   ├── api/                    # Additional API routes
│   └── lib/                    # Database and schemas
├── components/                  # React components
│   ├── sections/               # Page sections
│   └── ui/                     # UI components
├── lib/                        # Utility functions
├── public/                     # Static assets
└── types/                      # TypeScript types
```

## API Endpoints

### Admin
- `POST /api/admin/auth` - Admin login
- `GET /api/admin/auth/check` - Verify admin session
- `DELETE /api/admin/auth` - Admin logout
- `GET/POST /api/admin/bookings` - Manage bookings
- `GET/POST /api/admin/rooms` - Manage rooms
- `GET/POST /api/admin/gallery` - Manage gallery
- `GET/POST /api/admin/testimonials` - Manage testimonials
- `GET/POST /api/admin/staff` - Manage staff

### Staff
- `POST /api/staff/register` - Staff registration
- `POST /api/staff/auth` - Staff login
- `GET /api/staff/auth/check` - Verify staff session
- `DELETE /api/staff/auth` - Staff logout
- `GET/POST /api/staff/attendance` - Manage attendance

### Public
- `POST /api/bookings` - Submit booking request
- `GET /api/health` - Health check

## License

MIT
