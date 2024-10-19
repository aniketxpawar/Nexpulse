import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like 'SendGrid' or 'Mailgun'
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

function sendEmail(recipient: string, subject: string, body: string) {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: recipient,
        subject,
        text: body,
      });
}

export {sendEmail}