import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like 'SendGrid' or 'Mailgun'
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

function sendEmail(recipient: string, subject: string, body: string) {
    transporter.sendMail({
        from: 'your-email@gmail.com',
        to: recipient,
        subject,
        text: body,
      });
}

export {sendEmail}