import { Injectable } from '@nestjs/common';
import { SignJWT } from 'jose';

const ACCESS_TTL = '15m';

export type AccessToken = {
  accessToken: string;
};

@Injectable()
export class TokensService {
  private jwtKey() {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error('SECRET is not set');
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
}
