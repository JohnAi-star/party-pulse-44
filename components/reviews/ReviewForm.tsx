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

const STORAGE_KEY = 'pending_review';

export default function ReviewForm({ 
  activityId,
  onSubmitSuccess 
}: {
  activityId: string;
  onSubmitSuccess?: () => void;
}) {
  const { getToken, isSignedIn, userId } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Initialize state with localStorage or defaults
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      try {
        return saved ? JSON.parse(saved) : {
          rating: 0,
          title: '',
          content: ''
        };
      } catch (e) {
        console.warn('Failed to parse saved review data', e);
        return {
          rating: 0,
          title: '',
          content: ''
        };
      }
    }
    return { rating: 0, title: '', content: '' };
  });

  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Save to localStorage when form data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...formData,
          activityId
        }));
      } catch (e) {
        console.warn('Failed to save review data to localStorage', e);
      }
    }
  }, [formData, activityId]);

  // Validate form
  useEffect(() => {
    const isValid = (
      !!activityId &&
      formData.rating > 0 &&
      formData.title.trim().length >= 5 &&
      formData.content.trim().length >= 20
    );
    setFormValid(isValid);
  }, [activityId, formData]);

  const submitReview = async (reviewData: any) => {
    try {
      console.log('Submitting review:', reviewData);
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          data: responseData
        });
        
        throw new Error(
          responseData.error || 
          responseData.details || 
          `Submission failed with status ${response.status}`
        );
      }

      console.log('Review submitted successfully:', responseData);
      return responseData;

    } catch (error) {
      console.error('Submission error details:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission initiated', {
      formData,
      isSignedIn,
      formValid,
      activityId
    });

    if (!isSignedIn) {
      toast({
        title: "Sign-in Required",
        description: "Please sign in to submit a review",
        variant: "default"
      });
      router.push('/sign-in');
      return;
    }

    if (!formValid) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields correctly (Title: min 5 chars, Review: min 20 chars)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        activityId,
        rating: formData.rating,
        title: formData.title.trim(),
        content: formData.content.trim()
      };

      const result = await submitReview(reviewData);

      // Success case
      toast({ 
        title: "Review Submitted!", 
        description: "Thank you for your feedback. Your review is pending approval.",
        duration: 5000
      });
      
      // Clear form and storage
      window.localStorage.removeItem(STORAGE_KEY);
      setFormData({ rating: 0, title: '', content: '' });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

    } catch (error: any) {
      console.error('Final submission error:', error);
      
      toast({
        title: "Submission Failed",
        description: error.message || "Couldn't submit your review. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleChange('rating', star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                  disabled={loading}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoverRating || formData.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Title (min 5 characters)</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Your review title"
              required
              minLength={5}
              disabled={loading}
              className="text-base"
              aria-describedby="title-help"
            />
            <p id="title-help" className="text-xs text-muted-foreground">
              Minimum 5 characters required
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Review (min 20 characters)</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Share your thoughts..."
              required
              minLength={20}
              rows={4}
              disabled={loading}
              className="text-base min-h-[120px]"
              aria-describedby="content-help"
            />
            <p id="content-help" className="text-xs text-muted-foreground">
              Minimum 20 characters required
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !formValid}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}