const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testConnection() {
  console.log('--- SMTP TEST SCRIPT ---');
  console.log(`Email: ${process.env.SMTP_EMAIL}`);
  console.log(`Password: ${process.env.SMTP_PASSWORD ? '****' + process.env.SMTP_PASSWORD.slice(-4) : 'MISSING'}`);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    console.log('Testing connection...');
    await transporter.verify();
    console.log('✅ SUCCESS: Connection verified!');
  } catch (error) {
    console.error('❌ FAILURE: Connection failed');
    console.error(error);
  }
}

testConnection();
