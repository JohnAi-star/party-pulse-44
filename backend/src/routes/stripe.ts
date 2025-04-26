import { Router } from 'express';
import { PrismaClient, PaymentStatus, BookingStatus } from '@prisma/client';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Create checkout session
router.post('/create-checkout-session', authenticate, async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        activity: true,
        user: true,
      },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.userId !== req.user!.id) {
      throw new ApiError(403, 'Unauthorized');
    }

    const totalAmount = booking.activity.priceFrom * booking.groupSize;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: booking.activity.title,
              description: `Group size: ${booking.groupSize}`,
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/bookings/${booking.id}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/bookings/${booking.id}/cancel`,
      metadata: {
        bookingId: booking.id,
        userId: booking.userId,
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        bookingId: booking.id,
        userId: booking.userId,
        amount: totalAmount,
        currency: 'gbp',
        status: PaymentStatus.PENDING,
        stripeId: session.id,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    next(error);
  }
});

// Webhook handler
router.post('/webhook', async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await prisma.$transaction([
          prisma.transaction.update({
            where: {
              stripeId: session.id,
            },
            data: {
              status: PaymentStatus.COMPLETED,
            },
          }),
          prisma.booking.update({
            where: {
              id: bookingId,
            },
            data: {
              status: BookingStatus.CONFIRMED,
            },
          }),
        ]);
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

export default router;