import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import * as jwksRsa from 'jwks-rsa';
import { RequestUser } from '../types/request-user.type';
import { AppConfig } from '../configs/app.config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { promisify } from 'util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwksClient: jwksRsa.JwksClient;

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly appConfig: AppConfig,
  ) {
    this.jwksClient = new jwksRsa.JwksClient({
      jwksUri: this.appConfig.jwksUri,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    console.log('token', token);
    console.log('dbConfig jwks uri', this.appConfig.jwksUri);

    try {
      const decodedToken = this.jwtService.decode(token, {
        complete: true,
      }) as { header: { kid: string }; payload: JwtPayload };

      const kid = decodedToken.header.kid;

      const getSigningKey = promisify(
        this.jwksClient.getSigningKey.bind(this.jwksClient),
      );
      const key = await getSigningKey(kid);
      const signingKey = key.publicKey || key.rsaPublicKey;

      const verifiedToken = this.jwtService.verify<JwtPayload>(token, {
        secret: signingKey,
      });
      if (verifiedToken.iss !== this.appConfig.requestOrigin) {
        throw new UnauthorizedException('Invalid token issuer');
      }
      const currentTime = Math.floor(Date.now() / 1000);
      if (verifiedToken.exp < currentTime) {
        throw new UnauthorizedException('Token has expired');
      }
      request.user = {
        sub: verifiedToken.sub,
        org_code: verifiedToken.org_code,
        permissions: verifiedToken.permissions,
      } as RequestUser;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
