const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

async function testEmail() {
  console.log('Testing SMTP configuration...');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
  console.log('SMTP_FROM:', process.env.SMTP_FROM);
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
  console.log('---');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully!\n');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
      to: process.env.SMTP_USERNAME || process.env.SMTP_USER,
      subject: 'Test Email - ICEMANZ Invoice System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h1 style="color: #004a99;">Test Email</h1>
          <p>This is a test email from the ICEMANZ invoice request system.</p>
          <p>If you received this, your SMTP configuration is working correctly!</p>
        </div>
      `,
    });

    console.log('✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox:', process.env.SMTP_USERNAME || process.env.SMTP_USER);
  } catch (error) {
    console.error('✗ Error occurred:');
    console.error('Message:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.response) console.error('Response:', error.response);
    if (error.command) console.error('Command:', error.command);
  }
}

testEmail();
