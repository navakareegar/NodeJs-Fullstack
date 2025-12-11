import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SessionService } from '../../auth/session.service';

const SESSION_COOKIE_NAME = 'session_id';

/**
 * Guard for GraphQL resolvers that require authentication
 */
@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const sessionId = request.cookies?.[SESSION_COOKIE_NAME];

    if (!sessionId) {
      throw new UnauthorizedException('No session found');
    }

    const user = await this.sessionService.validateSession(sessionId);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Attach user to request for use in resolvers
    request.user = user;

    return true;
  }
}
