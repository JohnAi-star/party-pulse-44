import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/users', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            transactions: true,
          },
        },
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get all transactions
router.get('/transactions', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        booking: {
          include: {
            activity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

export default router;