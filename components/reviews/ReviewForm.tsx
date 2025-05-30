"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  activityId: string; // Changed to strictly string (UUID)
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({ activityId, onSubmitSuccess }: ReviewFormProps) {
  const { getToken, isSignedIn, userId: clerkUserId } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Validate activityId is a UUID when component mounts
  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(activityId)) {
      toast({
        variant: "destructive",
        title: "Invalid Activity",
        description: "The activity ID format is invalid",
      });
      router.back();
    }
  }, [activityId]);

  useEffect(() => {
    setFormValid(
      rating > 0 &&
      title.trim().length >= 5 &&
      content.trim().length >= 20
    );
  }, [rating, title, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !clerkUserId) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to submit a review",
      });
      router.push('/sign-in');
      return;
    }

    if (!formValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all fields correctly (Title: min 5 chars, Review: min 20 chars)",
      });
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activityId, // UUID string
          rating,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(responseData.error || 'Activity not found');
        } else if (response.status === 400) {
          throw new Error(responseData.error || 'Invalid request data');
        } else {
          throw new Error(responseData.error || 'Failed to submit review');
        }
      }

      toast({
        title: "Success!",
        description: "Your review has been submitted for approval",
      });

      // Reset form
      setRating(0);
      setTitle('');
      setContent('');

      if (onSubmitSuccess) onSubmitSuccess();

    } catch (error: any) {
      console.error('Review submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoverRating(index)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(index)}
                  disabled={loading}
                >
                  <Star
                    className={`h-6 w-6 ${index <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
            {rating === 0 && (
              <p className="text-sm text-red-500">Please select a rating</p>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              required
              minLength={5}
              maxLength={100}
              disabled={loading}
            />
            {title.trim().length < 5 && title.length > 0 && (
              <p className="text-sm text-red-500">Title must be at least 5 characters</p>
            )}
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">
              Review *
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              required
              minLength={20}
              maxLength={1000}
              disabled={loading}
            />
            <div className="flex justify-between">
              {content.trim().length < 20 && content.length > 0 && (
                <p className="text-sm text-red-500">Review must be at least 20 characters</p>
              )}
              <p className={`text-xs ml-auto ${content.trim().length < 20 ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                {content.trim().length}/1000 characters
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={loading || !formValid}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}