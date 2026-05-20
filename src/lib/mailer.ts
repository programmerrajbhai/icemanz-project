import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail(to: string, customerName: string, orderId: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'test@example.com',
      pass: process.env.SMTP_PASSWORD || 'password',
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb; text-align: center;">Thank you for your purchase!</h2>
      <p>Hi ${customerName},</p>
      <p>Your order has been successfully processed! 🎉</p>
      <p>Order ID: <strong>${orderId}</strong></p>
      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for shopping with ICEMANZ!</p>
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
      <p style="text-align: center; color: #888; font-size: 12px;">
        ICEMANZ, 123 Main St, Suite 100, New York, NY 10001
      </p>
    </div>
  `;

  const text = `
    Thank you for your purchase!\n
    Hi ${customerName},\n
    Your order has been successfully processed! 🎉\n
    Order ID: ${orderId}\n
    We'll send you another email when your order ships.\n
    Thank you for shopping with ICEMANZ!
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@icemanz.com',
      to,
      subject: `Order Confirmation - ${orderId}`,
      text,
      html,
    });

    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
