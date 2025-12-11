import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard, SESSION_COOKIE_NAME } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint
   * POST /auth/login
   * Body: { username: string, password: string }
   *
   * Returns:
   * - user: { id, username }
   * - allPermissions: all permissions defined in the system
   * - expiresAt: session expiration time
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { sessionId, expiresAt, user, allPermissions } =
      await this.authService.login(loginDto);

    // Set HTTP-only cookie with session ID
    response.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true, // Requires HTTPS
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return {
      message: 'Login successful',
      user,
      allPermissions,
      expiresAt,
    };
  }

  /**
   * Logout endpoint
   * POST /auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.cookies?.[SESSION_COOKIE_NAME];

    if (sessionId) {
      await this.authService.logout(sessionId);
    }

    // Clear the HTTP-only cookie
    response.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logout successful' };
  }

  /**
   * Get current user info (protected route example)
   * GET /auth/me
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Req() request: Request) {
    const user = (request as any).user;

    return {
      id: user.id,
      username: user.username,
      permissions: user.permissions.map((up: any) => up.permission.name),
    };
  }
}
