import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GqlAuthGuard, PermissionGuard } from '../guards';
import { RequirePermissions } from '../decorators';
import { PermissionResultType } from '../types';

@Resolver()
export class PermissionResolver {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all permissions defined in the system
   */
  @Query(() => [String])
  async permissions(): Promise<string[]> {
    const allPermissions = await this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });
    return allPermissions.map((p) => p.name);
  }

  /**
   * createUser - requires CREATE_USER permission
   */
  @Mutation(() => PermissionResultType)
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @RequirePermissions('CREATE_USER')
  async createUser(): Promise<PermissionResultType> {
    return { result: 'OK' };
  }

  /**
   * readUser - requires READ_USER permission
   */
  @Query(() => PermissionResultType)
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @RequirePermissions('READ_USER')
  async readUser(): Promise<PermissionResultType> {
    return { result: 'OK' };
  }

  /**
   * updateUser - requires UPDATE_USER permission
   */
  @Mutation(() => PermissionResultType)
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @RequirePermissions('UPDATE_USER')
  async updateUser(): Promise<PermissionResultType> {
    return { result: 'OK' };
  }

  /**
   * deleteUser - requires DELETE_USER permission
   */
  @Mutation(() => PermissionResultType)
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @RequirePermissions('DELETE_USER')
  async deleteUser(): Promise<PermissionResultType> {
    return { result: 'OK' };
  }
}

