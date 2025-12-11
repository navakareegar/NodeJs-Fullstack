import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

// Session lifetime in milliseconds (24 hours)
const SESSION_LIFETIME_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new session for a user
   */
  async createSession(
    userId: number,
  ): Promise<{ sessionId: string; expiresAt: Date }> {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId,
        expiresAt,
      },
    });

    return { sessionId, expiresAt };
  }

  /**
   * Validate a session and return the associated user
   */
  async validateSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      await this.destroySession(sessionId);
      return null;
    }

    return session.user;
  }

  /**
   * Destroy a session (logout)
   */
  async destroySession(sessionId: string): Promise<void> {
    await this.prisma.session
      .delete({
        where: { id: sessionId },
      })
      .catch(() => {
        // Session might already be deleted, ignore error
      });
  }

  /**
   * Destroy all sessions for a user (logout from all devices)
   */
  async destroyAllUserSessions(userId: number): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Clean up expired sessions (can be called periodically)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }

  /**
   * Get session lifetime for cookie expiration
   */
  getSessionLifetimeMs(): number {
    return SESSION_LIFETIME_MS;
  }
}
