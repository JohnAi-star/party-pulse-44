"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { bookings } from '@/lib/api-client';

interface Booking {
    id: string;
    date: string;
    groupSize: number;
    status: string;
    activity: {
        title: string;
        city: string;
        duration: string;
        priceFrom: number;
    };
    transaction?: {
        amount: number;
        status: string;
    };
}

export default function BookingsPage() {
    const { user } = useUser();
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookings.getUserBookings();
                setUserBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                    <p className="text-muted-foreground">
                        Manage your upcoming and past activities
                    </p>
                </div>
                <Link href="/activities">
                    <Button>Browse Activities</Button>
                </Link>
            </div>

            {userBookings.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Start exploring amazing activities and create unforgettable memories
                        </p>
                        <Link href="/activities">
                            <Button>Discover Activities</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Group Size</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{booking.activity.title}</p>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {booking.activity.duration}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {format(new Date(booking.date), 'PPP')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {booking.activity.city}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-2" />
                                                {booking.groupSize} people
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/bookings/${booking.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}