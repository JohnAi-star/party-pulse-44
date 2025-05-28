"use client";

import { useState } from 'react';
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
  const { getToken, isSignedIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please select a star rating",
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
          title,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      toast({
        title: "Success!",
        description: "Your review has been submitted for approval",
      });

      setRating(0);
      setTitle('');
      setContent('');
      
      if (onSubmitSuccess) onSubmitSuccess();
      
    } catch (error: any) {
      console.error('Review submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Please try again later",
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
                    className={`h-6 w-6 ${
                      index <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
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
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={loading || rating === 0}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}