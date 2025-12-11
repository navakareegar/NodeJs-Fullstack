import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  // Seed permissions
  const permissionNames = [
    'CREATE_USER',
    'READ_USER',
    'UPDATE_USER',
    'DELETE_USER',
  ];

  console.log('Seeding permissions...');
  const permissions: { id: number; name: string }[] = [];

  for (const name of permissionNames) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    permissions.push(permission);
  }

  console.log(`✅ Created ${permissions.length} permissions`);

  // Seed test users
  console.log('Seeding users...');

  // Admin user - has all permissions
  const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword },
    create: {
      username: 'admin',
      password: adminPassword,
    },
  });

  // Assign all permissions to admin
  for (const permission of permissions) {
    await prisma.userPermission.upsert({
      where: {
        id: -1, // Will not match, forcing create
      },
      update: {},
      create: {
        userId: admin.id,
        permissionId: permission.id,
      },
    }).catch(() => {
      // Ignore if already exists (upsert workaround for composite unique)
    });
  }

  // Check if admin already has permissions, if not add them
  const existingAdminPerms = await prisma.userPermission.findMany({
    where: { userId: admin.id },
  });

  if (existingAdminPerms.length === 0) {
    await prisma.userPermission.createMany({
      data: permissions.map((p) => ({
        userId: admin.id,
        permissionId: p.id,
      })),
    });
  }

  console.log(`✅ Created admin user (username: admin, password: admin123)`);

  // Regular user - has only READ_USER permission
  const userPassword = await bcrypt.hash('user123', SALT_ROUNDS);
  const regularUser = await prisma.user.upsert({
    where: { username: 'user' },
    update: { password: userPassword },
    create: {
      username: 'user',
      password: userPassword,
    },
  });

  const readPermission = permissions.find((p) => p.name === 'READ_USER');
  if (readPermission) {
    const existingUserPerms = await prisma.userPermission.findMany({
      where: { userId: regularUser.id },
    });

    if (existingUserPerms.length === 0) {
      await prisma.userPermission.create({
        data: {
          userId: regularUser.id,
          permissionId: readPermission.id,
        },
      });
    }
  }

  console.log(`✅ Created regular user (username: user, password: user123)`);

  console.log('\n🌱 Seed completed successfully!');
  console.log('\nTest accounts:');
  console.log('  Admin: username=admin, password=admin123 (all permissions)');
  console.log('  User:  username=user, password=user123 (READ_USER only)');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
