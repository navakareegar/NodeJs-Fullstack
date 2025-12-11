import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionService } from './session.service';

export const SESSION_COOKIE_NAME = 'session_id';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionId = request.cookies?.[SESSION_COOKIE_NAME];

    if (!sessionId) {
      throw new UnauthorizedException('No session found');
    }

    const user = await this.sessionService.validateSession(sessionId);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Attach user to request for use in route handlers
    (request as any).user = user;

    return true;
  }
}
