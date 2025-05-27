"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ReviewsPage() {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activityId = searchParams.get('activityId');
  const activityName = searchParams.get('activityName');
  
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidActivity, setIsValidActivity] = useState(false);

  useEffect(() => {
    if (!activityId) {
      toast({
        variant: "destructive",
        title: "Activity Required",
        description: "Please select an activity to review",
      });
      setIsValidActivity(false);
    } else {
      setIsValidActivity(true);
    }
  }, [activityId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidActivity) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an activity first",
      });
      return;
    }

    if (!isSignedIn) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to submit a review",
      });
      return;
    }

    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please select a star rating",
      });
      return;
    }

    if (title.length < 5 || title.length > 100) {
      toast({
        variant: "destructive",
        title: "Invalid Title",
        description: "Title must be between 5-100 characters",
      });
      return;
    }

    if (content.length < 20 || content.length > 1000) {
      toast({
        variant: "destructive",
        title: "Invalid Review",
        description: "Review must be between 20-1000 characters",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          rating,
          title,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review will be visible after approval.",
      });
      
      setRating(0);
      setTitle('');
      setContent('');
      
      router.push(`/activities/${activityId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isValidActivity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No Activity Selected</h1>
          <p className="text-muted-foreground mb-6">
            Please return to an activity page and click "Write a Review" to submit your feedback.
          </p>
          <Link
            href="/activities"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700"
          >
            Browse Activities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={`/activities/${activityId}`}
          className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
        >
          <span>←</span> Back to Activity
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Write a Review</h1>

      <Card>
        <CardHeader>
          <CardTitle>Share Your Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              You're reviewing: <span className="font-medium">{activityName || 'this activity'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Your Rating *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                    disabled={loading}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                minLength={5}
                maxLength={100}
                disabled={loading}
                placeholder="Summarize your experience"
              />
              <p className="text-xs text-muted-foreground">5-100 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Your Review *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
                minLength={20}
                maxLength={1000}
                disabled={loading}
                placeholder="Tell us about your experience..."
              />
              <p className="text-xs text-muted-foreground">20-1000 characters</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={loading || rating === 0}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              All reviews are moderated before being published.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}