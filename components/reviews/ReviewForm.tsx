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

const STORAGE_KEY = 'pending_reviews';

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
      return saved ? JSON.parse(saved) : {
        rating: 0,
        title: '',
        content: ''
      };
    }
    return { rating: 0, title: '', content: '' };
  });

  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Save to localStorage when form data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...formData,
        activityId
      }));
    }
  }, [formData, activityId]);

  // Validate form
  useEffect(() => {
    setFormValid(
      !!activityId &&
      formData.rating > 0 &&
      formData.title.trim().length >= 5 &&
      formData.content.trim().length >= 20
    );
  }, [activityId, formData]);

  // Retry pending submissions when user logs in
  useEffect(() => {
    if (isSignedIn) {
      retryPendingSubmissions();
    }
  }, [isSignedIn]);

  const retryPendingSubmissions = async () => {
    try {
      const pending = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      if (pending.activityId && pending.rating > 0) {
        const token = await getToken();
        if (!token) {
          throw new Error('Authentication token not found. Please sign in again.');
        }
        await submitReview(pending, token);
        window.localStorage.removeItem(STORAGE_KEY);
        toast({
          title: "Saved review submitted!",
          description: "Your pending review has been successfully submitted."
        });
      }
    } catch (error) {
      console.error('Failed to submit pending review:', error);
    }
  };

  const submitReview = async (reviewData: any, token: string) => {
    const response = await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Submission failed');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (!formValid) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields correctly",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not found. Please sign in again.');
      }
      const reviewData = {
        activityId,
        rating: formData.rating,
        title: formData.title.trim(),
        content: formData.content.trim()
      };

      await submitReview(reviewData, token);

      // Success case
      toast({ title: "Review submitted successfully!" });
      window.localStorage.removeItem(STORAGE_KEY);
      setFormData({ rating: 0, title: '', content: '' });
      if (onSubmitSuccess) onSubmitSuccess();

    } catch (error) {
      console.error('Submission error:', error);
      
      // Save to localStorage as fallback
      const pending = {
        activityId,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        timestamp: new Date().toISOString()
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));

      toast({
        title: "Review saved offline",
        description: "We'll submit it automatically when you're back online.",
        variant: "default"
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
                  className="focus:outline-none"
                  disabled={loading}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Your review title"
              required
              minLength={5}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Review</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Share your thoughts..."
              required
              minLength={20}
              rows={4}
              disabled={loading}
            />
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