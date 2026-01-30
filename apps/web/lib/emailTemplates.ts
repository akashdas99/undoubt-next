export function getPasswordResetEmailHtml(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h1 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
            Reset Your Password
          </h1>

          <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.5;">
            You requested to reset your password. Click the button below to create a new password.
          </p>

          <div style="margin: 30px 0;">
            <a href="${resetLink}"
               style="display: inline-block; background-color: #18181b; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <p style="margin: 20px 0 10px; color: #71717a; font-size: 14px; line-height: 1.5;">
            Or copy and paste this link into your browser:
          </p>

          <p style="margin: 0 0 20px; color: #3b82f6; font-size: 14px; word-break: break-all;">
            ${resetLink}
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e7;">
            <p style="margin: 0 0 10px; color: #71717a; font-size: 14px; line-height: 1.5;">
              This link will expire in 5 minutes for security reasons.
            </p>

            <p style="margin: 0; color: #71717a; font-size: 14px; line-height: 1.5;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
            © ${new Date().getFullYear()} Undoubt. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetSubject(): string {
  return "Reset Your Password - Undoubt";
}
