import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    if (!from) {
      throw new Error('EMAIL_FROM is not set');
    }
    this.resend = new Resend(apiKey);
    this.from = from;
  }

  async sendPasswordReset(to: string, resetLink: string) {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Reset your password',
      html: `<p><a href="${resetLink}">Reset password</a></p><p>This link expires in 5 minutes.</p>`,
    });
    if (error) {
      this.logger.error('Resend API error', error);
      throw new Error('Failed to send email');
    }
  }
}
