const express = require('express');
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
require('dotenv').config();

const app = express();
app.use(express.json());

console.log("Initializing Firebase Admin SDK...");
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log("Transporter created.");

async function sendSubscriptionEmail(userData) {
  console.log(`Preparing to send email to ${userData.email}...`);
  
  const subscriptionEndDate = userData.subscriptionEndDate.toDate().toLocaleDateString();
  const lastPaymentDate = userData.lastPaymentDate.toDate().toLocaleDateString();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userData.email,
    subject: "Your BusinessPaysell Subscription Update",
    html: `
      <h1>Your BusinessPaysell Subscription Update</h1>
      <p>Hello ${userData.name},</p>
      <p>Your BusinessPaysell subscription has been renewed. Here are your updated subscription details:</p>
      <ul>
        <li>Subscription End Date: ${subscriptionEndDate}</li>
        <li>Last Payment Amount: ₹${userData.lastPaymentAmount}</li>
        <li>Last Payment Date: ${lastPaymentDate}</li>
        <li>Last Payment Method: ${userData.lastPaymentMethod}</li>
      </ul>
      <p>Company Name: ${userData.companyName}</p>
      <p>GST Number: ${userData.gstNumber}</p>
      <p>Thank you for continuing to use BusinessPaysell for your business needs. If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The BusinessPaysell Team</p>
    `
  };

  try {
    console.log(`Sending email to ${userData.email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${userData.email}:`, info.messageId);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${userData.email}:`, error);
    return false;
  }
}

fetch('https://cosmicsparks.tech/send-subscription-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userId: 'the-user-id' }),
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});