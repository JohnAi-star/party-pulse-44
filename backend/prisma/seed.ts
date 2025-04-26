import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MOCK_ACTIVITIES } from '../../lib/constants';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@partypulse.com' },
    update: {},
    create: {
      email: 'admin@partypulse.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      passwordHash: userPassword,
      role: Role.USER,
    },
  });

  // Create activities
  for (const activity of MOCK_ACTIVITIES) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {},
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        city: activity.city,
        priceFrom: activity.priceFrom,
        image: activity.image,
        category: activity.category,
        rating: activity.rating,
        duration: activity.duration,
        groupSize: activity.groupSize,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });