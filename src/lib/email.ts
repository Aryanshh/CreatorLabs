import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  // If we don't have an API key, just log the link and skip
  console.log('Using Resend Key (First 4):', process.env.RESEND_API_KEY?.substring(0, 4));
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_key_here') {
    console.log('\n--------------------------------------------------');
    console.log('📧 EMAIL VERIFICATION LINK (Development Mode)');
    console.log(`To: ${email}`);
    console.log(`Link: ${verificationUrl}`);
    console.log('--------------------------------------------------\n');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Creator Labs <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your Creator Labs account',
      html: `
        <div style="font-family: 'Outfit', sans-serif; padding: 40px; background-color: #FDFCF8; color: #292524;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 32px; border: 1px solid #F5F5F4; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);">
            <div style="width: 48px; height: 48px; background: #FFB7B2; border-radius: 12px; margin-bottom: 24px;"></div>
            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome to the lab.</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #78716C; margin-bottom: 32px;">
              To start practicing your content strategy and mastering the algorithm, please verify your email address.
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
    });

    if (error) {
      console.error('Resend Error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent successfully:', data?.id);
  } catch (err) {
    console.error('Failed to send email:', err);
    // Log fallback link in case of API failure so the user isn't blocked
    console.log(`Fallback Verification Link: ${verificationUrl}`);
  }
}
export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  console.log('Using Resend Key (First 4):', process.env.RESEND_API_KEY?.substring(0, 4));

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_key_here') {
    console.log('\n--------------------------------------------------');
    console.log('🔑 PASSWORD RESET LINK (Development Mode)');
    console.log(`To: ${email}`);
    console.log(`Link: ${resetUrl}`);
    console.log('--------------------------------------------------\n');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Creator Labs <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset your Creator Labs password',
      html: `
        <div style="font-family: 'Outfit', sans-serif; padding: 40px; background-color: #FDFCF8; color: #292524;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 32px; border: 1px solid #F5F5F4; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);">
            <div style="width: 48px; height: 48px; background: #FFB7B2; border-radius: 12px; margin-bottom: 24px;"></div>
            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 16px;">Access recovery.</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #78716C; margin-bottom: 32px;">
              We received a request to reset your password. If this was you, click the button below to set a new one.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background: #292524; color: white; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 14px;">
              Reset Password
            </a>
            <p style="margin-top: 32px; font-size: 13px; color: #A8A29E;">
              This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (error) throw new Error(error.message);
    console.log('Reset email sent:', data?.id);
  } catch (err) {
    console.error('Failed to send reset email:', err);
    console.log(`Fallback Reset Link: ${resetUrl}`);
  }
}
