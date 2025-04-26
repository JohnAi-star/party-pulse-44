import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiError } from '../utils/ApiError';

const router = Router();
const prisma = new PrismaClient();

// Create booking
router.post(
  '/',
  authenticate,
  [
    body('activityId').notEmpty(),
    body('date').isISO8601(),
    body('groupSize').isInt({ min: 1 }),
    validate,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId, date, groupSize } = req.body;

      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (!activity) {
        throw new ApiError(404, 'Activity not found');
      }

      const booking = await prisma.booking.create({
        data: {
          userId: req.user!.id,
          activityId,
          date: new Date(date),
          groupSize,
        },
        include: {
          activity: true,
        },
      });

      res.json(booking);
    } catch (error) {
      next(error);
    }
  }
);

// Get user's bookings
router.get('/', authenticate, async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        activity: true,
        transaction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

export default router;