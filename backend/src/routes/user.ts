import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bookings: {
          include: {
            activity: true,
            transaction: true,
          },
        },
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;