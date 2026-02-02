// Email sender using Gmail SMTP
// Requires: npm install nodemailer @types/nodemailer
// Environment variables: GMAIL_EMAIL, GMAIL_APP_PASSWORD

interface BookingEmailData {
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  roomType: string
  message: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  // Demo mode - log email instead of sending
  if (process.env.DEMO_MODE === "true") {
    console.log("DEMO_MODE: Would send email to " + process.env.GMAIL_EMAIL)
    console.log("Booking details:", JSON.stringify(data, null, 2))
    return true
  }

  // Check for required env vars
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.error("GMAIL_EMAIL or GMAIL_APP_PASSWORD not set in environment variables")
    return false
  }

  // Dynamic import of nodemailer
  let nodemailer: any
  try {
    nodemailer = await import("nodemailer")
  } catch (e) {
    console.error("Nodemailer not installed. Please run: npm install nodemailer @types/nodemailer")
    return false
  }

  const {
    name,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    roomType,
    message,
  } = data

  // Create transporter
  const transporter = nodemailer.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: process.env.GMAIL_EMAIL,
    subject: `New Booking Request from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          New Booking Request
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold; width: 40%;">
              Guest Name:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${name}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">
              Email:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${email}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">
              Phone:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${phone || "Not provided"}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">
              Check-in Date:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${checkIn}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">
              Check-out Date:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${checkOut}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">
              Number of Guests:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${guests}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">
              Room Type:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${roomType}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; font-weight: bold; vertical-align: top;">
              Message:
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1;">
              ${message || "No message"}
            </td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0; color: #7f8c8d; font-size: 14px;">
            Please respond to this booking request as soon as possible.
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #95a5a6; font-size: 12px;">
          <p>This email was sent from the Lighthouse Resort booking system.</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Booking email sent successfully to " + process.env.GMAIL_EMAIL)
    return true
  } catch (error) {
    console.error("Failed to send booking email:", error)
    return false
  }
}
