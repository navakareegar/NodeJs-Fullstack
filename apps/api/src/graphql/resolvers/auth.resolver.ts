import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../../auth/auth.service';
import { SessionService } from '../../auth/session.service';
import { LoginInput } from '../inputs';
import { LoginResponseType, LogoutResponseType, UserType } from '../types';
import { GqlAuthGuard } from '../guards';
import { CurrentUser } from '../decorators';

const SESSION_COOKIE_NAME = 'session_id';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Login mutation
   * Creates a session and sets HTTP-only cookie
   */
  @Mutation(() => LoginResponseType)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { req: Request; res: Response },
  ): Promise<LoginResponseType> {
    const { sessionId, expiresAt, user, allPermissions } =
      await this.authService.login({
        username: input.username,
        password: input.password,
      });

    // Set HTTP-only cookie with session ID
    context.res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        permissions: user.permissions,
      },
      allPermissions,
      expiresAt,
    };
  }

  /**
   * Logout mutation
   * Destroys the session and clears the cookie
   */
  @Mutation(() => LogoutResponseType)
  async logout(
    @Context() context: { req: Request; res: Response },
  ): Promise<LogoutResponseType> {
    const sessionId = context.req.cookies?.[SESSION_COOKIE_NAME];

    if (sessionId) {
      await this.sessionService.destroySession(sessionId);
    }

    // Clear the HTTP-only cookie
    context.res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logout successful' };
  }

  /**
   * whoAmI query
   * Returns the currently authenticated user with their permissions
   */
  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUser() user: any): Promise<UserType> {
    return {
      id: user.id,
      username: user.username,
      permissions: user.permissions.map((up: any) => up.permission.name),
    };
  }
}
