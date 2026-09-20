import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordReset(to: string, resetLink: string) {
    const { error } = await this.resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: 'Reset your password',
      html: `<p><a href="${resetLink}">Reset password</a></p><p>This link expires in 5 minutes.</p>`,
    });
    if (error) {
      throw new Error('Failed to send email');
    }
  }
}
