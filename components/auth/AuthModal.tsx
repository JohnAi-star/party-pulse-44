'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function AuthModal({ isOpen, onCloseAction }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { signIn, signUp }: any = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
      } else {
        await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          firstName: formData.name,
        });
        toast({
          title: 'Account created!',
          description: 'You have successfully signed up.',
        });
      }
      onCloseAction();
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorTitle = 'Error';

      if (error instanceof AxiosError) {
        console.error('Auth error details:', {
          code: error.code,
          message: error.message,
          response: error.response?.data
        });

        if (error.code === 'ERR_NETWORK') {
          errorTitle = 'Connection Error';
          errorMessage = 'Unable to connect to the server. Please ensure the backend server is running and try again.';
        } else if (error.code === 'ECONNABORTED') {
          errorTitle = 'Timeout Error';
          errorMessage = 'The request timed out. Please check your internet connection and try again.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
          errorMessage = 'Invalid credentials. Please try again.';
        } else if (error.response?.status === 409) {
          errorMessage = 'An account with this email already exists.';
        }
      }

      toast({
        variant: 'destructive',
        title: errorTitle,
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? 'Log in to your account' : 'Create an account'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              className="text-purple-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}