const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const { generateOrderReceiptEmailHtml } = require('./src/lib/orderEmailTemplate');
const { logoAttachment } = require('./src/lib/logo');

async function testEmail() {
  console.log('Testing SMTP configuration to rabbihasan151537@gmail.com ...');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
  });

  const emailHtml = generateOrderReceiptEmailHtml({
    orderId: '8f1361f1-c68e-41a0-aa12-af7b827b8b4a',
    customerName: 'Rabbi Hasan',
    customerEmail: 'rabbihasan151537@gmail.com',
    customerPhone: '+8801992151537',
    amountPaid: 4748.66,
    currency: 'USD',
    deliveryMethod: 'ship',
    shippingName: 'Rabbi Hasan',
    shippingAddress: '248 Elizabeth Street',
    shippingCity: 'Bogura',
    shippingState: 'NY',
    shippingZip: '10100',
    shippingCountry: 'US',
    subtotal: 4748.66,
    products: [
      {
        title: 'Walk-in Cooler No Floor',
        brand: 'ICEMANZ',
        quantity: 1,
        price: 4748.66,
        category: 'Walk-in Cooler & Freezer',
      }
    ]
  });

  try {
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully!');

    const info = await transporter.sendMail({
      from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME}>`,
      to: 'rabbihasan151537@gmail.com',
      subject: 'Order Confirmation & Payment Receipt - Order #8f1361f1',
      html: emailHtml,
      attachments: [logoAttachment]
    });

    console.log('✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('✗ Error occurred:', error);
  }
}

testEmail();
