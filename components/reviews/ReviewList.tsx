"use client";

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  rating: number;
  title: string;
  content: string;
  created_at: string;
  helpful: number;
  verified: boolean;
  status: string;
}

interface ReviewListProps {
  activityId?: string;
  reviews?: Review[];  
  showAll?: boolean;
  onHelpful?: (reviewId: string) => void;
}

export default function ReviewList({ activityId, showAll = false, onHelpful }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = '/api/reviews';
        const params = new URLSearchParams();
        
        if (activityId) {
          params.append('activityId', activityId);
        }
        
        if (!showAll) {
          params.append('status', 'approved');
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activityId, showAll]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center text-muted-foreground">No reviews yet</div>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar_url} />
                  <AvatarFallback>
                    {review.user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.user.name}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Verified Booking
                      </span>
                    )}
                    {showAll && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        review.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), 'PP')}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-muted-foreground">{review.content}</p>
            </div>

            {onHelpful && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHelpful(review.id)}
                >
                  <span className="mr-2">👍</span>
                  Helpful ({review.helpful || 0})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}