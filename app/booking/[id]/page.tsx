"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Clock, CreditCard } from 'lucide-react';
import { bookings } from '@/lib/admin-api';

interface Booking {
  id: string;
  date: string;
  groupSize: number;
  status: string;
  activity: {
    title: string;
    description: string;
    city: string;
    image?: string; // Optional if not always present
    duration: string;
    priceFrom?: number; // Optional if not always present
  };
  transaction?: {
    amount: number;
    status: string;
    createdAt: string;
  };
};

export default function BookingDetailsPage() {
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        try {
          const data = await bookings.getBooking(params.id as string);
          setBooking(data);
        } catch (error) {
          console.error('Failed to fetch booking:', error);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground">
            The booking you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
        <p className="text-muted-foreground">
          Reference: #{booking.id.slice(0, 8)}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{booking.activity.title}</h3>
                <p className="text-muted-foreground">{booking.activity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{booking.activity.city}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{booking.activity.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{booking.groupSize} people</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{format(new Date(booking.date), 'PPP')}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span>Status</span>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                {booking.transaction && (
                  <div className="flex items-center justify-between">
                    <span>Payment</span>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">
                        £{booking.transaction.amount}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Download Ticket
              </Button>
              <Button className="w-full" variant="outline">
                Contact Support
              </Button>
              {booking.status === 'confirmed' && (
                <Button className="w-full" variant="destructive">
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Meeting Point</h4>
                <p className="text-sm text-muted-foreground">
                  Please arrive 15 minutes before your scheduled time at the main entrance.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What to Bring</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Comfortable clothing</li>
                  <li>Valid ID</li>
                  <li>Booking confirmation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cancellation Policy</h4>
                <p className="text-sm text-muted-foreground">
                  Free cancellation up to 48 hours before the activity.
                  Cancellations made within 48 hours are non-refundable.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}