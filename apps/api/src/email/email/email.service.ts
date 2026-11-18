import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.getOrThrow<string>('RESEND_API_KEY');
    const from = this.config.getOrThrow<string>('EMAIL_FROM');
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
