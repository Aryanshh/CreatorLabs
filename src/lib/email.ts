import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify?token=${token}`;

  const mailOptions = {
    from: '"Creator Labs" <noreply@creatorlabs.com>',
    to: email,
    subject: 'Verify your Creator Labs account',
    html: `
      <div style="font-family: 'Outfit', sans-serif; padding: 40px; background-color: #FDFCF8; color: #292524;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 32px; border: 1px solid #F5F5F4; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);">
          <div style="width: 48px; height: 48px; background: #FFB7B2; border-radius: 12px; margin-bottom: 24px;"></div>
          <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome to the lab.</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #78716C; margin-bottom: 32px;">
            To start mastering the algorithm, please verify your email address by clicking the button below.
          </p>
          <a href="${verificationUrl}" style="display: inline-block; background: #292524; color: white; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 14px;">
            Verify My Account
          </a>
          <p style="margin-top: 32px; font-size: 13px; color: #A8A29E;">
            If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
