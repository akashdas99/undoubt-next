import { timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CLIENT_IP_HEADER, PROXY_SECRET_HEADER } from '@workspace/constants';

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function secretMatches(provided: string | undefined): boolean {
  const expected = process.env.PROXY_SECRET;
  if (!expected || !provided) {
    return false;
  }
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

@Injectable()
export class ProxyThrottlerGuard extends ThrottlerGuard {
  protected override getTracker(req: Record<string, any>): Promise<string> {
    const headers = req.headers as Record<
      string,
      string | string[] | undefined
    >;
    const clientIp = headerValue(headers[CLIENT_IP_HEADER])?.trim();
    if (clientIp && secretMatches(headerValue(headers[PROXY_SECRET_HEADER]))) {
      return Promise.resolve(clientIp);
    }
    return Promise.resolve(req.ip as string);
  }
}
