declare module "nodemailer" {
  export interface Transporter {
    sendMail(mailOptions: any): Promise<any>
  }

  export interface TransportOptions {
    service: string
    auth: {
      user: string
      pass: string
    }
  }

  export function createTransport(options: TransportOptions): Transporter
}
