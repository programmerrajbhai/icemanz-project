import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { buildOrderEmailAttachments, generateOrderReceiptEmailHtml, generateOrderReceiptEmailText } from './src/lib/orderEmailTemplate';

dotenv.config();

async function testEmail() {
  console.log('Sending test order receipt email with embedded logo & product image to rabbihasan151537@gmail.com ...');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
  });

  const sampleProducts = [
    {
      title: 'Astra 5 x 6 Walk-In Cooler No Floor CNF5X6',
      brand: 'ICEMANZ',
      quantity: 1,
      price: 3169.00,
      category: 'walk-in-cooler-freezer',
      image: '/Walk-in-Cooler-Freezer/NewCooler.jpg'
    }
  ];

  const emailParams = {
    orderId: '60bb82f6-90c0-4665-930f-a973120d508b',
    customerName: 'Rabbi Hasan',
    customerEmail: 'rabbihasan151537@gmail.com',
    customerPhone: '+8801992151537',
    amountPaid: 4460.83,
    currency: 'USD',
    deliveryMethod: 'ship',
    shippingName: 'Rabbi Hasan',
    shippingAddress: '248 Elizabeth Street',
    shippingCity: 'Bogura',
    shippingState: 'NY',
    shippingZip: '10100',
    shippingCountry: 'US',
    subtotal: 4460.83,
    products: sampleProducts
  };

  const { attachments, imageCidMap } = buildOrderEmailAttachments(sampleProducts);
  const emailHtml = generateOrderReceiptEmailHtml(emailParams, imageCidMap);
  const emailText = generateOrderReceiptEmailText(emailParams);

  console.log('Attachments to be sent:', attachments);

  try {
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully!');

    const info = await transporter.sendMail({
      from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME}>`,
      to: 'rabbihasan151537@gmail.com',
      subject: 'ICEMANZ Order Summary - #60bb82f6',
      text: emailText,
      html: emailHtml,
      attachments
    });

    console.log('✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('✗ Error occurred:', error);
  }
}

testEmail();
