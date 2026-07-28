/**
 * Starter App — Admin Seed Script
 * ==================================
 * Creates 2 SUPER_ADMIN and 3 ADMIN accounts using upsert (idempotent).
 *
 * Usage:
 *   npm run seed:admin
 *
 * Credentials are read from environment variables with sensible defaults
 * so the script works out-of-the-box in development. Override them in
 * your .env file for production / staging.
 *
 * Default credentials (development only — change in production!):
 *   Super Admin 1: superadmin@starter.com      / Admin@123456
 *   Super Admin 2: owner@starter.com           / Owner@123456
 *   Admin 1:       admin@starter.com           / Admin@123456
 *   Admin 2:       manager@starter.com         / Manager@123456
 *   Admin 3:       support@starter.com         / Support@123456
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

const requiredEnv = (key: string): string => {
     const value = process.env[key]?.trim();
     if (!value) {
          throw new Error(`${key} is required. Please set it in your .env file.`);
     }
     return value;
};

const optionalEnv = (key: string, fallback: string): string => {
     const value = process.env[key]?.trim();
     return value || fallback;
};

// ---------------------------------------------------------------------------
// Admin account definitions
// ---------------------------------------------------------------------------

interface AdminSeed {
     email: string;
     password: string;
     firstName: string;
     lastName: string;
     role: UserRole;
     phone?: string;
     bio: string;
     city: string;
     country: string;
     avatarUrl: string;
}

const admins: AdminSeed[] = [
     // ---- 2 SUPER_ADMIN accounts ----
     {
          email: optionalEnv('SUPERADMIN1_EMAIL', 'superadmin@starter.com'),
          password: optionalEnv('SUPERADMIN1_PASSWORD', 'Admin@123456'),
          firstName: 'John',
          lastName: 'Doe',
          role: UserRole.SUPER_ADMIN,
          phone: '+8801711000001',
          bio: 'Founder & Chief Executive Officer. Oversees the entire platform operations.',
          city: 'Dhaka',
          country: 'Bangladesh',
          avatarUrl: 'https://i.pravatar.cc/300?u=superadmin1-starter',
     },
     {
          email: optionalEnv('SUPERADMIN2_EMAIL', 'owner@starter.com'),
          password: optionalEnv('SUPERADMIN2_PASSWORD', 'Owner@123456'),
          firstName: 'Jane',
          lastName: 'Smith',
          role: UserRole.SUPER_ADMIN,
          phone: '+8801711000002',
          bio: 'Co-founder & Chief Operating Officer. Responsible for platform governance.',
          city: 'Chattogram',
          country: 'Bangladesh',
          avatarUrl: 'https://i.pravatar.cc/300?u=superadmin2-starter',
     },
     // ---- 3 ADMIN accounts ----
     {
          email: optionalEnv('ADMIN1_EMAIL', 'admin@starter.com'),
          password: optionalEnv('ADMIN1_PASSWORD', 'Admin@123456'),
          firstName: 'Robert',
          lastName: 'Johnson',
          role: UserRole.ADMIN,
          phone: '+8801711000003',
          bio: 'Platform Content Manager. Manages data quality and system configurations.',
          city: 'Dhaka',
          country: 'Bangladesh',
          avatarUrl: 'https://i.pravatar.cc/300?u=admin1-starter',
     },
     {
          email: optionalEnv('ADMIN2_EMAIL', 'manager@starter.com'),
          password: optionalEnv('ADMIN2_PASSWORD', 'Manager@123456'),
          firstName: 'Michael',
          lastName: 'Brown',
          role: UserRole.ADMIN,
          phone: '+8801711000004',
          bio: 'Operations Manager. Oversees workflows and system maintenance.',
          city: 'Sylhet',
          country: 'Bangladesh',
          avatarUrl: 'https://i.pravatar.cc/300?u=admin2-starter',
     },
     {
          email: optionalEnv('ADMIN3_EMAIL', 'support@starter.com'),
          password: optionalEnv('ADMIN3_PASSWORD', 'Support@123456'),
          firstName: 'Emily',
          lastName: 'Davis',
          role: UserRole.ADMIN,
          phone: '+8801711000005',
          bio: 'Customer Support Lead. Handles support tickets and customer outreach.',
          city: 'Khulna',
          country: 'Bangladesh',
          avatarUrl: 'https://i.pravatar.cc/300?u=admin3-starter',
     },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
     const databaseUrl = requiredEnv('DATABASE_URL');

     // Validate password strength
     for (const admin of admins) {
          if (admin.password.length < 8) {
               throw new Error(
                    `Password for ${admin.email} must be at least 8 characters long`,
               );
          }
     }

     const pool = new Pool({ connectionString: databaseUrl });
     const adapter = new PrismaPg(pool);
     const prisma = new PrismaClient({ adapter });

     try {
          console.log('\n🔐  Seeding admin accounts...\n');

          const results: Array<{
               email: string;
               role: UserRole;
               status: UserStatus;
               action: 'created' | 'updated';
          }> = [];

          for (const admin of admins) {
               const hashedPassword = await bcrypt.hash(admin.password, 10);

               // Detect whether the user already exists to report created vs updated
               const existing = await prisma.user.findUnique({
                    where: { email: admin.email },
                    select: { id: true },
               });

               const user = await prisma.user.upsert({
                    where: { email: admin.email },
                    update: {
                         password: hashedPassword,
                         firstName: admin.firstName,
                         lastName: admin.lastName,
                         fullName: `${admin.firstName} ${admin.lastName}`,
                         role: admin.role,
                         status: UserStatus.ACTIVE,
                         phone: admin.phone,
                         bio: admin.bio,
                         city: admin.city,
                         country: admin.country,
                         avatarUrl: admin.avatarUrl,
                         emailVerified: true,
                         phoneVerified: true,
                    },
                    create: {
                         email: admin.email,
                         password: hashedPassword,
                         firstName: admin.firstName,
                         lastName: admin.lastName,
                         fullName: `${admin.firstName} ${admin.lastName}`,
                         role: admin.role,
                         status: UserStatus.ACTIVE,
                         phone: admin.phone,
                         bio: admin.bio,
                         city: admin.city,
                         country: admin.country,
                         avatarUrl: admin.avatarUrl,
                         emailVerified: true,
                         phoneVerified: true,
                    },
                    select: {
                         id: true,
                         email: true,
                         role: true,
                         status: true,
                         fullName: true,
                    },
               });

               results.push({
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    action: existing ? 'updated' : 'created',
               });

               console.log(
                    `   ${existing ? '↻ Updated' : '✓ Created'}  ${user.role.padEnd(11)} ${user.email}`,
               );
          }

          // Summary
          console.log('\n──────────────────────────────────────────────');
          console.log('  ✅  Admin seed completed successfully');
          console.log('──────────────────────────────────────────────');
          console.table(results);

          console.log('\n📋  Login Credentials (development defaults):');
          console.log('──────────────────────────────────────────────');
          console.log('  SUPER_ADMIN  superadmin@starter.com  / Admin@123456');
          console.log('  SUPER_ADMIN  owner@starter.com      / Owner@123456');
          console.log('  ADMIN        admin@starter.com      / Admin@123456');
          console.log('  ADMIN        manager@starter.com    / Manager@123456');
          console.log('  ADMIN        support@starter.com    / Support@123456');
          console.log('──────────────────────────────────────────────\n');
     } finally {
          await prisma.$disconnect();
          await pool.end();
     }
}

main().catch((error) => {
     console.error('\n❌  Admin seed failed:', error);
     process.exit(1);
});
