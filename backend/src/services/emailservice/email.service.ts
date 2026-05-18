import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true для порта 465, false для 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Проверка подключения
transporter.verify((error, success) => {
  if (error) {
    console.error(' SMTP connection error:', error)
  } else {
    console.log(' SMTP ready to send emails')
  }
})

export class EmailService {
  static async sendTicketConfirmation(email: string, ticket: any, orderId: string) {
    console.log('📧 [EMAIL] Preparing to send ticket confirmation to:', email)
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">✈️ Ticket Confirmation</h1>
        <p>Your ticket has been successfully booked!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">Flight Details</h2>
          <p><strong>From:</strong> ${ticket.from.city} (${ticket.from.code})</p>
          <p><strong>To:</strong> ${ticket.to.city} (${ticket.to.code})</p>
          <p><strong>Date:</strong> ${new Date(ticket.departureTime).toLocaleString()}</p>
          <p><strong>Airline:</strong> ${ticket.airline}</p>
          <p><strong>Flight:</strong> ${ticket.flightNumber}</p>
          <p><strong>Price:</strong> ${ticket.price.toLocaleString()} ₽</p>
        </div>
        
        <div style="background-color: #dcfce7; padding: 20px; border-radius: 10px;">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p>Thank you for choosing SkyTracker!</p>
        </div>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `

    try {
      const info = await transporter.sendMail({
        from: `"SkyTracker" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: `✈️ Ticket Confirmation - ${orderId}`,
        html
      })
      
      console.log(' [EMAIL] Email sent successfully!')
      console.log(' [EMAIL] Message ID:', info.messageId)
      return info
    } catch (error) {
      console.error(' [EMAIL] Failed to send email:', error)
      throw error
    }
  }
}