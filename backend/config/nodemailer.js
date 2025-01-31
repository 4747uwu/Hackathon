import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Error sending email: ' + error.message);
  }
};

export { sendResetEmail };