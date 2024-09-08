const nodemailer = require('nodemailer');

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'agroinvest101@gmail.com',
    pass: 'argjnsfueavsakqx'
  }
});

// Define the carrier gateway and recipient
const carrierGateway = "txt.att.net"; // Example for AT&T; change this based on the carrier
const phoneNumber = "7304845150";
const recipient = `${phoneNumber}@${carrierGateway}`;

// Email options
const mailOptions = {
  from: 'agroinvest101@gmail.com',
  to: recipient,
  text: 'This is a test SMS message sent from Node.js!'
};

// Send the email (SMS)
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Error sending SMS:', error);
  } else {
    console.log('SMS sent successfully:', info.response);
  }
});
