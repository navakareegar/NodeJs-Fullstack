import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from './session.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 12;

export interface LoginResponse {
  sessionId: string;
  expiresAt: Date;
  user: {
    id: number;
    username: string;
    /** Permissions assigned to the logged-in user */
    permissions: string[];
  };
  /** All permissions available in the system */
  allPermissions: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Validate user credentials and create a session
   * Returns session info, user info, all system permissions, and user's permissions
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { username, password } = loginDto;

    // Find user by username with their permissions
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Create session
    const { sessionId, expiresAt } = await this.sessionService.createSession(
      user.id,
    );

    // Fetch all permissions available in the system
    const allPermissionsData = await this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });

    // Extract permission names
    const allPermissions = allPermissionsData.map((p) => p.name);
    const userPermissions = user.permissions.map((up) => up.permission.name);

    return {
      sessionId,
      expiresAt,
      user: {
        id: user.id,
        username: user.username,
        permissions: userPermissions,
      },
      allPermissions,
    };
  }

  /**
   * Logout user by destroying their session
   */
  async logout(sessionId: string): Promise<void> {
    await this.sessionService.destroySession(sessionId);
  }

  /**
   * Hash a password (for user registration)
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Get session lifetime for cookie configuration
   */
  getSessionLifetimeMs(): number {
    return this.sessionService.getSessionLifetimeMs();
  }
}
