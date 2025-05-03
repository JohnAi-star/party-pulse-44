"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { bookings, payments } from '@/lib/api-client';
import { loadStripe } from '@stripe/stripe-js';
import AuthModal from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Activity {
  id: string;
  title: string;
  priceFrom: number;
  availability: string[];
  groupSize: string;
  features: string[];
}

interface BookingFormProps {
  activity: Activity;
}

export default function BookingForm({ activity }: BookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [groupSize, setGroupSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { isSignedIn } = useAuth();
  const { toast } = useToast();

  // Convert availability strings to numbers for date picker
  const availableDays = activity.availability.map(day => {
    const days = {
      'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
      'Friday': 5, 'Saturday': 6, 'Sunday': 0
    };
    return days[day as keyof typeof days];
  });

  // Calculate total price based on group size
  const calculateTotalPrice = () => {
    if (!groupSize) return activity.priceFrom;
    const size = parseInt(groupSize.split('-')[0]);
    return activity.priceFrom * size;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!date || !groupSize) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a date and group size.',
      });
      return;
    }

    try {
      setLoading(true);

      // Create booking
      const booking = await bookings.create({
        activityId: activity.id,
        date: date.toISOString(),
        groupSize: parseInt(groupSize.split('-')[0]),
      });

      // Create Stripe checkout session
      const { sessionId } = await payments.createCheckoutSession(booking.id);

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => {
                  const day = date.getDay();
                  return (
                    date < new Date() || // Past dates
                    !availableDays.includes(day) // Unavailable days
                  );
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="groupSize">Group Size</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Recommended group size: {activity.groupSize}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={groupSize} onValueChange={setGroupSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select group size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1-5 people</SelectItem>
              <SelectItem value="6-10">6-10 people</SelectItem>
              <SelectItem value="11-15">11-15 people</SelectItem>
              <SelectItem value="16-20">16-20 people</SelectItem>
              <SelectItem value="21+">21+ people</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {groupSize && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per person</span>
              <span>£{activity.priceFrom}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total price</span>
              <span>£{calculateTotalPrice()}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">What's included:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {activity.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : `Book Now - From £${activity.priceFrom}pp`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By proceeding, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>

      <AuthModal
        isOpen={showAuthModal}
        onCloseAction={() => setShowAuthModal(false)}
      />
    </>
  );
}