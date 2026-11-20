import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, SignJWT } from 'jose';
import { MIN_SECRET_LENGTH } from '@workspace/constants';
import { ACCESS_TTL } from '@/lib/constants.js';

export type AccessToken = {
  accessToken: string;
};

@Injectable()
export class TokensService {
  constructor(private readonly config: ConfigService) {}

  private jwtKey() {
    const secret = this.config.getOrThrow<string>('SECRET');
    if (secret.length < MIN_SECRET_LENGTH) {
      throw new Error(
        `SECRET must be at least ${MIN_SECRET_LENGTH} characters`,
      );
    }
    return new TextEncoder().encode(secret);
  }

  async signAccessToken(payload: { id: string; userName: string }) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TTL)
      .sign(this.jwtKey());
  }

  async issueAccessToken(user: {
    id: string;
    userName: string;
  }): Promise<AccessToken> {
    const accessToken = await this.signAccessToken({
      id: user.id,
      userName: user.userName,
    });
    return { accessToken };
  }

  async verifyAccessToken(
    token: string,
  ): Promise<{ id: string; userName: string } | null> {
    try {
      const { payload } = await jwtVerify(token, this.jwtKey());
      if (
        typeof payload.id !== 'string' ||
        typeof payload.userName !== 'string'
      ) {
        return null;
      }
      return { id: payload.id, userName: payload.userName };
    } catch {
      return null;
    }
  }
}
