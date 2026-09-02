import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail(to: string, customerName: string, orderId: string, details?: any, pdfBuffer?: Buffer) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'test@example.com',
      pass: process.env.SMTP_PASSWORD || 'password',
    },
  });

  const productsHtml = details?.products?.map((p: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.name} ${p.sku ? `(SKU: ${p.sku})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${p.quantity || 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${p.price}</td>
    </tr>
  `).join('') || '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb; text-align: center;">Thank you for your order!</h2>
      <p>Hi <strong>${customerName}</strong>,</p>
      <p>Your order has been successfully placed and is pending payment. 🎉</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
        ${details?.invoiceNumber ? `<p style="margin: 5px 0;"><strong>Invoice No:</strong> ${details.invoiceNumber}</p>` : ''}
        <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="color: #2563eb; font-weight: bold;">$${details?.totalAmount || 0}</span></p>
      </div>
      
      <h3 style="color: #333; margin-top: 30px;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>

      ${details?.paymentLink ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${details.paymentLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Pay Invoice Securely</a>
      </div>
      ` : ''}

      <p>We'll process your order once the payment is completed.</p>
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
    const mailOptions: any = {
      from: process.env.SMTP_FROM || 'no-reply@icemanz.com',
      to,
      subject: `Order Confirmation - ${orderId}`,
      text,
      html,
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Invoice_${orderId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
