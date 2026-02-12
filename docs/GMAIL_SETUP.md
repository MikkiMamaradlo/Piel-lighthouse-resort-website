# Gmail SMTP Setup for Booking Emails

## Overview

The booking system sends confirmation emails to guests when they submit booking requests using Nodemailer with Gmail SMTP.

## Setup Steps

### 1. Create `.env.local` file

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Or on Windows:
```powershell
copy .env.local.example .env.local
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

Replace the placeholder with your App Password:

```env
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 4. Restart the development server

```bash
pnpm run dev
```

## Configuration

The email configuration is set up in [`lib/email.ts`](lib/email.ts):

```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL || 'trixtech011@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
```

## Testing

1. Fill out the booking form on the website (home page)
2. Click "Submit Booking Request"
3. Check the guest's email for the confirmation email
4. Check server logs for email sending status

## Troubleshooting

### "Invalid login" error

- Make sure you enabled 2-Step Verification on your Google account
- Use an App Password, not your regular Gmail password
- Ensure the App Password is copied correctly (no spaces or with spaces as per format)

### "Connection timeout" error

- Check your firewall/network settings
- Gmail SMTP uses port 587 (TLS)
- Try using `host: 'smtp.gmail.com', port: 587`

### Emails not sending

- Check server logs for error messages
- Verify environment variables are loaded correctly
- Ensure the Gmail account has less secure apps access enabled (or use App Password)
- Check spam folder for test emails

### App Password Not Working

1. Disable and re-enable 2-Step Verification
2. Generate a new App Password
3. Make sure to copy the password immediately (can't view again)

## Alternative Email Providers

If you prefer not to use Gmail, you can configure other SMTP providers:

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_app_password
```

### Custom SMTP (e.g., SendGrid, Mailgun)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

## Files Involved

- [`lib/email.ts`](../lib/email.ts) - Email sending configuration
- [`app/api/bookings/route.ts`](../app/api/bookings/route.ts) - Booking API that sends emails
- [`.env.local`](../.env.local) - Environment variables
- [`.env.local.example`](../.env.local.example) - Environment template
