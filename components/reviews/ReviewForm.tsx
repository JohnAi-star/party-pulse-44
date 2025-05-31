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
  activityId: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({ activityId, onSubmitSuccess }: ReviewFormProps) {
  const { getToken, isSignedIn, userId } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(
      !!activityId &&
      rating > 0 &&
      title.trim().length >= 5 &&
      content.trim().length >= 20
    );
  }, [activityId, rating, title, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
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
          activityId,
          rating,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (responseData.code === 'PROFILE_ERROR') {
          throw new Error('Please complete your profile setup first');
        }
        if (responseData.code === 'ACTIVITY_NOT_FOUND') {
          throw new Error('This activity no longer exists');
        }
        throw new Error(responseData.message || 'Failed to submit review');
      }

      toast({
        title: "Success!",
        description: "Your review has been submitted for approval",
        duration: 3000,
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
        description: error.message || "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Share Your Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(index)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(index)}
                  disabled={loading}
                  aria-label={`Rate ${index} star${index !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      index <= (hoverRating || rating)
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
            <label className="text-sm font-medium leading-none" htmlFor="title">
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
              className="text-base"
            />
            {title.trim().length < 5 && title.length > 0 && (
              <p className="text-sm text-red-500">Title must be at least 5 characters</p>
            )}
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="content">
              Review *
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={5}
              required
              minLength={20}
              maxLength={1000}
              disabled={loading}
              className="text-base min-h-[120px]"
            />
            <div className="flex justify-between items-center">
              {content.trim().length < 20 && content.length > 0 && (
                <p className="text-sm text-red-500">Review must be at least 20 characters</p>
              )}
              <span className={`text-xs ml-auto ${
                content.trim().length < 20 ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {content.trim().length}/1000 characters
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
            disabled={loading || !formValid}
            aria-disabled={loading || !formValid}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}