import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(
    payload: JwtPayload,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
