# Gmail SMTP Setup for Booking Emails

## Overview
The booking system sends confirmation emails to `trixtech011@gmail.com` when guests submit booking requests.

## Setup Steps

### 1. Create `.env.local` file
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

### 2. Generate an App Password
You cannot use your regular Gmail password. You need an App Password:

1. Go to [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable it if not already)
3. After enabling 2-Step Verification, search for "App Passwords" or go to:
   https://myaccount.google.com/apppasswords
4. Create a new app password:
   - App name: "Piel Lighthouse Resort"
   - Click "Create"
5. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### 3. Update `.env.local`
Replace `your_app_password_here` with the App Password you generated:
```env
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 4. Restart the development server
```bash
npm run dev
```

## Testing
1. Fill out the booking form on the website
2. Click "Submit Booking Request"
3. Check `trixtech011@gmail.com` for the booking notification email

## Troubleshooting

### "Invalid login" error
- Make sure you enabled 2-Step Verification
- Use an App Password, not your regular password

### "Connection timeout" error
- Check your firewall/network settings
- Gmail SMTP uses port 587

### Emails not sending
- Check server logs for error messages
- Verify environment variables are loaded
